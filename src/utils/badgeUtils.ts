import PickupModel from "@/models/Pickup"; // Ganti import ini
import User from "@/models/User";
import { Pickup } from "@/utils/historyUtils"; // Tipe data tetap dipake

export const checkAndAwardBadges = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return;

  // Pake PickupModel buat query
  const userPickups = await PickupModel.find({ userId: user._id });

  const newBadges: string[] = [];

  // Lencana berdasarkan total poin
  if (user.points >= 500 && !user.badges.includes("Raja Daur Ulang")) {
    newBadges.push("Raja Daur Ulang");
  }

  // Lencana berdasarkan jenis plastik, kasih tipe data ke 'p'
  const petPickups = userPickups.filter(
    (p: Pickup) => p.plasticType === "PET (Polyethylene Terephthalate)"
  ).length;

  if (petPickups >= 10 && !user.badges.includes("Pahlawan PET")) {
    newBadges.push("Pahlawan PET");
  }

  if (newBadges.length > 0) {
    user.badges.push(...newBadges);
    await user.save();
  }
};
