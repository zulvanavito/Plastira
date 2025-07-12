import { Card, CardContent } from "@/components/ui/ShadCN/card";
import { cn } from "@/lib/utils";
import { CheckCircle, Loader, Trash2, XCircle } from "lucide-react";

// Pastikan tipe ini sesuai dengan data yang kamu punya
interface Pickup {
  _id: string;
  plasticType: string;
  status: "Pending" | "Verified" | "Rejected";
  createdAt: string;
}

interface RecentPickupCardProps {
  pickup: Pickup;
  onClick: () => void; // Prop untuk handle klik
}

const statusInfo = {
  Verified: {
    icon: <CheckCircle className="text-green-500" />,
    text: "Disetujui",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  Rejected: {
    icon: <XCircle className="text-red-500" />,
    text: "Ditolak",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
  Pending: {
    icon: <Loader className="animate-spin text-yellow-500" />,
    text: "Pending",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
  },
};

export const RecentPickupCard = ({ pickup, onClick }: RecentPickupCardProps) => {
  const { icon, text, bg } = statusInfo[pickup.status];

  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-4 transition-all hover:shadow-md cursor-pointer",
        "hover:bg-slate-100 dark:hover:bg-slate-700/50",
        bg
      )}
    >
      <CardContent className="flex items-center justify-between p-0">
        <div className="flex items-center gap-4">
          <div className="text-slate-500">
            <Trash2 />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              {pickup.plasticType}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {new Date(pickup.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          {icon}
          <span className="hidden sm:inline">{text}</span>
        </div>
      </CardContent>
    </Card>
  );
};