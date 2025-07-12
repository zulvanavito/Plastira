import Link from "next/link";
import { Button } from "@/components/ui/ShadCN/button";
import { Search, Send } from "lucide-react";

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
    <Search size={48} className="text-slate-400" />
    <h3 className="mt-4 text-xl font-semibold text-slate-700 dark:text-white">
      Tidak Ada Data
    </h3>
    <p className="mt-1 text-slate-500 dark:text-slate-400">
      Coba ganti filter atau buat request pickup baru.
    </p>
    <Link href="/request" className="mt-6">
      <Button>
        <Send className="mr-2 size-4" />
        Buat Request Baru
      </Button>
    </Link>
  </div>
);
