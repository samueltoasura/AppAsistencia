import AttendanceTable from '../AttendanceTable'

export default function AttendanceTableExample() {
  const sampleRecords = [
    { id: 1, fingerprintId: 14, name: "Juan Pérez", grade: "5to Grado", subject: "Matemáticas", date: "2025-01-15", time: "08:30:15" },
    { id: 2, fingerprintId: 23, name: "María González", grade: "6to Grado", subject: "Ciencias", date: "2025-01-15", time: "09:15:22" },
    { id: 3, fingerprintId: 8, name: "Carlos Rodríguez", grade: "4to Grado", subject: "Historia", date: "2025-01-15", time: "10:05:43" },
  ]

  return <AttendanceTable records={sampleRecords} />
}
