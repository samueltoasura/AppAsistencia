import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import type { Student } from "@shared/schema";

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

export default function StudentCard({ student, onClick }: StudentCardProps) {
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className="hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={onClick}
      data-testid={`student-card-${student.id}`}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={student.photoUrl || undefined} alt={student.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0 w-full">
            <h3 className="font-semibold text-sm truncate" data-testid={`student-name-${student.id}`}>
              {student.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {student.section ? `${student.grade} - ${student.section}` : student.grade}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full justify-center">
            {student.fingerprintId ? (
              <Badge variant="outline" className="text-xs">
                ID: {student.fingerprintId}
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Sin huella
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
