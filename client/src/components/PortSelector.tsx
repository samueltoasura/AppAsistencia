import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

interface PortSelectorProps {
  availablePorts: string[];
  selectedPort: string;
  baudRate: string;
  onPortChange: (port: string) => void;
  onBaudRateChange: (rate: string) => void;
  onRefresh: () => void;
  onConnect: () => void;
  isConnected: boolean;
}

const baudRates = ["9600", "57600", "115200"];

export default function PortSelector({
  availablePorts,
  selectedPort,
  baudRate,
  onPortChange,
  onBaudRateChange,
  onRefresh,
  onConnect,
  isConnected,
}: PortSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-3" data-testid="port-selector">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Puerto:</label>
        <Select value={selectedPort} onValueChange={onPortChange} disabled={isConnected}>
          <SelectTrigger className="w-[180px]" data-testid="select-port">
            <SelectValue placeholder="Seleccionar puerto" />
          </SelectTrigger>
          <SelectContent>
            {availablePorts.map((port) => (
              <SelectItem key={port} value={port}>
                {port}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Baudios:</label>
        <Select value={baudRate} onValueChange={onBaudRateChange} disabled={isConnected}>
          <SelectTrigger className="w-[120px]" data-testid="select-baud">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {baudRates.map((rate) => (
              <SelectItem key={rate} value={rate}>
                {rate}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        disabled={isConnected}
        data-testid="button-refresh-ports"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>

      <Button
        onClick={onConnect}
        variant={isConnected ? "destructive" : "default"}
        data-testid="button-connect"
      >
        {isConnected ? "Desconectar" : "Conectar"}
      </Button>
    </div>
  );
}
