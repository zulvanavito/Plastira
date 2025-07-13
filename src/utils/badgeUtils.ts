import PickupModel, { IPickup } from "@/models/Pickup";
import User from "@/models/User";

export const checkAndAwardBadges = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return;

  // Pastikan user.badges adalah array, kalo gak ada, bikin jadi array kosong
  if (!user.badges) {
    user.badges = [];
  }

  const userPickups: IPickup[] = await PickupModel.find({ userId: user._id });
  if (userPickups.length === 0) return;

  const newBadges: string[] = [];

  // 1. Lencana "Kontributor Awal" (First Pickup)
  if (userPickups.length > 0 && !user.badges.includes("Kontributor Awal")) {
    newBadges.push("Kontributor Awal");
  }

  // 2. Lencana berdasarkan total poin
  if (user.points >= 500 && !user.badges.includes("Raja Daur Ulang")) {
    newBadges.push("Raja Daur Ulang");
  }

  // 3. Lencana berdasarkan jenis plastik PET
  const petPickups = userPickups.filter(
    (p: IPickup) => p.plasticType === "PET (Polyethylene Terephthalate)"
  ).length;
  if (petPickups >= 10 && !user.badges.includes("Pahlawan PET")) {
    newBadges.push("Pahlawan PET");
  }

  // 4. Lencana "Konsisten King" (5 pickups dalam 30 hari terakhir)
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const recentPickups = userPickups.filter(
    (p: IPickup) => new Date(p.createdAt) > oneMonthAgo
  ).length;
  if (recentPickups >= 5 && !user.badges.includes("Konsisten King")) {
    newBadges.push("Konsisten King");
  }

  // 5. Lencana "Kolektor Komplit" (Mengumpulkan 3 jenis plastik berbeda)
  const uniquePlasticTypes = new Set(
    userPickups.map((p: IPickup) => p.plasticType)
  );
  if (
    uniquePlasticTypes.size >= 3 &&
    !user.badges.includes("Kolektor Komplit")
  ) {
    newBadges.push("Kolektor Komplit");
  }

  // 6. Lencana "Berat Bersih" (Total berat 50kg)
  const totalWeight = userPickups.reduce(
    (sum: number, p: IPickup) => sum + p.weightKg,
    0
  );
  if (totalWeight >= 50 && !user.badges.includes("Berat Bersih")) {
    newBadges.push("Berat Bersih");
  }

  // Simpan lencana baru ke database
  if (newBadges.length > 0) {
    user.badges.push(...newBadges);
    await user.save();
  }
};
