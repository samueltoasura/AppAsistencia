import StatsCard from '../StatsCard'
import { Users, CheckCircle, GraduationCap, Activity } from 'lucide-react'

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Total Estudiantes" value="324" icon={Users} />
      <StatsCard title="Asistencia Hoy" value="287" icon={CheckCircle} description="88.5% del total" />
      <StatsCard title="Grados Activos" value="12" icon={GraduationCap} />
      <StatsCard title="Estado del Sistema" value="Activo" icon={Activity} />
    </div>
  )
}
