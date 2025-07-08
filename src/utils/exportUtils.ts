import { parse } from "json2csv";
import * as XLSX from "xlsx";

interface Pickup {
  _id: string;
  plasticType: string;
  weightKg: number;
  status: string;
  pointsAwarded: number;
  createdAt: string;
  location: { lat: number; lng: number };
  userId: { _id: string; name: string; email: string };
  rejectionNote?: string;
}

export const handleExportCSV = (data: Pickup[]) => {
  const csv = parse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "pickup_history.csv";
  link.click();
  window.URL.revokeObjectURL(url);
};

export const handleExportExcel = (data: Pickup[]) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pickup History");
  XLSX.writeFile(wb, "pickup_history.xlsx");
};
