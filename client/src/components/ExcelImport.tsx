import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExcelImportProps {
  onImport: (data: any[]) => void;
}

export default function ExcelImport({ onImport }: ExcelImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Formato Inválido",
        description: "Por favor seleccione un archivo Excel (.xlsx o .xls)",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Importando...",
      description: `Procesando archivo: ${file.name}`,
    });

    // Aquí se implementará la lógica de importación real
    // Por ahora simulamos datos de ejemplo
    setTimeout(() => {
      const mockData = [
        { name: "Juan Pérez", grade: "5to Grado", section: "A", phone: "555-0101" },
        { name: "María González", grade: "6to Grado", section: "B", phone: "555-0102" },
      ];
      
      onImport(mockData);
      
      toast({
        title: "Importación Exitosa",
        description: `Se importaron ${mockData.length} estudiantes`,
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1500);
  };

  return (
    <Card data-testid="excel-import">
      <CardHeader>
        <CardTitle className="text-sm font-medium uppercase tracking-wide flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Importar desde Excel
        </CardTitle>
        <CardDescription>
          Cargue un archivo Excel con la lista de estudiantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
          data-testid="input-excel-file"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full"
          data-testid="button-select-excel"
        >
          <Upload className="h-4 w-4 mr-2" />
          Seleccionar Archivo Excel
        </Button>
        
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Formato esperado del archivo:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Nombre completo</li>
            <li>Grado (ej: 5to Grado)</li>
            <li>Sección (opcional)</li>
            <li>Teléfono (opcional)</li>
            <li>Email (opcional)</li>
            <li>Dirección (opcional)</li>
            <li>Nombre del tutor (opcional)</li>
            <li>Teléfono del tutor (opcional)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
