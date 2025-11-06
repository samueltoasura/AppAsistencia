import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import FingerprintScanner from "@/components/FingerprintScanner";
import LogConsole from "@/components/LogConsole";
import { useToast } from "@/hooks/use-toast";

const subjects = ["Matemáticas", "Ciencias", "Historia", "Lengua", "Inglés", "Educación Física"];

export default function Verificacion() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [logs, setLogs] = useState([
    { timestamp: "2025-01-15 10:00:00", message: "Sistema listo para verificación" }
  ]);
  const { toast } = useToast();

  const handleStartVerification = () => {
    setIsVerifying(true);
    addLog(`Modo VERIFICACIÓN activado. Asignatura: ${selectedSubject}. Coloque el dedo...`);
    
    setTimeout(() => {
      simulateVerification();
    }, 2000);
  };

  const simulateVerification = () => {
    const students = [
      { id: 14, name: "Juan Pérez", grade: "5to Grado" },
      { id: 23, name: "María González", grade: "6to Grado" },
      { id: 8, name: "Carlos Rodríguez", grade: "4to Grado" },
    ];
    
    const student = students[Math.floor(Math.random() * students.length)];
    const now = new Date();
    const time = now.toLocaleTimeString("es-ES");
    const date = now.toLocaleDateString("es-ES");
    
    addLog(`✅ ${student.name} (${student.grade}) - ${selectedSubject} - ${date} ${time}`);
    
    toast({
      title: "Asistencia Registrada",
      description: `${student.name} - ${selectedSubject}`,
    });

    if (isVerifying) {
      setTimeout(() => {
        if (isVerifying) simulateVerification();
      }, 3000);
    }
  };

  const handleStopVerification = () => {
    setIsVerifying(false);
    addLog("Se detuvo el modo de verificación");
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
    <div className="space-y-6" data-testid="page-verificacion">
      <div>
        <h1 className="text-2xl font-semibold">Verificación de Asistencia</h1>
        <p className="text-muted-foreground mt-1">
          Registre la asistencia de estudiantes para una asignatura
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Asignatura</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject" data-testid="select-subject">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FingerprintScanner
                status={isVerifying ? "scanning" : "idle"}
                message={
                  isVerifying
                    ? "Esperando huella..."
                    : "Presione 'Iniciar Verificación' para comenzar"
                }
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleStartVerification}
                  disabled={isVerifying}
                  className="flex-1"
                  data-testid="button-start-verification"
                >
                  Iniciar Verificación
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStopVerification}
                  disabled={!isVerifying}
                  data-testid="button-stop-verification"
                >
                  Detener
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <LogConsole title="Log de Verificación" logs={logs} height="h-[500px]" />
        </div>
      </div>
    </div>
  );
}
