"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createRoomType, fetchAllHotels } from "@/lib/actions";
import { Loader2, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function RoomTypeNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    pricePerNight: "",
    capacity: "",
    hotelId: "",
  });
  const [hotels, setHotels] = useState<{ id: number; name: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadHotels() {
      const data = await fetchAllHotels();
      setHotels(data);
    }
    loadHotels();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createRoomType({
        ...form,
        pricePerNight: Number(form.pricePerNight),
        capacity: Number(form.capacity),
        hotelId: form.hotelId,
      });
      toast.success("Room type created successfully!");
      router.push("/admin/room-types");
    } catch (err) {
      toast.error("Failed to create room type");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/admin/room-types"
          className="group flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 transition-all w-fit"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm group-hover:shadow-md group-hover:bg-indigo-50 flex items-center justify-center transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Room Types</span>
        </Link>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-green-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">Add New Room Type</h1>
            </div>
            <p className="text-green-100">
              Enter the details to create a new room type.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Room Name"
              className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300"
              required
            />
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300"
            />
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300"
            />
            <input
              name="pricePerNight"
              type="number"
              value={form.pricePerNight}
              onChange={handleChange}
              placeholder="Price per night"
              className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300"
              required
            />
            <input
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              placeholder="Capacity"
              className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300"
              required
            />
            <select
              name="hotelId"
              value={form.hotelId}
              onChange={handleChange}
              className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300"
              required
            >
              <option value="">Select Hotel</option>
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-100">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-green-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-blue-700 font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Room Type
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/room-types")}
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
