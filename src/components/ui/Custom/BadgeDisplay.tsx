import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/ShadCN/card";
import { Award } from "lucide-react";

interface BadgeDisplayProps {
  badges?: string[];
}

export const BadgeDisplay = ({ badges }: BadgeDisplayProps) => {
  if (!badges || badges.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award /> Lencana Saya
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {" "}
          {badges.map((badge) => (
            <div
              key={badge}
              className="flex flex-col items-center justify-center gap-2 rounded-lg bg-yellow-100 p-4 text-center text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
            >
              <Award size={32} />
              <span className="text-sm font-semibold whitespace-normal">
                {badge}
              </span>{" "}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
