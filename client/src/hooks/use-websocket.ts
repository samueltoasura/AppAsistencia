import { useEffect, useRef, useState, useCallback } from 'react';

export type SerialMessage = {
  timestamp: string;
  message: string;
};

type WebSocketMessage = 
  | { type: 'serial-data'; timestamp: string; message: string }
  | { type: 'serial-connected'; port: string; baudRate: number }
  | { type: 'serial-disconnected' }
  | { type: 'serial-error'; message: string }
  | { type: 'command-sent'; command: string }
  | { type: 'serial-status'; connected: boolean; port: string | null; baudRate: number };

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<SerialMessage[]>([
    { 
      timestamp: new Date().toLocaleString('es-ES'),
      message: 'Sistema iniciado. Esperando conexión a Arduino...'
    }
  ]);
  const [serialStatus, setSerialStatus] = useState<{
    connected: boolean;
    port: string | null;
    baudRate: number;
  }>({
    connected: false,
    port: null,
    baudRate: 9600,
  });

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs(prev => [...prev, { timestamp, message }]);
  }, []);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const connect = () => {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        addLog('Conectado al servidor WebSocket');
      };

      ws.current.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);

          switch (data.type) {
            case 'serial-data':
              addLog(data.message);
              break;

            case 'serial-connected':
              setSerialStatus({
                connected: true,
                port: data.port,
                baudRate: data.baudRate,
              });
              addLog(`✅ Conectado a Arduino en ${data.port} a ${data.baudRate} baudios`);
              break;

            case 'serial-disconnected':
              setSerialStatus({
                connected: false,
                port: null,
                baudRate: 9600,
              });
              addLog('⚠️ Desconectado de Arduino');
              break;

            case 'serial-error':
              addLog(`❌ Error: ${data.message}`);
              break;

            case 'command-sent':
              addLog(`➡️ Comando enviado: ${data.command}`);
              break;

            case 'serial-status':
              setSerialStatus({
                connected: data.connected,
                port: data.port,
                baudRate: data.baudRate,
              });
              if (data.connected && data.port) {
                addLog(`Estado: Conectado a ${data.port}`);
              }
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        addLog('Desconectado del servidor WebSocket. Reintentando...');
        
        // Reintentar conexión después de 3 segundos
        setTimeout(connect, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    isWsConnected: isConnected,
    logs,
    addLog,
    clearLogs,
    serialStatus,
  };
}
