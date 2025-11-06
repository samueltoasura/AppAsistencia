import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: number;
  fingerprintId: number;
  name: string;
  grade: string;
  registeredDate: string;
}

export default function Estudiantes() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const students: Student[] = [
    { id: 1, fingerprintId: 14, name: "Juan Pérez", grade: "5to Grado", registeredDate: "2025-01-10" },
    { id: 2, fingerprintId: 23, name: "María González", grade: "6to Grado", registeredDate: "2025-01-11" },
    { id: 3, fingerprintId: 8, name: "Carlos Rodríguez", grade: "4to Grado", registeredDate: "2025-01-12" },
    { id: 4, fingerprintId: 31, name: "Ana Martínez", grade: "5to Grado", registeredDate: "2025-01-13" },
    { id: 5, fingerprintId: 19, name: "Luis Sánchez", grade: "6to Grado", registeredDate: "2025-01-14" },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.fingerprintId.toString().includes(searchQuery)
  );

  const handleEdit = (student: Student) => {
    toast({
      title: "Editar Estudiante",
      description: `Editando: ${student.name}`,
    });
  };

  const handleDelete = (student: Student) => {
    toast({
      title: "Estudiante Eliminado",
      description: `Se eliminó a ${student.name}`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6" data-testid="page-estudiantes">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Estudiantes</h1>
          <p className="text-muted-foreground mt-1">
            Administre la información de los estudiantes registrados
          </p>
        </div>
        <Button data-testid="button-add-student">
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar Estudiante
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, grado o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-students"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Huella</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Grado</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No se encontraron estudiantes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} data-testid={`student-row-${student.id}`}>
                      <TableCell>
                        <Badge variant="outline">{student.fingerprintId}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.registeredDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(student)}
                            data-testid={`button-edit-${student.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(student)}
                            data-testid={`button-delete-${student.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
