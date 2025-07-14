import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/ShadCN/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/ShadCN/card";
import { Input } from "@/components/ui/ShadCN/input";
import { Label } from "@/components/ui/ShadCN/label";
import { Textarea } from "@/components/ui/ShadCN/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/ShadCN/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/ShadCN/table";
import { IVoucher } from "@/models/Voucher";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminVouchersPage() {
  // State utama
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk modal Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<IVoucher | null>(null);

  // State untuk modal Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<IVoucher | null>(null);

  // State untuk form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pointsRequired, setPointsRequired] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fungsi untuk mengambil semua data voucher dari server
  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get<{ vouchers: IVoucher[] }>(
        "/api/admin/vouchers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVouchers(data.vouchers);
    } catch {
      toast.error("Gagal memuat data voucher.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  // Fungsi untuk membersihkan form setelah selesai
  const resetForm = () => {
    setName("");
    setDescription("");
    setPointsRequired("");
    setStock("");
    setImage(null);
    setImagePreview(null);
    setEditingVoucher(null);
  };

  // Handler untuk membuka modal tambah voucher
  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Handler untuk membuka modal edit voucher
  const handleOpenEditModal = (voucher: IVoucher) => {
    setEditingVoucher(voucher);
    setName(voucher.name);
    setDescription(voucher.description);
    setPointsRequired(voucher.pointsRequired.toString());
    setStock(voucher.stock.toString());
    setImagePreview(voucher.imageUrl || null);
    setIsModalOpen(true);
  };

  // Handler saat admin memilih file gambar baru
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handler saat form di-submit (untuk Add dan Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("pointsRequired", pointsRequired);
    formData.append("stock", stock);
    if (image) {
      formData.append("image", image);
    }

    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    try {
      if (editingVoucher) {
        // Mode Edit (mengirim request PUT)
        formData.append("id", editingVoucher._id);
        await axios.put("/api/admin/vouchers", formData, { headers });
        toast.success("Voucher berhasil diperbarui!");
      } else {
        // Mode Tambah (mengirim request POST)
        await axios.post("/api/admin/vouchers", formData, { headers });
        toast.success("Voucher berhasil ditambahkan!");
      }
      resetForm();
      setIsModalOpen(false);
      fetchVouchers();
    } catch {
      toast.error(
        editingVoucher
          ? "Gagal memperbarui voucher."
          : "Gagal menambahkan voucher."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (voucher: IVoucher) => {
    setVoucherToDelete(voucher);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!voucherToDelete) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/admin/vouchers?id=${voucherToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Voucher berhasil dihapus!");
      setIsDeleteModalOpen(false);
      setVoucherToDelete(null);
      fetchVouchers(); // Refresh list
    } catch {
      toast.error("Gagal menghapus voucher.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Manajemen Voucher
            </h1>
            <p className="text-slate-500">
              Tabel ini menampilkan daftar voucher beserta detailnya dan
              memungkinkan admin untuk mengelola voucher seperti menambah,
              mengedit, atau menonaktifkannya.
            </p>
          </div>
          <Link href="/admin/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm"
            >
              <ArrowLeft className="mr-2 size-4" />
              Kembali
            </Button>
          </Link>
        </header>

        {/* --- Dialog untuk Add & Edit --- */}
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            if (!open) resetForm();
            setIsModalOpen(open);
          }}
        >
          <DialogContent className="bg-white text-slate-800">
            <DialogHeader>
              <DialogTitle>
                {editingVoucher ? "Edit Voucher" : "Tambah Voucher Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name">
                  Nama Voucher<b className="text-red-500 mb-3">*</b>
                </Label>
                <Input
                  id="name"
                  placeholder="Masukan Nama Voucher"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">
                  Deskripsi<b className="text-red-500 mb-3">*</b>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Deskripsikan Voucher"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="points">
                  Poin yang Dibutuhkan<b className="text-red-500 mb-3">*</b>
                </Label>
                <Input
                  id="points"
                  placeholder="Masukan Poin yang Dibutuhkan"
                  type="number"
                  value={pointsRequired}
                  onChange={(e) => setPointsRequired(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="stock">
                  Stok<b className="text-red-500 mb-3">*</b>
                </Label>
                <Input
                  id="stock"
                  placeholder="Masukan Jumlah Stok"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="mb-3">
                  Gambar Voucher<b className="text-red-500">*</b>
                </Label>
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700"
                  >
                    Pilih File
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
                  />
                  <span className="text-sm text-slate-500">
                    {image ? image.name : "Belum ada file dipilih"}
                  </span>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium">Preview:</p>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-100"
                  >
                    Batal
                  </Button>
                </DialogClose>
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* --- Dialog untuk Konfirmasi Delete --- */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="bg-white text-slate-800">
            <DialogHeader>
              <DialogTitle>Anda Yakin?</DialogTitle>
              <DialogDescription>
                Tindakan ini akan menghapus voucher{" "}
                <strong className="font-semibold text-red-500">
                  {voucherToDelete?.name}
                </strong>{" "}
                secara permanen. Data yang sudah dihapus tidak dapat
                dikembalikan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="cursor-pointer hover:bg-slate-100"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- Tabel Daftar Voucher --- */}
        <Card className="text-slate-800">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-2xl">Daftar Voucher</CardTitle>
              <p className="mt-1 text-slate-500">
                Tambahkan dan kelola voucher untuk user!
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleOpenAddModal}
              className="cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm "
            >
              Tambah Voucher Baru
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-4">Memuat data voucher...</p>
            ) : (
              <div className="overflow-x-auto">
                <Table className="table-auto md:table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-800 text-center font-bold bg-slate-100">
                        Gambar
                      </TableHead>
                      <TableHead className="text-slate-800 text-center font-bold bg-slate-100">
                        Nama
                      </TableHead>
                      <TableHead className="text-slate-800 text-center font-bold bg-slate-100">
                        Deskripsi
                      </TableHead>
                      <TableHead className="text-slate-800 text-center font-bold bg-slate-100">
                        Poin
                      </TableHead>
                      <TableHead className="text-slate-800 text-center font-bold bg-slate-100">
                        Stok
                      </TableHead>
                      <TableHead className="text-slate-800 text-center font-bold bg-slate-100">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vouchers.length > 0 ? (
                      vouchers.map((v) => (
                        <TableRow key={v._id}>
                          <TableCell className="w-24 text-center align-middle">
                            {v.imageUrl ? (
                              <Image
                                src={v.imageUrl}
                                alt={v.name}
                                width={100}
                                height={100}
                                className="inline-block h-20 w-20 rounded-md object-cover"
                              />
                            ) : (
                              <div className="inline-flex h-16 w-16 items-center justify-center rounded-md bg-slate-200 text-slate-500">
                                No Img
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            {v.name}
                          </TableCell>
                          <TableCell className="max-w-xs truncate whitespace-normal">
                            {v.description}
                          </TableCell>
                          <TableCell className="text-center">
                            {v.pointsRequired}
                          </TableCell>
                          <TableCell className="text-center">
                            {v.stock}
                          </TableCell>
                          <TableCell className="space-x-2 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEditModal(v)}
                              className="cursor-pointer hover:bg-slate-100 shadow-sm"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleOpenDeleteModal(v)}
                              className="cursor-pointer"
                            >
                              Hapus
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          Belum ada voucher yang ditambahkan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
