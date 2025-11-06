import { cn } from "@/lib/utils";
import { Fingerprint } from "lucide-react";

interface FingerprintScannerProps {
  status: "idle" | "scanning" | "success" | "error";
  message?: string;
}

export default function FingerprintScanner({ status, message }: FingerprintScannerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8" data-testid="fingerprint-scanner">
      <div
        className={cn(
          "rounded-full p-8 transition-all duration-300",
          status === "idle" && "bg-muted",
          status === "scanning" && "bg-primary/10 animate-pulse",
          status === "success" && "bg-status-online/10",
          status === "error" && "bg-destructive/10"
        )}
      >
        <Fingerprint
          className={cn(
            "h-24 w-24 transition-colors",
            status === "idle" && "text-muted-foreground",
            status === "scanning" && "text-primary",
            status === "success" && "text-status-online",
            status === "error" && "text-destructive"
          )}
        />
      </div>
      {message && (
        <p className={cn(
          "text-center text-sm font-medium",
          status === "scanning" && "text-primary",
          status === "success" && "text-status-online",
          status === "error" && "text-destructive"
        )}>
          {message}
        </p>
      )}
    </div>
  );
}
