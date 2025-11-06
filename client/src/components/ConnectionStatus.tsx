import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  isConnected: boolean;
  port?: string;
  baudRate?: string;
}

export default function ConnectionStatus({ isConnected, port, baudRate }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2" data-testid="connection-status">
      <div className={cn(
        "h-2 w-2 rounded-full",
        isConnected ? "bg-status-online animate-pulse" : "bg-status-offline"
      )} />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {isConnected ? "Conectado" : "Desconectado"}
        </span>
        {isConnected && port && (
          <Badge variant="secondary" className="text-xs">
            {port} @ {baudRate}
          </Badge>
        )}
      </div>
    </div>
  );
}
