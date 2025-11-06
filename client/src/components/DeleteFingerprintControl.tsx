import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteFingerprintControlProps {
  onDeleteSpecific: (id: number) => void;
  onDeleteAll: () => void;
}

export default function DeleteFingerprintControl({
  onDeleteSpecific,
  onDeleteAll,
}: DeleteFingerprintControlProps) {
  const [fingerprintId, setFingerprintId] = useState("");

  const handleDelete = () => {
    const id = parseInt(fingerprintId);
    if (!isNaN(id) && id >= 0) {
      onDeleteSpecific(id);
      setFingerprintId("");
    }
  };

  return (
    <Card data-testid="delete-fingerprint-control">
      <CardHeader>
        <CardTitle className="text-sm font-medium uppercase tracking-wide flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          Borrado de Huellas
        </CardTitle>
        <CardDescription>Eliminar huellas del sensor de Arduino</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[120px] space-y-2">
            <Label htmlFor="fingerprint-id">ID de Huella</Label>
            <Input
              id="fingerprint-id"
              type="number"
              value={fingerprintId}
              onChange={(e) => setFingerprintId(e.target.value)}
              placeholder="Ej: 14"
              data-testid="input-fingerprint-id"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={!fingerprintId}
            data-testid="button-delete-specific"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar ID
          </Button>
          <Button variant="destructive" onClick={onDeleteAll} data-testid="button-delete-all">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar TODAS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
