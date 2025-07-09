import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-10">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className="cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm"
      >
        Sebelumnya
      </Button>
      <span className="text-sm text-slate-600">
        Halaman {currentPage} dari {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        className="cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm"
      >
        Selanjutnya
      </Button>
    </div>
  );
};
