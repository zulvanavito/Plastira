import { useRouter } from "next/router";
import { Button } from "@/components/ui/ShadCN/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/ShadCN/card";
import { CheckCircle2, Home, Send } from "lucide-react";

export default function RequestSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <Card className="w-full max-w-lg rounded-2xl p-4 text-center shadow-lg animate-fade-in-up">
        <CardHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="mt-6 text-2xl font-bold text-slate-800 dark:text-white">
            Request Berhasil Terkirim!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-600 dark:text-slate-300">
            Tim kami akan segera memproses permintaan penjemputan Anda. Terima
            kasih telah membantu menjaga lingkungan!
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => router.push("/users/dashboard")}
              className="w-1/2 bg-white hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm cursor-pointer text-black dark:text-white"
              variant="outline"
            >
              <Home className="mr-2 size-4" />
              Kembali ke Dashboard
            </Button>
            <Button
              onClick={() => router.push("/users/request")}
              className="w-1/2 cursor-pointer bg-[#23A4DA] hover:bg-[#34b7ed] text-white shadow-sm dark:hover:bg-[#1a8bbd] dark:shadow-md hover:text-white"
            >
              <Send className="mr-2 size-4" />
              Buat Request Baru
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
