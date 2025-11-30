"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchRoomDetails, updateRoom } from "@/lib/actions";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function EditRoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "",
    roomTypeId: "",
    hotel: "",
    price: "",
    capacity: "",
    status: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!roomId) return;

    const loadRoom = async () => {
      try {
        const data = await fetchRoomDetails(roomId as string);
        setForm({
          roomNumber: data.roomNumber,
          roomType: data.roomTypeName,
          roomTypeId: data.roomTypeId,
          hotel: data.hotelName,
          price: data.pricePerNight.toString(),
          capacity: data.capacity.toString(),
          status: data.status,
          description: "",
          imageUrl: data.imageUrl,
        });
      } catch (error) {
        toast.error("Failed to load room data");
      } finally {
        setIsLoading(false);
      }
    };

    loadRoom();
  }, [roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateRoom(Number(roomId), {
        roomNumber: form.roomNumber,
        roomTypeName: form.roomType,
        roomTypeId: Number(form.roomTypeId),
        hotelName: form.hotel,
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
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const fieldLabels: Record<string, string> = {
    roomNumber: "Room Number",
    roomType: "Room Type Name",
    roomTypeId: "Room Type ID",
    hotel: "Hotel Name",
    price: "Price per Night (€)",
    capacity: "Capacity (Guests)",
    status: "Status",
    description: "Description",
    imageUrl: "Image URL",
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
        {" "}
        <button
          onClick={() => router.push("/admin/rooms")}
          className="group flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm group-hover:shadow-md group-hover:bg-indigo-50 flex items-center justify-center transition-all">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <span className="font-medium">Back to Rooms</span>
        </button>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold">Edit Room #{roomId}</h1>
            </div>
            <p className="text-indigo-100">
              Update room details, pricing, and availability
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {Object.entries(form).map(([key, value]) => (
                <div
                  key={key}
                  className={
                    key === "description" || key === "imageUrl"
                      ? "md:col-span-2"
                      : ""
                  }
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase text-xs">
                    {fieldLabels[key] || key}
                  </label>

                  {key === "status" ? (
                    <div className="relative">
                      <select
                        value={value}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                        className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300 appearance-none"
                      >
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {key === "description" ? (
                        <textarea
                          value={value}
                          onChange={(e) =>
                            setForm({ ...form, [key]: e.target.value })
                          }
                          className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300 min-h-[100px]"
                          placeholder={`Enter ${
                            fieldLabels[key]?.toLowerCase() || key
                          }`}
                        />
                      ) : (
                        <input
                          type={
                            key === "price" ||
                            key === "capacity" ||
                            key === "roomTypeId"
                              ? "number"
                              : "text"
                          }
                          value={value}
                          onChange={(e) =>
                            setForm({ ...form, [key]: e.target.value })
                          }
                          className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300"
                          placeholder={`Enter ${
                            fieldLabels[key]?.toLowerCase() || key
                          }`}
                          required={key !== "description" && key !== "imageUrl"}
                        />
                      )}

                      {key === "price" && (
                        <div className="absolute right-30 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                          EUR
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-100">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/rooms")}
                className="sm:w-auto px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
