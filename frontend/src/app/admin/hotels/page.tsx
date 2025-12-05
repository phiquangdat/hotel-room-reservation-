import { fetchAllHotels } from "@/lib/actions";
import HotelTable from "@/components/admin/HotelTable";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHotelsPage() {
  const hotels = await fetchAllHotels();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <HotelTable initialHotels={hotels} />
    </Suspense>
  );
}
