import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Upload, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StudentCard from "@/components/StudentCard";
import StudentProfile from "@/components/StudentProfile";
import ExcelImport from "@/components/ExcelImport";
import type { Student } from "@shared/schema";

export default function Estudiantes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const { toast } = useToast();

  // Datos de ejemplo - luego se conectará a la API
  const mockStudents: Student[] = [
    {
      id: 1,
      fingerprintId: 14,
      name: "Juan Pérez López",
      grade: "5to Grado",
      section: "A",
      photoUrl: null,
      phone: "555-0101",
      email: "juan.perez@email.com",
      address: "Calle Principal 123",
      guardianName: "María López",
      guardianPhone: "555-0201",
      registeredAt: new Date("2025-01-10"),
    },
    {
      id: 2,
      fingerprintId: 23,
      name: "María González García",
      grade: "5to Grado",
      section: "A",
      photoUrl: null,
      phone: "555-0102",
      email: "maria.gonzalez@email.com",
      address: "Avenida Central 456",
      guardianName: "Pedro González",
      guardianPhone: "555-0202",
      registeredAt: new Date("2025-01-11"),
    },
    {
      id: 3,
      fingerprintId: 8,
      name: "Carlos Rodríguez Martínez",
      grade: "6to Grado",
      section: "B",
      photoUrl: null,
      phone: "555-0103",
      email: null,
      address: "Plaza Mayor 789",
      guardianName: "Ana Martínez",
      guardianPhone: "555-0203",
      registeredAt: new Date("2025-01-12"),
    },
    {
      id: 4,
      fingerprintId: 31,
      name: "Ana Martínez Sánchez",
      grade: "6to Grado",
      section: "B",
      photoUrl: null,
      phone: "555-0104",
      email: "ana.martinez@email.com",
      address: null,
      guardianName: "Luis Sánchez",
      guardianPhone: "555-0204",
      registeredAt: new Date("2025-01-13"),
    },
    {
      id: 5,
      fingerprintId: null,
      name: "Luis Sánchez Torres",
      grade: "4to Grado",
      section: "C",
      photoUrl: null,
      phone: "555-0105",
      email: null,
      address: "Calle Secundaria 321",
      guardianName: "Carmen Torres",
      guardianPhone: "555-0205",
      registeredAt: new Date("2025-01-14"),
    },
    {
      id: 6,
      fingerprintId: 42,
      name: "Sofia Ramírez Cruz",
      grade: "4to Grado",
      section: "C",
      photoUrl: null,
      phone: null,
      email: null,
      address: null,
      guardianName: "Roberto Cruz",
      guardianPhone: "555-0206",
      registeredAt: new Date("2025-01-15"),
    },
  ];

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.section && student.section.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.fingerprintId && student.fingerprintId.toString().includes(searchQuery));

    const matchesGrade = selectedGrade === "all" || student.grade === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  const groupedByGrade = filteredStudents.reduce((acc, student) => {
    if (!acc[student.grade]) {
      acc[student.grade] = [];
    }
    acc[student.grade].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

  const grades = Array.from(new Set(mockStudents.map((s) => s.grade))).sort();

  const handleRegisterFingerprint = (studentId: number) => {
    toast({
      title: "Huella Registrada",
      description: "La huella se registró exitosamente",
    });
  };

  const handleEditStudent = (student: Student) => {
    toast({
      title: "Editar Estudiante",
      description: `Editando: ${student.name}`,
    });
  };

  const handleImportExcel = (data: any[]) => {
    console.log("Imported data:", data);
  };

  return (
    <div className="space-y-6" data-testid="page-estudiantes">
      <div>
        <h1 className="text-2xl font-semibold">Gestión de Estudiantes</h1>
        <p className="text-muted-foreground mt-1">
          Administre la información de los estudiantes organizados por grado
        </p>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students" data-testid="tab-students">
            <Database className="h-4 w-4 mr-2" />
            Estudiantes
          </TabsTrigger>
          <TabsTrigger value="import" data-testid="tab-import">
            <Upload className="h-4 w-4 mr-2" />
            Importar Datos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, grado, sección o ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-students"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedGrade === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGrade("all")}
              data-testid="filter-all-grades"
            >
              Todos los Grados
            </Button>
            {grades.map((grade) => (
              <Button
                key={grade}
                variant={selectedGrade === grade ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGrade(grade)}
                data-testid={`filter-grade-${grade}`}
              >
                {grade}
              </Button>
            ))}
          </div>

          {Object.keys(groupedByGrade).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No se encontraron estudiantes</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedByGrade).map(([grade, students]) => (
              <Card key={grade}>
                <CardHeader>
                  <CardTitle className="text-lg">{grade}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {students.length} {students.length === 1 ? "estudiante" : "estudiantes"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {students.map((student) => (
                      <StudentCard
                        key={student.id}
                        student={student}
                        onClick={() => setSelectedStudent(student)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExcelImport onImport={handleImportExcel} />

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium uppercase tracking-wide">
                  Instrucciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Paso 1: Prepare su archivo</h4>
                  <p>
                    Asegúrese de que su archivo Excel contenga las columnas requeridas en la primera fila.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Paso 2: Seleccione el archivo</h4>
                  <p>
                    Haga clic en el botón de selección y elija su archivo Excel (.xlsx o .xls).
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Paso 3: Revise los datos</h4>
                  <p>
                    El sistema procesará el archivo y mostrará un resumen de los datos importados.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Paso 4: Confirme</h4>
                  <p>
                    Revise que los datos sean correctos y confirme la importación a la base de datos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedStudent && (
        <StudentProfile
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onRegisterFingerprint={handleRegisterFingerprint}
          onEdit={handleEditStudent}
        />
      )}
    </div>
  );
}
