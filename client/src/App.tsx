import { Switch, Route } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import ConnectionStatus from "@/components/ConnectionStatus";
import PortSelector from "@/components/PortSelector";
import Dashboard from "@/pages/Dashboard";
import Verificacion from "@/pages/Verificacion";
import Estudiantes from "@/pages/Estudiantes";
import Reportes from "@/pages/Reportes";
import Administracion from "@/pages/Administracion";
import NotFound from "@/pages/not-found";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

function Router({ serialLogs }: { serialLogs: any[] }) {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/verificacion">
        {() => <Verificacion serialLogs={serialLogs} />}
      </Route>
      <Route path="/estudiantes">
        {() => <Estudiantes serialLogs={serialLogs} />}
      </Route>
      <Route path="/reportes" component={Reportes} />
      <Route path="/administracion" component={Administracion} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [selectedPort, setSelectedPort] = useState("");
  const [baudRate, setBaudRate] = useState("9600");
  const [isDark, setIsDark] = useState(false);
  const { serialStatus, logs: serialLogs } = useWebSocket();
  const { toast } = useToast();

  // Obtener puertos disponibles
  const { data: portsData, refetch: refetchPorts } = useQuery<{ ports: string[] }>({
    queryKey: ['/api/serial/ports'],
  });

  const availablePorts = portsData?.ports || [];

  // Mutation para conectar
  const connectMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/serial/connect', {
        port: selectedPort,
        baudRate: parseInt(baudRate)
      });
    },
    onSuccess: () => {
      toast({
        title: "Conectado",
        description: `Conectado a ${selectedPort}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error de conexión",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para desconectar
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/serial/disconnect');
    },
    onSuccess: () => {
      toast({
        title: "Desconectado",
        description: "Desconectado del Arduino",
      });
    },
  });

  const handleConnect = () => {
    if (serialStatus.connected) {
      disconnectMutation.mutate();
    } else {
      if (!selectedPort) {
        toast({
          title: "Error",
          description: "Seleccione un puerto primero",
          variant: "destructive",
        });
        return;
      }
      connectMutation.mutate();
    }
  };

  const handleRefreshPorts = () => {
    refetchPorts();
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  // Seleccionar primer puerto disponible si no hay ninguno seleccionado
  useEffect(() => {
    if (!selectedPort && availablePorts.length > 0) {
      setSelectedPort(availablePorts[0]);
    }
  }, [availablePorts, selectedPort]);

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <TooltipProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between gap-4 border-b p-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ConnectionStatus
                  isConnected={serialStatus.connected}
                  port={serialStatus.port || selectedPort}
                  baudRate={serialStatus.baudRate.toString()}
                />
              </div>
              <div className="flex items-center gap-3">
                <PortSelector
                  availablePorts={availablePorts}
                  selectedPort={selectedPort}
                  baudRate={baudRate}
                  onPortChange={setSelectedPort}
                  onBaudRateChange={setBaudRate}
                  onRefresh={handleRefreshPorts}
                  onConnect={handleConnect}
                  isConnected={serialStatus.connected}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  data-testid="button-theme-toggle"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6">
              <Router serialLogs={serialLogs} />
            </main>
          </div>
        </div>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
