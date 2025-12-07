"use client";
export const dynamic = "force-dynamic";
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
import {
  Loader2,
  ArrowLeft,
  Save,
  X,
  Building2,
  Bed,
  Users,
  DollarSign,
  ImageIcon,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth";

export default function EditRoomPage() {
  const { roomId } = useParams();
  const router = useRouter();

  const { token, isAuthenticated } = useAuthStore();

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

  useEffect(() => {
    if (!roomId) return;

    const initData = async () => {
      try {
        const [room, hotelList, roomTypeList] = await Promise.all([
          fetchRoomDetails(roomId as string),
          fetchAllHotels(),
          fetchAllRoomTypes(),
        ]);

        setHotels(hotelList);
        setAllRoomTypes(roomTypeList);

        setForm({
          roomNumber: room.roomNumber,
          roomTypeName: room.roomTypeName,
          hotelName: room.hotelName,
          price: room.pricePerNight.toString(),
          capacity: room.capacity.toString(),
          status: room.status,
          description: (room as any).description || "",
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
    (rt) => rt.hotelName === form.hotelName
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

    // --- 1. AUTHENTICATION CHECK (FIX) ---
    if (!isAuthenticated() || !token) {
      toast.error("Session expired. Please log in to update.");
      setIsSaving(false);
      return;
    }

    const selectedRoomType = allRoomTypes.find(
      (rt) => rt.name === form.roomTypeName && rt.hotelName === form.hotelName
    );

    if (!selectedRoomType) {
      toast.error("Please select a valid Room Type");
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        roomTypeId: selectedRoomType.id,
        roomNumber: form.roomNumber,
        roomTypeName: form.roomTypeName,
        hotelName: form.hotelName,
        pricePerNight: parseFloat(form.price),
        capacity: parseInt(form.capacity),
        status: form.status,
        description: form.description,
        imageUrl: form.imageUrl,
      };

      const result = await updateRoom(Number(roomId), payload, token);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Room ${form.roomNumber} updated successfully`);
        router.refresh();
        router.push("/admin/rooms");
        router.refresh();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Available: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Booked: "bg-amber-100 text-amber-700 border-amber-200",
      Occupied: "bg-blue-100 text-blue-700 border-blue-200",
      Maintenance: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status as keyof typeof colors] || colors.Available;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading room details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin/rooms"
          className="group inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-sm group-hover:shadow-md group-hover:bg-indigo-50 flex items-center justify-center transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold">Back to Rooms</span>
        </Link>

        <div className="text-gray-700 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="bg-blue-600 p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Bed className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    Edit Room #{form.roomNumber}
                  </h1>
                  <p className="text-indigo-100 mt-1 text-sm">
                    Select a hotel and room type to auto-fill details
                  </p>
                </div>
              </div>

              {form.status && (
                <div className="inline-flex mt-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                      form.status
                    )}`}
                  >
                    {form.status}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-10">
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  Hotel & Room Type
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-white transition-all hover:border-gray-300"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Room Type
                    </label>
                    <select
                      value={form.roomTypeName}
                      onChange={handleRoomTypeChange}
                      disabled={!form.hotelName}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all hover:border-gray-300"
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
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bed className="w-5 h-5 text-indigo-600" />
                  Room Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={form.roomNumber}
                      onChange={(e) =>
                        setForm({ ...form, roomNumber: e.target.value })
                      }
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-gray-50 focus:bg-white transition-all hover:border-gray-300 placeholder:text-gray-400"
                      placeholder="e.g., 101"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-white transition-all hover:border-gray-300"
                    >
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      Price per Night
                    </label>
                    <div className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-600 font-medium flex items-center justify-between cursor-not-allowed">
                      <span>{form.price || "0.00"}</span>
                      <span className="text-gray-400 text-sm font-bold">
                        EUR
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 ml-1">
                      * Price is determined by the selected Room Type.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      Capacity
                    </label>
                    <div className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-600 font-medium flex items-center justify-between cursor-not-allowed">
                      <span>
                        {form.capacity ? `${form.capacity} guests` : "N/A"}
                      </span>
                      <span className="text-gray-400 text-sm font-bold">
                        <Users className="w-4 h-4" />
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 ml-1">
                      * Capacity is defined by the selected Room Type.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Media & Description
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-gray-500" />
                      Room Type Image Preview
                    </label>

                    {
                      <div className="rounded-xl border-2 border-gray-200 overflow-hidden shadow-md">
                        <img
                          src={form.imageUrl}
                          alt="Room Type Preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://via.placeholder.com/600x200?text=Image+Load+Failed";
                          }}
                        />
                      </div>
                    }
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <div className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-600 h-28 overflow-y-auto whitespace-pre-wrap">
                      {form.description ||
                        "No description provided for this type."}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 ml-1">
                      Set via Room Type administration page.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-8 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3.5 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
