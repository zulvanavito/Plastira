import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface FilterControlsProps {
  currentStatus: string;
  onFilterChange: (status: string) => void;
}

const statuses = ["All", "Verified", "Pending", "Rejected"];

export const FilterControls = ({
  currentStatus,
  onFilterChange,
}: FilterControlsProps) => (
  <div className="flex flex-wrap gap-2">
    {statuses.map((status) => (
      <Button
        key={status}
        variant={status === currentStatus ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange(status)}
        className={clsx(
          "cursor-pointer hover:bg-[#00A7ED] hover:text-white shadow-sm",
          status === currentStatus && "text-white"
        )}
      >
        {status}
      </Button>
    ))}
  </div>
);
