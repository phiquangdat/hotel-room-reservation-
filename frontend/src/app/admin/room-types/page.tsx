"use client";

import { useEffect, useState } from "react";
import RoomTypeTable from "@/components/admin/RoomTypeTable";
import { fetchAllRoomTypes, type RoomType } from "@/lib/actions";
import { Loader2 } from "lucide-react";

export default function RoomTypesAdminPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoomTypes() {
      try {
        const data: RoomType[] = await fetchAllRoomTypes();
        setRoomTypes(data);
      } catch (err) {
        console.error("Failed to fetch room types:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRoomTypes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <RoomTypeTable initialRoomTypes={roomTypes} />
    </div>
  );
}
