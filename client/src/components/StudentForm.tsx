import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentFormProps {
  fingerprintId: number;
  onSubmit: (data: { name: string; grade: string }) => void;
  onCancel: () => void;
}

export default function StudentForm({ fingerprintId, onSubmit, onCancel }: StudentFormProps) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && grade.trim()) {
      onSubmit({ name: name.trim(), grade: grade.trim() });
    }
  };

  return (
    <Card data-testid="student-form">
      <CardHeader>
        <CardTitle className="text-lg">Registrar Estudiante - ID {fingerprintId}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese el nombre"
              required
              data-testid="input-student-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">Grado</Label>
            <Input
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Ej: 5to Grado"
              required
              data-testid="input-student-grade"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" data-testid="button-save-student">
              Guardar Estudiante
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
