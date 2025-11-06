import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  timestamp: string;
  message: string;
}

interface LogConsoleProps {
  title: string;
  logs: LogEntry[];
  height?: string;
}

export default function LogConsole({ title, logs, height = "h-64" }: LogConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card data-testid="log-console">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={height}>
          <div ref={scrollRef} className="space-y-1 font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-muted-foreground italic">Sin eventos...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex gap-2" data-testid={`log-entry-${i}`}>
                  <span className="text-muted-foreground">[{log.timestamp}]</span>
                  <span>{log.message}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
