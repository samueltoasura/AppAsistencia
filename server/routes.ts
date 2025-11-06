import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { serialService } from "./serial-service";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket para comunicación en tiempo real con Arduino
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  // Broadcast a todos los clientes conectados
  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Eventos del servicio serial
  serialService.on('data', (data) => {
    broadcast({ type: 'serial-data', ...data });
  });

  serialService.on('connected', (data) => {
    broadcast({ type: 'serial-connected', ...data });
  });

  serialService.on('disconnected', () => {
    broadcast({ type: 'serial-disconnected' });
  });

  serialService.on('error', (message) => {
    broadcast({ type: 'serial-error', message });
  });

  serialService.on('commandSent', (command) => {
    broadcast({ type: 'command-sent', command });
  });

  // WebSocket connection handler
  wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado');
    
    // Enviar estado actual al conectarse
    ws.send(JSON.stringify({ 
      type: 'serial-status', 
      ...serialService.getStatus() 
    }));

    ws.on('close', () => {
      console.log('Cliente WebSocket desconectado');
    });
  });

  // API endpoints para control del puerto serial
  
  // Listar puertos disponibles
  app.get("/api/serial/ports", async (_req, res) => {
    try {
      const ports = await serialService.listPorts();
      res.json({ ports });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Obtener estado de la conexión
  app.get("/api/serial/status", (_req, res) => {
    res.json(serialService.getStatus());
  });

  // Conectar al puerto serial
  app.post("/api/serial/connect", async (req, res) => {
    try {
      const { port, baudRate } = req.body;
      if (!port) {
        return res.status(400).json({ message: "Port is required" });
      }
      
      await serialService.connect(port, baudRate || 9600);
      res.json({ message: "Connected successfully", ...serialService.getStatus() });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Desconectar del puerto serial
  app.post("/api/serial/disconnect", async (_req, res) => {
    try {
      await serialService.disconnect();
      res.json({ message: "Disconnected successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Enviar comando al Arduino
  app.post("/api/serial/command", (req, res) => {
    try {
      const { command } = req.body;
      if (!command) {
        return res.status(400).json({ message: "Command is required" });
      }
      
      serialService.sendCommand(command);
      res.json({ message: "Command sent successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Comandos específicos del Arduino
  
  // Iniciar registro de huella
  app.post("/api/serial/register", (_req, res) => {
    try {
      serialService.startRegistration();
      res.json({ message: "Registration started" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Iniciar verificación de huella
  app.post("/api/serial/verify", (_req, res) => {
    try {
      serialService.startVerification();
      res.json({ message: "Verification started" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Eliminar huella por ID
  app.post("/api/serial/delete/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      serialService.deleteFingerprint(id);
      res.json({ message: `Delete command sent for ID ${id}` });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Eliminar todas las huellas
  app.post("/api/serial/delete-all", (_req, res) => {
    try {
      serialService.deleteAllFingerprints();
      res.json({ message: "Delete all command sent" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Detener modo actual
  app.post("/api/serial/stop", (_req, res) => {
    try {
      serialService.stopCurrentMode();
      res.json({ message: "Stop command sent" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
