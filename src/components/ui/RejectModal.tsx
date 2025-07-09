import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reason: string;
  setReason: (reason: string) => void;
}

export const RejectModal = ({
  isOpen,
  onClose,
  onConfirm,
  reason,
  setReason,
}: RejectModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-slate-800 max-w-lg">
        <DialogHeader>
          <DialogTitle>Tolak Pickup</DialogTitle>
          <DialogDescription>
            Masukkan alasan penolakan untuk request ini.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          className="max-h-[70vh]"
          placeholder="Contoh: Sampah tidak sesuai, lokasi tidak dijangkau, dll."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={onConfirm}
          >
            Kirim Penolakan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
