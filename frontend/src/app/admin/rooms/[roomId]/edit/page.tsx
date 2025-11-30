"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  fetchRoomDetails,
  updateRoom,
  fetchAllHotels,
  fetchAllRoomTypes,
  type Hotel,
  type RoomType,
} from "@/lib/actions";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditRoomPage() {
  const { roomId } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [allRoomTypes, setAllRoomTypes] = useState<RoomType[]>([]);

  const [form, setForm] = useState({
    roomNumber: "",
    roomTypeName: "",
    hotelName: "",
    price: "",
    capacity: "",
    status: "",
    description: "",
    imageUrl: "",
  });

  // 1. Load Initial Data
  useEffect(() => {
    if (!roomId) return;

    const initData = async () => {
      try {
        // Fetch Room, Hotels, and RoomTypes in parallel
        const [room, hotelList, roomTypeList] = await Promise.all([
          fetchRoomDetails(roomId as string),
          fetchAllHotels(),
          fetchAllRoomTypes(),
        ]);

        setHotels(hotelList);
        setAllRoomTypes(roomTypeList);

        // Populate form with existing room data
        setForm({
          roomNumber: room.roomNumber,
          roomTypeName: room.roomTypeName,
          hotelName: room.hotelName,
          price: room.pricePerNight.toString(),
          capacity: room.capacity.toString(),
          status: room.status,
          description: (room as any).description || "", // Handle potential missing field
          imageUrl: room.imageUrl,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, [roomId]);

  const availableRoomTypes = allRoomTypes.filter(
    (rt) => rt.hotel.name === form.hotelName
  );

  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const selectedType = availableRoomTypes.find(
      (rt) => rt.name === selectedName
    );

    if (selectedType) {
      setForm((prev) => ({
        ...prev,
        roomTypeName: selectedName,
        price: selectedType.pricePerNight.toString(),
        capacity: selectedType.capacity.toString(),
        description: selectedType.description,
        imageUrl: selectedType.imageUrl,
      }));
    } else {
      setForm((prev) => ({ ...prev, roomTypeName: selectedName }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateRoom(Number(roomId), {
        roomNumber: form.roomNumber,
        roomTypeName: form.roomTypeName,
        hotelName: form.hotelName,
        pricePerNight: parseFloat(form.price),
        capacity: parseInt(form.capacity),
        status: form.status,
        description: form.description,
        imageUrl: form.imageUrl,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Room ${form.roomNumber} updated successfully`);
        router.push("/admin/rooms");
        router.refresh();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/rooms"
          className="group flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 w-fit"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Rooms</span>
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white">
            <h1 className="text-2xl font-bold">Edit Room #{form.roomNumber}</h1>
            <p className="text-indigo-100 mt-1">
              Select a hotel and room type to auto-fill details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Hotel Dropdown */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Hotel
                </label>
                <select
                  value={form.hotelName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      hotelName: e.target.value,
                      roomTypeName: "",
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                >
                  <option value="">Select a Hotel</option>
                  {hotels.map((h) => (
                    <option key={h.id} value={h.name}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Room Type
                </label>
                <select
                  value={form.roomTypeName}
                  onChange={handleRoomTypeChange}
                  disabled={!form.hotelName}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                  required
                >
                  <option value="">Select Type</option>
                  {availableRoomTypes.map((rt) => (
                    <option key={rt.id} value={rt.name}>
                      {rt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  value={form.roomNumber}
                  onChange={(e) =>
                    setForm({ ...form, roomNumber: e.target.value })
                  }
                  className="text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Price per Night
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold pointer-events-none">
                    EUR
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
