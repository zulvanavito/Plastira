import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pickup } from "@/utils/historyUtils";
import { User, Mail, Info, Box, Weight, Star } from "lucide-react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/ui/map"), {
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-lg bg-slate-200"></div>
  ),
  ssr: false,
});

interface DetailModalProps {
  pickup: Pickup | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-2">
    <div className="text-slate-500">{icon}</div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  </div>
);

export const DetailModal = ({
  pickup,
  isOpen,
  onClose,
  isAdmin = false,
}: DetailModalProps) => {
  if (!pickup) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white text-slate-800">
        <DialogHeader>
          <DialogTitle>Detail Pickup</DialogTitle>
          <DialogDescription>
            Informasi lengkap{" "}
            {isAdmin
              ? `milik ${pickup.userId.name}`
              : "untuk transaksi"} pada{" "}
            {new Date(pickup.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            .
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="h-48 w-full overflow-hidden rounded-lg bg-slate-200">
            <Map lat={pickup.location.lat} lng={pickup.location.lng} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {isAdmin && (
              <>
                <InfoItem
                  label="Nama Pengguna"
                  value={pickup.userId.name}
                  icon={<User size={16} />}
                />
                <InfoItem
                  label="Email"
                  value={pickup.userId.email}
                  icon={<Mail size={16} />}
                />
              </>
            )}
            <InfoItem
              label="Status"
              value={pickup.status}
              icon={<Info size={16} />}
            />
            <InfoItem
              label="Jenis Plastik"
              value={pickup.plasticType}
              icon={<Box size={16} />}
            />
            <InfoItem
              label="Berat"
              value={`${pickup.weightKg} kg`}
              icon={<Weight size={16} />}
            />
            <InfoItem
              label="Poin Diterima"
              value={`${pickup.pointsAwarded}`}
              icon={<Star size={16} />}
            />
          </div>
          
          {pickup.status === "Rejected" &&
            pickup.rejectionNote &&
            pickup.rejectionNote !== "-" && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-300">
                <Info size={16} />
                <div>
                  <span className="font-semibold">Alasan Penolakan:</span>{" "}
                  {pickup.rejectionNote}
                </div>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
