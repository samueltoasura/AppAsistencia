import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Database, Trash2, Upload, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { InsertStudent } from "@shared/schema";

export default function Administracion() {
  const { toast } = useToast();
  const [newStudent, setNewStudent] = useState<Partial<InsertStudent>>({
    name: "",
    grade: "",
    section: "",
    phone: "",
    email: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
  });

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.grade) {
      toast({
        title: "Campos Requeridos",
        description: "Por favor complete el nombre y grado del estudiante",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Estudiante Agregado",
      description: `${newStudent.name} ha sido agregado a la base de datos`,
    });

    setNewStudent({
      name: "",
      grade: "",
      section: "",
      phone: "",
      email: "",
      address: "",
      guardianName: "",
      guardianPhone: "",
    });
  };

  const handleClearDatabase = () => {
    toast({
      title: "Base de Datos Limpiada",
      description: "Todos los datos han sido eliminados",
      variant: "destructive",
    });
  };

  const handleExportBackup = () => {
    toast({
      title: "Backup Exportado",
      description: "El respaldo de la base de datos se ha descargado",
    });
  };

  const handleImportBackup = () => {
    toast({
      title: "Backup Importado",
      description: "Los datos han sido restaurados exitosamente",
    });
  };

  const handleResetFingerprints = () => {
    toast({
      title: "Huellas Reseteadas",
      description: "Todas las asociaciones de huellas han sido eliminadas",
    });
  };

  return (
    <div className="space-y-6" data-testid="page-administracion">
      <div>
        <h1 className="text-2xl font-semibold">Administración de Base de Datos</h1>
        <p className="text-muted-foreground mt-1">
          Gestione y mantenga la base de datos del sistema
        </p>
      </div>

      <Tabs defaultValue="add-student" className="space-y-6">
        <TabsList>
          <TabsTrigger value="add-student">
            <Database className="h-4 w-4 mr-2" />
            Agregar Estudiante
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <RefreshCw className="h-4 w-4 mr-2" />
            Mantenimiento
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Download className="h-4 w-4 mr-2" />
            Respaldo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add-student">
          <Card>
            <CardHeader>
              <CardTitle>Agregar Nuevo Estudiante</CardTitle>
              <CardDescription>
                Complete los datos del estudiante para agregarlo a la base de datos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="Juan Pérez López"
                    data-testid="input-student-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grado *</Label>
                  <Input
                    id="grade"
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                    placeholder="5to Grado"
                    data-testid="input-student-grade"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Sección</Label>
                  <Input
                    id="section"
                    value={newStudent.section || ""}
                    onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                    placeholder="A"
                    data-testid="input-student-section"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={newStudent.phone || ""}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    placeholder="555-0101"
                    data-testid="input-student-phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStudent.email || ""}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    placeholder="estudiante@email.com"
                    data-testid="input-student-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianName">Nombre del Tutor</Label>
                  <Input
                    id="guardianName"
                    value={newStudent.guardianName || ""}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                    placeholder="María López"
                    data-testid="input-guardian-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">Teléfono del Tutor</Label>
                  <Input
                    id="guardianPhone"
                    value={newStudent.guardianPhone || ""}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                    placeholder="555-0201"
                    data-testid="input-guardian-phone"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea
                    id="address"
                    value={newStudent.address || ""}
                    onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                    placeholder="Calle Principal 123, Ciudad"
                    rows={2}
                    data-testid="input-student-address"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={handleAddStudent} className="w-full" data-testid="button-add-student">
                  <Database className="h-4 w-4 mr-2" />
                  Agregar Estudiante
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Limpiar Base de Datos
                </CardTitle>
                <CardDescription>
                  Eliminar todos los registros de estudiantes y asistencias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full" data-testid="button-clear-db">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpiar Todo
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente todos
                        los registros de estudiantes y asistencias de la base de datos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearDatabase}>
                        Sí, eliminar todo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Resetear Huellas
                </CardTitle>
                <CardDescription>
                  Eliminar todas las asociaciones de huellas dactilares
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full" data-testid="button-reset-fingerprints">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Resetear Huellas
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Resetear todas las huellas?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esto eliminará todas las asociaciones de huellas dactilares de los estudiantes,
                        pero mantendrá sus datos personales intactos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetFingerprints}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backup">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Exportar Respaldo
                </CardTitle>
                <CardDescription>
                  Descargar una copia de seguridad de toda la base de datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  El archivo de respaldo incluirá todos los estudiantes, huellas registradas
                  y registros de asistencia en formato JSON.
                </p>
                <Button onClick={handleExportBackup} className="w-full" data-testid="button-export-backup">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Respaldo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Importar Respaldo
                </CardTitle>
                <CardDescription>
                  Restaurar la base de datos desde un archivo de respaldo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Seleccione un archivo de respaldo previamente exportado para restaurar
                  los datos. Esta acción sobrescribirá los datos actuales.
                </p>
                <Button onClick={handleImportBackup} variant="outline" className="w-full" data-testid="button-import-backup">
                  <Upload className="h-4 w-4 mr-2" />
                  Seleccionar Archivo
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
