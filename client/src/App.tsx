import { Switch, Route } from "wouter";
import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import ConnectionStatus from "@/components/ConnectionStatus";
import PortSelector from "@/components/PortSelector";
import Dashboard from "@/pages/Dashboard";
import Registro from "@/pages/Registro";
import Verificacion from "@/pages/Verificacion";
import Estudiantes from "@/pages/Estudiantes";
import Reportes from "@/pages/Reportes";
import NotFound from "@/pages/not-found";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/registro" component={Registro} />
      <Route path="/verificacion" component={Verificacion} />
      <Route path="/estudiantes" component={Estudiantes} />
      <Route path="/reportes" component={Reportes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedPort, setSelectedPort] = useState("COM3");
  const [baudRate, setBaudRate] = useState("9600");
  const [isDark, setIsDark] = useState(false);

  const availablePorts = ["COM3", "COM4", "COM5", "/dev/ttyUSB0"];

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleRefreshPorts = () => {
    console.log("Refreshing ports...");
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between gap-4 border-b p-4">
                <div className="flex items-center gap-3">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ConnectionStatus
                    isConnected={isConnected}
                    port={selectedPort}
                    baudRate={baudRate}
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
                    isConnected={isConnected}
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
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
