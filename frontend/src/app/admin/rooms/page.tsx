import { fetchAllRooms } from "@/lib/actions";
import RoomTable from "@/components/admin/RoomTable";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const rooms = await fetchAllRooms();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <RoomTable initialRooms={rooms} />
    </Suspense>
  );
}
