import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-100 to-white">
      <Card className="w-full max-w-md text-center shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-700">
            Komodo Smart Water
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700 text-base">
            Kumpulkan sampah plastik, tukarkan jadi poin, dan bantu selamatkan
            lingkungan!
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/login">
              <Button className="w-full">🚀 Masuk</Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" className="w-full">
                📝 Daftar
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
