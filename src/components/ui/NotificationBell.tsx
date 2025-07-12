import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

export interface AppNotification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationBellProps {
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
}

export const NotificationBell = ({
  notifications,
  onMarkAllAsRead,
}: NotificationBellProps) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const timeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " thn lalu";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bln lalu";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hr lalu";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mnt lalu";
    return "Baru saja";
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open && unreadCount > 0) {
          onMarkAllAsRead();
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifikasi</span>
          {notifications.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAllAsRead();
              }}
              className="text-xs font-medium text-blue-500 hover:underline flex items-center gap-1"
            >
              <CheckCheck size={14} /> Tandai semua terbaca
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem disabled>
            Tidak ada notifikasi baru.
          </DropdownMenuItem>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notif) => (
              <Fragment key={notif.id}>
                <DropdownMenuItem
                  className={cn(
                    "flex flex-col items-start gap-1 whitespace-normal",
                    !notif.read && "bg-blue-50 dark:bg-blue-900/30"
                  )}
                >
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-slate-500">
                    {timeAgo(notif.createdAt)}
                  </p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </Fragment>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
