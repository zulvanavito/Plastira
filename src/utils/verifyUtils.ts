import axios from "axios";
import { toast } from "sonner";

export const handleVerify = async (id: string, fetchData: () => void) => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      "/api/pickups/verify",
      { id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Pickup berhasil diverifikasi");
    fetchData();
  } catch {
    toast.error("Gagal verifikasi pickup");
  }
};
