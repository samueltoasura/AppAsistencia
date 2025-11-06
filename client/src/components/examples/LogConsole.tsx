import LogConsole from '../LogConsole'

export default function LogConsoleExample() {
  const sampleLogs = [
    { timestamp: "2025-01-15 10:23:45", message: "Conectado a COM3 @ 9600" },
    { timestamp: "2025-01-15 10:24:12", message: "Modo REGISTRO activado. Esperando huella..." },
    { timestamp: "2025-01-15 10:24:15", message: "Huella detectada" },
    { timestamp: "2025-01-15 10:24:17", message: "✅ Registrado: Juan Pérez | 5to Grado | ID 14" },
  ]

  return <LogConsole title="Log de Registro" logs={sampleLogs} />
}
