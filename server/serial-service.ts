import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { EventEmitter } from 'events';

export type SerialMessage = {
  timestamp: string;
  message: string;
};

export class SerialService extends EventEmitter {
  private port: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private portPath: string | null = null;
  private baudRate: number = 9600;
  private isConnected: boolean = false;

  constructor() {
    super();
  }

  async listPorts(): Promise<string[]> {
    try {
      const { SerialPort } = await import('serialport');
      const ports = await SerialPort.list();
      return ports.map(port => port.path);
    } catch (error) {
      console.error('Error listing ports:', error);
      return [];
    }
  }

  async connect(portPath: string, baudRate: number = 9600): Promise<void> {
    if (this.isConnected) {
      throw new Error('Already connected to a port');
    }

    return new Promise((resolve, reject) => {
      this.portPath = portPath;
      this.baudRate = baudRate;

      this.port = new SerialPort({
        path: portPath,
        baudRate: baudRate,
      }, (err) => {
        if (err) {
          this.emit('error', `Error opening port: ${err.message}`);
          reject(err);
          return;
        }

        this.isConnected = true;
        this.emit('connected', { port: portPath, baudRate });
        
        // Parser para leer líneas completas
        this.parser = this.port!.pipe(new ReadlineParser({ delimiter: '\n' }));
        
        this.parser.on('data', (line: string) => {
          const message = line.trim();
          if (message) {
            const timestamp = new Date().toLocaleString('es-ES', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
            
            this.emit('data', { timestamp, message });
          }
        });

        this.port!.on('error', (err) => {
          this.emit('error', `Serial port error: ${err.message}`);
        });

        this.port!.on('close', () => {
          this.isConnected = false;
          this.emit('disconnected');
        });

        resolve();
      });
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.port || !this.isConnected) {
        resolve();
        return;
      }

      this.port.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        
        this.isConnected = false;
        this.port = null;
        this.parser = null;
        this.portPath = null;
        resolve();
      });
    });
  }

  sendCommand(command: string): void {
    if (!this.port || !this.isConnected) {
      throw new Error('Not connected to any port');
    }

    // Enviar con CR+LF como en el código Python
    this.port.write(command + '\r\n', (err) => {
      if (err) {
        this.emit('error', `Error sending command: ${err.message}`);
      } else {
        this.emit('commandSent', command);
      }
    });
  }

  // Comandos específicos del Arduino
  startRegistration(): void {
    this.sendCommand('R');
  }

  startVerification(): void {
    this.sendCommand('V');
  }

  deleteFingerprint(id: number): void {
    this.sendCommand(`D ${id}`);
  }

  deleteAllFingerprints(): void {
    this.sendCommand('X');
  }

  stopCurrentMode(): void {
    this.sendCommand('S');
  }

  getStatus(): { connected: boolean; port: string | null; baudRate: number } {
    return {
      connected: this.isConnected,
      port: this.portPath,
      baudRate: this.baudRate,
    };
  }
}

// Singleton instance
export const serialService = new SerialService();
