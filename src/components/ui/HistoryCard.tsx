import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader, User } from "lucide-react";
import { Pickup } from "@/utils/historyUtils"; // Kita akan buat/update file ini

interface HistoryCardProps {
  pickup: Pickup;
  index: number;
  onShowDetail: () => void;
  isAdmin?: boolean;
  onVerify?: () => void;
  onReject?: () => void;
}

export const HistoryCard = ({
  pickup,
  index,
  onShowDetail,
  isAdmin = false,
  onVerify,
  onReject,
}: HistoryCardProps) => {
  const statusInfo = {
    Verified: { icon: <CheckCircle />, color: "text-green-500" },
    Rejected: { icon: <XCircle />, color: "text-red-500" },
    Pending: { icon: <Loader />, color: "text-yellow-500" },
  };

  return (
    <Card
      className="animate-fade-in-up rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            {isAdmin && (
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <User size={14} />
                <span>{pickup.userId.name}</span>
              </div>
            )}
            <p className="mt-1 text-xs text-slate-500">Jenis Sampah</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">
              {pickup.plasticType}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 text-sm font-bold ${
              statusInfo[pickup.status].color
            }`}
          >
            {statusInfo[pickup.status].icon}
            <span>{pickup.status}</span>
          </div>
        </div>
        <div className="my-4 border-t border-slate-200 dark:border-slate-700"></div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            Berat: <strong>{pickup.weightKg} kg</strong>
          </span>
          <span className="text-slate-500">
            Poin:{" "}
            <strong className="text-[#23A4DA]">{pickup.pointsAwarded}</strong>
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 cursor-pointer"
            onClick={onShowDetail}
          >
            Detail
          </Button>
          {isAdmin && pickup.status === "Pending" && (
            <>
              <Button
                size="sm"
                className="flex-1 bg-green-500 hover:bg-green-600 cursor-pointer"
                onClick={onVerify}
              >
                Verifikasi
              </Button>
              <Button
              
                size="sm"
                variant="destructive"
                className="flex-1 cursor-pointer"
                onClick={onReject}
              >
                Tolak
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
