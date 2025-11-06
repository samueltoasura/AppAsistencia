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

type VerificacionProps = {
  serialLogs?: any[];
};

export default function Verificacion({ serialLogs = [] }: VerificacionProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const { toast } = useToast();

  const handleStartVerification = async () => {
    setIsVerifying(true);
    try {
      // Enviar comando de verificación al Arduino
      await fetch('/api/serial/verify', { method: 'POST' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStopVerification = async () => {
    setIsVerifying(false);
    try {
      // Enviar comando de detener al Arduino
      await fetch('/api/serial/stop', { method: 'POST' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
          <LogConsole title="Log de Verificación" logs={serialLogs} height="h-[500px]" />
        </div>
      </div>
    </div>
  );
}
