# app_asistencia.py
import ttkbootstrap as ttkb
from ttkbootstrap.constants import *
import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
import serial
import serial.tools.list_ports
import threading
import queue
import time
import sqlite3
import re
from datetime import datetime
import os

# ------------------ Configuración ------------------
DB_FILE = "asistencia.db"   # base de datos local (archivo en la carpeta de la app)

# ------------------ Base de datos ------------------
def crear_bd():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS estudiantes (
        id_huella INTEGER PRIMARY KEY,
        nombre TEXT,
        grado TEXT
    )""")
    c.execute("""
    CREATE TABLE IF NOT EXISTS asistencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_huella INTEGER,
        nombre TEXT,
        grado TEXT,
        asignatura TEXT,
        fecha TEXT,
        hora TEXT
    )""")
    conn.commit()
    conn.close()

crear_bd()

# ------------------ Hilo serial (produce -> cola) ------------------
class SerialReader(threading.Thread):
    def __init__(self, port, baud, q, on_error=None):
        super().__init__(daemon=True)
        self.port = port
        self.baud = baud
        self.q = q
        self.on_error = on_error
        self._stop = threading.Event()
        self.ser = None

    def run(self):
        try:
            self.ser = serial.Serial(self.port, self.baud, timeout=1)
        except Exception as e:
            if self.on_error:
                self.on_error(f"No se pudo abrir {self.port}: {e}")
            return

        try:
            while not self._stop.is_set():
                try:
                    if self.ser.in_waiting:
                        line = self.ser.readline().decode(errors='ignore').strip()
                        if line:
                            self.q.put(line)
                    else:
                        time.sleep(0.03)
                except Exception as e:
                    if self.on_error:
                        self.on_error(f"Error lectura serial: {e}")
                    break
        finally:
            try:
                if self.ser and self.ser.is_open:
                    self.ser.close()
            except:
                pass

    def write(self, text):
        try:
            if self.ser and self.ser.is_open:
                # enviar con CR+LF para que Arduino lo reciba como desde Monitor Serial
                self.ser.write((text + "\r\n").encode())
        except Exception as e:
            if self.on_error:
                self.on_error(f"Error escritura serial: {e}")

    def stop(self):
        self._stop.set()
        try:
            if self.ser and self.ser.is_open:
                self.ser.close()
        except:
            pass

# ------------------ Aplicación ------------------
class App(ttkb.Window):
    def __init__(self):
        # tema: cambia a "cosmo", "flatly", "darkly", "superhero", etc.
        super().__init__(themename="cosmo")
        self.title("Asistencia - Sensor de Huellas (Moderno)")
        self.geometry("920x640")
        try:
            # intenta usar un icono si existe
            if os.path.exists("icon.png"):
                self.iconphoto(False, tk.PhotoImage(file="icon.png"))
        except Exception:
            pass
        self.protocol("WM_DELETE_WINDOW", self.on_close)

        # estado
        self.serial_thread = None
        self.queue = queue.Queue()
        self.modo_actual = None                  # None / "registro" / "verificacion"
        self._registration_pending = False
        self._last_handled_id = None
        self._last_handled_ts = 0

        # encabezado moderno
        header = ttkb.Label(self, text="🖐️ Sistema de Asistencia con Sensor de Huellas",
                            font=("Segoe UI", 16, "bold"), bootstyle=PRIMARY)
        header.pack(fill="x", pady=8)

        # UI
        self._build_ui()

        # estilo adicional opcional
        style = ttkb.Style()
        try:
            style.configure("TButton", font=("Segoe UI", 10, "bold"), padding=6)
            style.configure("TLabel", font=("Segoe UI", 10))
            style.configure("TEntry", padding=4)
            style.configure("TNotebook.Tab", font=("Segoe UI", 10, "bold"))
            style.configure("Treeview.Heading", font=("Segoe UI", 10, "bold"))
        except Exception:
            pass

        # poll cola
        self.after(100, self._poll_serial_queue)

    # -------------- UI --------------
    def _build_ui(self):
        top = ttk.Frame(self)
        top.pack(fill="x", padx=8, pady=6)

        ttk.Label(top, text="Puerto:").pack(side="left")
        self.port_cb = ttk.Combobox(top, width=30)
        self._refresh_ports()
        self.port_cb.pack(side="left", padx=4)

        ttk.Label(top, text="Baud:").pack(side="left", padx=(8,0))
        self.baud_cb = ttk.Combobox(top, values=["9600","57600","115200"], width=10)
        self.baud_cb.set("9600")
        self.baud_cb.pack(side="left", padx=4)

        btn_refresh = ttk.Button(top, text="Actualizar puertos", command=self._refresh_ports)
        btn_refresh.pack(side="left", padx=4)

        self.btn_connect = ttk.Button(top, text="Conectar", command=self._toggle_connection)
        self.btn_connect.pack(side="left", padx=6)

        self.lbl_status = ttk.Label(top, text="Desconectado")
        self.lbl_status.pack(side="left", padx=8)

        # Notebook
        self.tabs = ttk.Notebook(self)
        self.tabs.pack(fill="both", expand=True, padx=8, pady=6)

        # Tab Registro
        self.tab_reg = ttk.Frame(self.tabs)
        self.tabs.add(self.tab_reg, text="Registro")
        self._build_tab_registro()

        # Tab Verificación
        self.tab_ver = ttk.Frame(self.tabs)
        self.tabs.add(self.tab_ver, text="Verificación")
        self._build_tab_verificacion()

        # Tab Listados
        self.tab_list = ttk.Frame(self.tabs)
        self.tabs.add(self.tab_list, text="Listados")
        self._build_tab_listados()

    def _refresh_ports(self):
        ports = [p.device for p in serial.tools.list_ports.comports()]
        if not ports:
            ports = ["(no ports)"]
        self.port_cb['values'] = ports
        if ports and (self.port_cb.get() == "" or self.port_cb.get() is None):
            self.port_cb.set(ports[0])

    # ----- Registro tab -----
    def _build_tab_registro(self):
        frame_conn = ttk.LabelFrame(self.tab_reg, text="Conexión")
        frame_conn.pack(fill="x", padx=8, pady=6)
        ttk.Label(frame_conn, text="Puerto:").grid(row=0,column=0,padx=4,pady=4,sticky="w")
        ttk.Label(frame_conn, text="Baud:").grid(row=0,column=2,padx=4,pady=4,sticky="w")

        self.port_reg = ttk.Combobox(frame_conn, values=self.port_cb['values'], width=20, state="readonly")
        self.port_reg.grid(row=0,column=1,padx=4,pady=4)
        self.port_reg.set(self.port_cb.get() if self.port_cb.get() else "")
        self.baud_reg = ttk.Combobox(frame_conn, values=self.baud_cb['values'], width=10, state="readonly")
        self.baud_reg.grid(row=0,column=3,padx=4,pady=4)
        self.baud_reg.set(self.baud_cb.get())

        ttk.Button(frame_conn, text="Usar selección arriba", command=self._sync_top_selection).grid(row=0,column=4,padx=6)

        frame_ctrl = ttk.LabelFrame(self.tab_reg, text="Control de registro")
        frame_ctrl.pack(fill="x", padx=8, pady=6)
        self.btn_start_reg = ttk.Button(frame_ctrl, text="Iniciar Registro (R)", command=self.iniciar_registro)
        self.btn_start_reg.pack(side="left", padx=6, pady=6)
        self.btn_stop_reg = ttk.Button(frame_ctrl, text="Detener", command=self._stop_mode)
        self.btn_stop_reg.pack(side="left", padx=6, pady=6)

        ttk.Label(self.tab_reg, text="Log de Registro:").pack(anchor="w", padx=8)
        self.log_reg = tk.Text(self.tab_reg, height=14, state="disabled")
        self.log_reg.pack(fill="both", expand=False, padx=8, pady=6)

        # --- controles de borrado añadidos aquí para no tocar el resto del archivo ---
        frame_del = ttk.LabelFrame(self.tab_reg, text="Borrado de huellas")
        frame_del.pack(fill="x", padx=8, pady=6)

        ttk.Label(frame_del, text="ID de huella:").pack(side="left", padx=4)
        self._id_entry = ttk.Entry(frame_del, width=8)
        self._id_entry.pack(side="left", padx=4)

        ttk.Button(frame_del, text="Eliminar ID (D <ID>)", command=self._eliminar_especifica).pack(side="left", padx=6)
        ttk.Button(frame_del, text="Eliminar TODAS (X)", command=self._eliminar_todas).pack(side="left", padx=6)

    def _sync_top_selection(self):
        self.port_reg.set(self.port_cb.get())
        self.baud_reg.set(self.baud_cb.get())

    def log_registro(self, txt):
        self.log_reg.config(state="normal")
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.log_reg.insert("end", f"[{ts}] {txt}\n")
        self.log_reg.see("end")
        self.log_reg.config(state="disabled")

    # ----- Verificación tab -----
    def _build_tab_verificacion(self):
        frame = ttk.LabelFrame(self.tab_ver, text="Control de verificación")
        frame.pack(fill="x", padx=8, pady=6)

        ttk.Label(frame, text="Asignatura:").grid(row=0,column=0,padx=6,pady=6)
        self.combo_subject = ttk.Combobox(frame, values=["Matemáticas","Ciencias","Historia","Lengua"], state="readonly")
        self.combo_subject.grid(row=0,column=1,padx=6,pady=6)
        self.combo_subject.current(0)

        self.btn_start_ver = ttk.Button(frame, text="Iniciar Verificación (V)", command=self.iniciar_verificacion)
        self.btn_start_ver.grid(row=0,column=2,padx=6,pady=6)
        self.btn_stop_ver = ttk.Button(frame, text="Detener", command=self._stop_mode)
        self.btn_stop_ver.grid(row=0,column=3,padx=6,pady=6)

        ttk.Label(self.tab_ver, text="Log de Verificación:").pack(anchor="w", padx=8)
        self.log_ver = tk.Text(self.tab_ver, height=18, state="disabled")
        self.log_ver.pack(fill="both", expand=True, padx=8, pady=6)

    def log_verificacion(self, txt):
        self.log_ver.config(state="normal")
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.log_ver.insert("end", f"[{ts}] {txt}\n")
        self.log_ver.see("end")
        self.log_ver.config(state="disabled")

    # ----- Listados tab -----
    def _build_tab_listados(self):
        ctrl = ttk.LabelFrame(self.tab_list, text="Filtros")
        ctrl.pack(fill="x", padx=8, pady=6)
        ttk.Label(ctrl, text="Asignatura:").grid(row=0,column=0,padx=6,pady=6)
        self.filter_subj = ttk.Entry(ctrl, width=20); self.filter_subj.grid(row=0,column=1,padx=6)
        ttk.Label(ctrl, text="Grado:").grid(row=0,column=2,padx=6,pady=6)
        self.filter_grade = ttk.Entry(ctrl, width=20); self.filter_grade.grid(row=0,column=3,padx=6)
        ttk.Button(ctrl, text="Filtrar", command=self.mostrar_listado).grid(row=0,column=4,padx=6)

        self.tree = ttk.Treeview(self.tab_list, columns=("id_huella","nombre","grado","asignatura","fecha","hora"), show="headings")
        for c in self.tree["columns"]:
            self.tree.heading(c, text=c.capitalize())
            self.tree.column(c, width=120)
        self.tree.pack(fill="both", expand=True, padx=8, pady=6)

    def mostrar_listado(self):
        for r in self.tree.get_children(): self.tree.delete(r)
        conn = sqlite3.connect(DB_FILE); c = conn.cursor()
        query = "SELECT id_huella, nombre, grado, asignatura, fecha, hora FROM asistencias WHERE 1=1"
        params = []
        if self.filter_subj.get():
            query += " AND asignatura LIKE ?"; params.append(f"%{self.filter_subj.get()}%")
        if self.filter_grade.get():
            query += " AND grado LIKE ?"; params.append(f"%{self.filter_grade.get()}%")
        for row in c.execute(query, params):
            self.tree.insert("", "end", values=row)
        conn.close()

    # -------------- Control de modos --------------
    def iniciar_registro(self):
        if not self._ensure_connected():
            return
        self.modo_actual = "registro"
        self._registration_pending = True
        self._last_handled_id = None
        self._last_handled_ts = 0
        self._send_command("R")
        self.log_registro("Modo REGISTRO activado. Esperando huella...")

    def iniciar_verificacion(self):
        if not self._ensure_connected():
            return
        self.modo_actual = "verificacion"
        self._send_command("V")
        subj = self.combo_subject.get()
        self.log_verificacion(f"Modo VERIFICACIÓN activado. Asignatura: {subj}. Coloque el dedo...")

    def _stop_mode(self):
        # detener modo (no enviar comando especial al Arduino; solo cambiar estado)
        prev = self.modo_actual
        self.modo_actual = None
        self._registration_pending = False
        self.log_registro(f"Se detuvo el modo: {prev}")
        self.log_verificacion(f"Se detuvo el modo: {prev}")

    # -------------- Serial / cola --------------
    def _toggle_connection(self):
        if self.serial_thread:
            self._disconnect_serial()
            return
        port = self.port_cb.get()
        baud = int(self.baud_cb.get())
        if "(no ports)" in port:
            messagebox.showwarning("Puerto", "No hay puertos disponibles.")
            return
        self._connect_serial(port, baud)

    def _connect_serial(self, port, baud):
        # stop prev
        if self.serial_thread:
            self.serial_thread.stop()
        self.queue = queue.Queue()
        self.serial_thread = SerialReader(port, baud, self.queue, on_error=self._on_serial_error)
        self.serial_thread.start()
        self.lbl_status.config(text=f"Conectado: {port} @ {baud}")
        self.btn_connect.config(text="Desconectar")
        # sync port selectors
        self.port_cb.set(port); self.port_reg.set(port); self.port_reg['values'] = self.port_cb['values']
        self.log_registro(f"Conectado a {port} @ {baud}")

    def _disconnect_serial(self):
        if self.serial_thread:
            self.serial_thread.stop()
            self.serial_thread = None
        self.lbl_status.config(text="Desconectado")
        self.btn_connect.config(text="Conectar")
        self.log_registro("Desconectado del puerto serial.")

    def _on_serial_error(self, msg):
        messagebox.showerror("Serial", msg)
        self._disconnect_serial()

    def _ensure_connected(self):
        if not self.serial_thread:
            messagebox.showwarning("Serial", "Conecte el puerto serial primero.")
            return False
        return True

    def _send_command(self, cmd):
        if not self._ensure_connected(): return
        try:
            self.serial_thread.write(cmd)
        except Exception as e:
            messagebox.showerror("Serial", f"Error enviando comando: {e}")

    def _poll_serial_queue(self):
        try:
            while not self.queue.empty():
                line = self.queue.get_nowait()
                self._handle_serial_line(line)
        except Exception as e:
            print("Error procesando cola:", e)
        self.after(100, self._poll_serial_queue)

    # -------------- Manejo de líneas serial --------------
    def _handle_serial_line(self, line):
        # línea recibida del Arduino
        texto = line.strip()
        # imprimir en logs según modo (mensajes informativos)
        if self.modo_actual == "registro":
            self.log_registro(f"{texto}")
        elif self.modo_actual == "verificacion":
            self.log_verificacion(f"{texto}")
        else:
            # si no hay modo, mostramos en registro
            self.log_registro(f"{texto}")

        # Buscar patrones que contengan ID definitivo
        # Acepta: REGISTRO_OK:14, GUARDADO_ID:14, ENCONTRADO_ID:14, FOUND=14, ID=14, "ID #14", "ID:14"
        m = re.search(r'(?:REGISTRO_OK|GUARDADO_ID|ENCONTRADO_ID|FOUND|ID)[\s:=#]*([0-9]{1,6})', texto, re.IGNORECASE)
        if m:
            id_val = int(m.group(1))
        else:
            # fallback: si la línea es sólo un número, considerarlo (solo en modo activo)
            m2 = re.match(r'^\s*([0-9]{1,6})\s*$', texto)
            id_val = int(m2.group(1)) if m2 else None

        if id_val is None:
            return

        # debounce: ignorar repeticiones rápidas del mismo ID
        now_ts = time.time()
        if self._last_handled_id == id_val and (now_ts - self._last_handled_ts) < 4:
            # ignorar repetición
            return
        self._last_handled_id = id_val
        self._last_handled_ts = now_ts

        # manejar según modo
        if self.modo_actual == "registro" and self._registration_pending:
            # manejar registro SOLO UNA VEZ por inicio
            self._registration_pending = False
            # solicitar nombre/grado en hilo principal (after)
            self.after(50, lambda idhv=id_val: self._ask_and_save_student(idhv))
            # salir del modo (evita nuevos prompts)
            self.modo_actual = None
            return
        if self.modo_actual == "verificacion":
            # procesar verificación
            self.after(10, lambda idhv=id_val: self.procesar_verificacion(idhv))
            # si quieres que verificación sea por única pasada, descomenta:
            # self.modo_actual = None
            return

    # -------------- Registro: pedir y guardar --------------
    def _ask_and_save_student(self, id_huella):
        # diálogo en hilo principal
        nombre = simpledialog.askstring("Registrar Estudiante", f"Ingrese el nombre para ID {id_huella}:")
        if nombre is None:
            messagebox.showwarning("Registro", "Registro cancelado.")
            return
        grado = simpledialog.askstring("Registrar Estudiante", f"Ingrese el grado para {nombre}:")
        if grado is None:
            messagebox.showwarning("Registro", "Registro cancelado.")
            return

        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("INSERT OR REPLACE INTO estudiantes (id_huella, nombre, grado) VALUES (?, ?, ?)",
                  (id_huella, nombre.strip(), grado.strip()))
        conn.commit()
        conn.close()
        messagebox.showinfo("Registro", f"Estudiante {nombre} ({grado}) guardado con ID {id_huella}.")
        self.log_registro(f"✅ Registrado: {nombre} | {grado} | ID {id_huella}")

    # -------------- Verificación: procesar y guardar asistencia --------------
    def procesar_verificacion(self, id_huella):
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("SELECT nombre, grado FROM estudiantes WHERE id_huella=?", (id_huella,))
        row = c.fetchone()
        if row:
            nombre, grado = row
            asignatura = self.combo_subject.get()
            fecha = datetime.now().strftime("%Y-%m-%d")
            hora = datetime.now().strftime("%H:%M:%S")
            c.execute("INSERT INTO asistencias (id_huella, nombre, grado, asignatura, fecha, hora) VALUES (?, ?, ?, ?, ?, ?)",
                      (id_huella, nombre, grado, asignatura, fecha, hora))
            conn.commit()
            self.log_verificacion(f"✅ {nombre} ({grado}) - {asignatura} - {fecha} {hora}")
            # opcional: mostrar notificación
            # messagebox.showinfo("Asistencia", f"Asistencia registrada: {nombre} ({grado})")
        else:
            self.log_verificacion(f"⚠️ ID {id_huella} no registrado en DB.")
        conn.close()

    # ---------- Funciones de borrado (interfaz) ----------
    def _eliminar_especifica(self):
        id_val = self._id_entry.get().strip()
        if not id_val:
            messagebox.showwarning("Borrar Huella", "Ingrese un ID válido.")
            return
        if not id_val.isdigit():
            messagebox.showwarning("Borrar Huella", "El ID debe ser numérico.")
            return
        if not self._ensure_connected():
            return
        ok = messagebox.askyesno("Confirmar", f"¿Eliminar la huella con ID #{id_val}?")
        if not ok:
            return
        # enviar comando D <ID>
        self._send_command(f"D {id_val}")
        self.log_registro(f"➡️ Comando enviado: D {id_val}")

    def _eliminar_todas(self):
        if not self._ensure_connected():
            return
        ok = messagebox.askyesno("Confirmar", "¿Eliminar TODAS las huellas del sensor? Esta acción es irreversible.")
        if not ok:
            return
        self._send_command("X")
        self.log_registro("➡️ Comando enviado: X (Eliminar todas las huellas)")

    # -------------- Cerrar app --------------
    def on_close(self):
        if self.serial_thread:
            self.serial_thread.stop()
            time.sleep(0.1)
        self.destroy()

# ------------------ Ejecutar ------------------
if __name__ == "__main__":
    app = App()
    app.mainloop()

