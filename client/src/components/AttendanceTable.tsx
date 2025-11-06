import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AttendanceRecord {
  id: number;
  fingerprintId: number;
  name: string;
  grade: string;
  subject: string;
  date: string;
  time: string;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export default function AttendanceTable({ records }: AttendanceTableProps) {
  return (
    <div className="rounded-md border" data-testid="attendance-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Huella</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Grado</TableHead>
            <TableHead>Asignatura</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No hay registros
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id} data-testid={`attendance-row-${record.id}`}>
                <TableCell>
                  <Badge variant="outline">{record.fingerprintId}</Badge>
                </TableCell>
                <TableCell className="font-medium">{record.name}</TableCell>
                <TableCell>{record.grade}</TableCell>
                <TableCell>{record.subject}</TableCell>
                <TableCell className="text-muted-foreground">{record.date}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">
                  {record.time}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
