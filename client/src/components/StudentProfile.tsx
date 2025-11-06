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

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleStartRegistration = () => {
    setScanStatus("scanning");
    setTimeout(() => {
      setScanStatus("success");
      setTimeout(() => {
        setShowFingerprintDialog(false);
        setScanStatus("idle");
        onRegisterFingerprint(student.id);
      }, 1500);
    }, 3000);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Huella Dactilar</DialogTitle>
            <DialogDescription>
              {student.name} - {student.grade}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <FingerprintScanner
              status={scanStatus}
              message={
                scanStatus === "idle" 
                  ? "Presione 'Iniciar' para comenzar" 
                  : scanStatus === "scanning"
                  ? "Coloque el dedo en el sensor..."
                  : scanStatus === "success"
                  ? "¡Huella registrada exitosamente!"
                  : "Error al registrar huella"
              }
            />

            <div className="flex gap-2">
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
                onClick={() => setShowFingerprintDialog(false)}
                data-testid="button-cancel-fingerprint"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
