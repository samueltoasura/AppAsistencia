import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Download } from "lucide-react";

interface FilterBarProps {
  onFilter: (filters: { subject: string; grade: string; date: string }) => void;
  onExport: () => void;
}

export default function FilterBar({ onFilter, onExport }: FilterBarProps) {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [date, setDate] = useState("");

  const handleFilter = () => {
    onFilter({ subject, grade, date });
  };

  return (
    <div className="flex flex-wrap items-end gap-3" data-testid="filter-bar">
      <div className="flex-1 min-w-[200px] space-y-2">
        <Label htmlFor="filter-subject" className="text-xs">Asignatura</Label>
        <Input
          id="filter-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Filtrar por asignatura"
          data-testid="input-filter-subject"
        />
      </div>
      <div className="flex-1 min-w-[200px] space-y-2">
        <Label htmlFor="filter-grade" className="text-xs">Grado</Label>
        <Input
          id="filter-grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Filtrar por grado"
          data-testid="input-filter-grade"
        />
      </div>
      <div className="flex-1 min-w-[200px] space-y-2">
        <Label htmlFor="filter-date" className="text-xs">Fecha</Label>
        <Input
          id="filter-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          data-testid="input-filter-date"
        />
      </div>
      <Button onClick={handleFilter} data-testid="button-filter">
        <Search className="h-4 w-4 mr-2" />
        Filtrar
      </Button>
      <Button variant="outline" onClick={onExport} data-testid="button-export">
        <Download className="h-4 w-4 mr-2" />
        Exportar CSV
      </Button>
    </div>
  );
}
