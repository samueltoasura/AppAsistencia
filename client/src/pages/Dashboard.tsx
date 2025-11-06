import { Users, CheckCircle, GraduationCap, Activity } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import AttendanceTable from "@/components/AttendanceTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const todayAttendance = [
    { id: 1, fingerprintId: 14, name: "Juan Pérez", grade: "5to Grado", subject: "Matemáticas", date: "2025-01-15", time: "08:30:15" },
    { id: 2, fingerprintId: 23, name: "María González", grade: "6to Grado", subject: "Ciencias", date: "2025-01-15", time: "09:15:22" },
    { id: 3, fingerprintId: 8, name: "Carlos Rodríguez", grade: "4to Grado", subject: "Historia", date: "2025-01-15", time: "10:05:43" },
    { id: 4, fingerprintId: 31, name: "Ana Martínez", grade: "5to Grado", subject: "Lengua", date: "2025-01-15", time: "11:20:12" },
    { id: 5, fingerprintId: 19, name: "Luis Sánchez", grade: "6to Grado", subject: "Matemáticas", date: "2025-01-15", time: "13:45:33" },
  ];

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen de asistencia y actividad del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Estudiantes" value="324" icon={Users} />
        <StatsCard 
          title="Asistencia Hoy" 
          value="287" 
          icon={CheckCircle} 
          description="88.5% del total" 
        />
        <StatsCard title="Grados Activos" value="12" icon={GraduationCap} />
        <StatsCard title="Estado del Sistema" value="Activo" icon={Activity} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceTable records={todayAttendance} />
        </CardContent>
      </Card>
    </div>
  );
}
