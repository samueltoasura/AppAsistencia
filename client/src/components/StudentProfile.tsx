import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Users as UsersIcon,
  Fingerprint,
  X,
  Edit
} from "lucide-react";
import type { Student } from "@shared/schema";
import FingerprintScanner from "./FingerprintScanner";
import LogConsole from "./LogConsole";
import DeleteFingerprintControl from "./DeleteFingerprintControl";
import { useToast } from "@/hooks/use-toast";

interface StudentProfileProps {
  student: Student;
  onClose: () => void;
  onRegisterFingerprint: (studentId: number) => void;
  onEdit: (student: Student) => void;
}

export default function StudentProfile({ 
  student, 
  onClose, 
  onRegisterFingerprint,
  onEdit 
}: StudentProfileProps) {
  const [showFingerprintDialog, setShowFingerprintDialog] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [logs, setLogs] = useState([
    { timestamp: new Date().toLocaleString("es-ES"), message: `Ficha de ${student.name} abierta` }
  ]);
  const { toast } = useToast();

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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

  const handleStartRegistration = () => {
    setScanStatus("scanning");
    addLog(`Iniciando registro de huella para ${student.name}...`);
    addLog("Modo REGISTRO activado. Esperando huella...");
    
    setTimeout(() => {
      const newId = Math.floor(Math.random() * 100) + 1;
      setScanStatus("success");
      addLog(`Huella detectada con ID ${newId}`);
      addLog(`✅ Huella registrada: ${student.name} | ${student.grade} | ID ${newId}`);
      
      setTimeout(() => {
        setScanStatus("idle");
        onRegisterFingerprint(student.id);
        toast({
          title: "Huella Registrada",
          description: `${student.name} - ID ${newId}`,
        });
      }, 1500);
    }, 3000);
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

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 py-2">
        <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-medium">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ficha del Estudiante</DialogTitle>
            <DialogDescription>
              Información completa y gestión de huella dactilar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-32 w-32 border-4 border-muted">
                <AvatarImage src={student.photoUrl || undefined} alt={student.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-semibold" data-testid="profile-student-name">
                    {student.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {student.section ? `${student.grade} - Sección ${student.section}` : student.grade}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {student.fingerprintId ? (
                    <Badge variant="outline" className="text-sm">
                      <Fingerprint className="h-3 w-3 mr-1" />
                      Huella ID: {student.fingerprintId}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-sm">
                      Sin huella registrada
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setShowFingerprintDialog(true)}
                    data-testid="button-register-fingerprint"
                  >
                    <Fingerprint className="h-4 w-4 mr-2" />
                    {student.fingerprintId ? "Actualizar Huella" : "Registrar Huella"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(student)}
                    data-testid="button-edit-profile"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase tracking-wide">
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow icon={Phone} label="Teléfono" value={student.phone} />
                <InfoRow icon={Mail} label="Correo Electrónico" value={student.email} />
                <InfoRow icon={MapPin} label="Dirección" value={student.address} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase tracking-wide">
                  Información del Tutor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow icon={UsersIcon} label="Nombre del Tutor" value={student.guardianName} />
                <InfoRow icon={Phone} label="Teléfono del Tutor" value={student.guardianPhone} />
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFingerprintDialog} onOpenChange={setShowFingerprintDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestión de Huella Dactilar</DialogTitle>
            <DialogDescription>
              {student.name} - {student.grade}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Escáner de Huellas</CardTitle>
                </CardHeader>
                <CardContent>
                  <FingerprintScanner
                    status={scanStatus}
                    message={
                      scanStatus === "idle" 
                        ? "Presione 'Iniciar Registro' para comenzar" 
                        : scanStatus === "scanning"
                        ? "Coloque el dedo en el sensor..."
                        : scanStatus === "success"
                        ? "¡Huella registrada exitosamente!"
                        : "Error al registrar huella"
                    }
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleStartRegistration}
                      disabled={scanStatus !== "idle"}
                      className="flex-1"
                      data-testid="button-start-fingerprint-scan"
                    >
                      {scanStatus === "idle" ? "Iniciar Registro" : "Procesando..."}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowFingerprintDialog(false);
                        setScanStatus("idle");
                      }}
                      data-testid="button-cancel-fingerprint"
                    >
                      Cerrar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <DeleteFingerprintControl
                onDeleteSpecific={handleDeleteSpecific}
                onDeleteAll={handleDeleteAll}
              />
            </div>

            <div>
              <LogConsole title="Log de Registro" logs={logs} height="h-[400px]" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
