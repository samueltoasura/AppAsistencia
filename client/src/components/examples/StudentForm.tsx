import StudentForm from '../StudentForm'

export default function StudentFormExample() {
  return (
    <div className="max-w-md">
      <StudentForm
        fingerprintId={14}
        onSubmit={(data) => console.log("Student data:", data)}
        onCancel={() => console.log("Cancelled")}
      />
    </div>
  )
}
