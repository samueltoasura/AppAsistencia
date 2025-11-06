import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FilterBar from "@/components/FilterBar";
import AttendanceTable from "@/components/AttendanceTable";
import { useToast } from "@/hooks/use-toast";

export default function Reportes() {
  const { toast } = useToast();

  const allRecords = [
    { id: 1, fingerprintId: 14, name: "Juan Pérez", grade: "5to Grado", subject: "Matemáticas", date: "2025-01-15", time: "08:30:15" },
    { id: 2, fingerprintId: 23, name: "María González", grade: "6to Grado", subject: "Ciencias", date: "2025-01-15", time: "09:15:22" },
    { id: 3, fingerprintId: 8, name: "Carlos Rodríguez", grade: "4to Grado", subject: "Historia", date: "2025-01-15", time: "10:05:43" },
    { id: 4, fingerprintId: 31, name: "Ana Martínez", grade: "5to Grado", subject: "Lengua", date: "2025-01-15", time: "11:20:12" },
    { id: 5, fingerprintId: 19, name: "Luis Sánchez", grade: "6to Grado", subject: "Matemáticas", date: "2025-01-15", time: "13:45:33" },
    { id: 6, fingerprintId: 14, name: "Juan Pérez", grade: "5to Grado", subject: "Ciencias", date: "2025-01-14", time: "09:30:10" },
    { id: 7, fingerprintId: 23, name: "María González", grade: "6to Grado", subject: "Historia", date: "2025-01-14", time: "10:15:45" },
    { id: 8, fingerprintId: 8, name: "Carlos Rodríguez", grade: "4to Grado", subject: "Matemáticas", date: "2025-01-14", time: "11:05:22" },
  ];

  const [filteredRecords, setFilteredRecords] = useState(allRecords);

  const handleFilter = (filters: { subject: string; grade: string; date: string }) => {
    let results = allRecords;

    if (filters.subject) {
      results = results.filter(r =>
        r.subject.toLowerCase().includes(filters.subject.toLowerCase())
      );
    }

    if (filters.grade) {
      results = results.filter(r =>
        r.grade.toLowerCase().includes(filters.grade.toLowerCase())
      );
    }

    if (filters.date) {
      results = results.filter(r => r.date === filters.date);
    }

    setFilteredRecords(results);
    toast({
      title: "Filtros Aplicados",
      description: `Se encontraron ${results.length} registros`,
    });
  };

  const handleExport = () => {
    const csv = [
      ["ID Huella", "Nombre", "Grado", "Asignatura", "Fecha", "Hora"].join(","),
      ...filteredRecords.map(r =>
        [r.fingerprintId, r.name, r.grade, r.subject, r.date, r.time].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asistencia-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();

    toast({
      title: "Reporte Exportado",
      description: "El archivo CSV se ha descargado exitosamente",
    });
  };

  return (
    <div className="space-y-6" data-testid="page-reportes">
      <div>
        <h1 className="text-2xl font-semibold">Reportes de Asistencia</h1>
        <p className="text-muted-foreground mt-1">
          Filtre y exporte registros de asistencia
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterBar onFilter={handleFilter} onExport={handleExport} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Registros de Asistencia ({filteredRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceTable records={filteredRecords} />
        </CardContent>
      </Card>
    </div>
  );
}
