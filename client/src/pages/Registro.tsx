import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FingerprintScanner from "@/components/FingerprintScanner";
import LogConsole from "@/components/LogConsole";
import StudentForm from "@/components/StudentForm";
import DeleteFingerprintControl from "@/components/DeleteFingerprintControl";
import { useToast } from "@/hooks/use-toast";

export default function Registro() {
  const [isScanning, setIsScanning] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [detectedId, setDetectedId] = useState<number | null>(null);
  const [logs, setLogs] = useState([
    { timestamp: "2025-01-15 10:00:00", message: "Sistema listo para registro" }
  ]);
  const { toast } = useToast();

  const handleStartRegistration = () => {
    setIsScanning(true);
    addLog("Modo REGISTRO activado. Esperando huella...");
    
    setTimeout(() => {
      const newId = Math.floor(Math.random() * 100) + 1;
      setDetectedId(newId);
      setIsScanning(false);
      setShowStudentForm(true);
      addLog(`Huella detectada con ID ${newId}`);
    }, 3000);
  };

  const handleStopRegistration = () => {
    setIsScanning(false);
    addLog("Se detuvo el modo de registro");
  };

  const handleSaveStudent = (data: { name: string; grade: string }) => {
    addLog(`✅ Registrado: ${data.name} | ${data.grade} | ID ${detectedId}`);
    setShowStudentForm(false);
    setDetectedId(null);
    toast({
      title: "Estudiante Registrado",
      description: `${data.name} ha sido registrado exitosamente.`,
    });
  };

  const handleCancelForm = () => {
    setShowStudentForm(false);
    setDetectedId(null);
    addLog("Registro cancelado");
  };

  const handleDeleteSpecific = (id: number) => {
    addLog(`➡️ Comando enviado: D ${id}`);
    toast({
      title: "Huella Eliminada",
      description: `Se eliminó la huella con ID ${id}`,
    });
  };

  const handleDeleteAll = () => {
    addLog("➡️ Comando enviado: X (Eliminar todas las huellas)");
    toast({
      title: "Huellas Eliminadas",
      description: "Todas las huellas han sido eliminadas del sensor",
      variant: "destructive",
    });
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs(prev => [...prev, { timestamp, message }]);
  };

  return (
    <div className="space-y-6" data-testid="page-registro">
      <div>
        <h1 className="text-2xl font-semibold">Registro de Huellas</h1>
        <p className="text-muted-foreground mt-1">
          Registre nuevos estudiantes con el sensor de huellas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Escáner de Huellas</CardTitle>
            </CardHeader>
            <CardContent>
              {showStudentForm ? (
                <StudentForm
                  fingerprintId={detectedId!}
                  onSubmit={handleSaveStudent}
                  onCancel={handleCancelForm}
                />
              ) : (
                <>
                  <FingerprintScanner
                    status={isScanning ? "scanning" : "idle"}
                    message={
                      isScanning
                        ? "Coloque el dedo en el sensor..."
                        : "Presione 'Iniciar Registro' para comenzar"
                    }
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleStartRegistration}
                      disabled={isScanning}
                      className="flex-1"
                      data-testid="button-start-registration"
                    >
                      Iniciar Registro
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleStopRegistration}
                      disabled={!isScanning}
                      data-testid="button-stop-registration"
                    >
                      Detener
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <DeleteFingerprintControl
            onDeleteSpecific={handleDeleteSpecific}
            onDeleteAll={handleDeleteAll}
          />
        </div>

        <div>
          <LogConsole title="Log de Registro" logs={logs} height="h-[500px]" />
        </div>
      </div>
    </div>
  );
}
