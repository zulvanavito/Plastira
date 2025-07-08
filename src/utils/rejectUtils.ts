import axios from "axios";
import { toast } from "sonner";
import { Pickup } from "@/types/types";
export const handleReject = async (
  selectedPickup: Pickup | null,
  rejectReason: string,
  fetchData: () => void,
  setShowReject: (value: boolean) => void,
  setRejectReason: (value: string) => void
) => {
  if (!selectedPickup) return;
  try {
    const token = localStorage.getItem("token");
    await axios.patch(
      "/api/pickups/verify",
      { id: selectedPickup._id, note: rejectReason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Pickup ditolak");
    setShowReject(false);
    setRejectReason("");
    fetchData();
  } catch {
    toast.error("Gagal menolak pickup");
  }
};
