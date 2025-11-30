"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/lib/actions";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function AddRoomPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "Ocean View Suite",
    hotel: "",
    status: "Available",
    capacity: "2",
    description: "",
    imageUrl: "",
  });

  const roomTypes = [
    "Ocean View Suite",
    "Standard Room",
    "Cabin Suite",
    "Executive Studio",
  ];
  const statusOptions = ["Available", "Occupied", "Maintenance", "Booked"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("You must be logged in as admin to create a room");
      router.push("/login");
      return;
    }

    setIsSaving(true);

    try {
      const result = await createRoom(form, token);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Room ${form.roomNumber} created successfully!`);
        router.push("/admin/rooms");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred while creating the room.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/rooms"
          className="group flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 transition-all w-fit"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm group-hover:shadow-md group-hover:bg-indigo-50 flex items-center justify-center transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Rooms</span>
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-amber-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">Add New Room</h1>
            </div>
            <p className="text-indigo-100">
              Enter the details to create a new room listing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase text-xs">
                  Room Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.roomNumber}
                  onChange={(e) =>
                    setForm({ ...form, roomNumber: e.target.value })
                  }
                  className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300"
                  placeholder="e.g. 101"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase text-xs">
                  Hotel Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.hotel}
                  onChange={(e) => setForm({ ...form, hotel: e.target.value })}
                  className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300"
                  placeholder="e.g. Grand Plaza"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase text-xs">
                  Room Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.roomType}
                    onChange={(e) =>
                      setForm({ ...form, roomType: e.target.value })
                    }
                    className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300 appearance-none"
                  >
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase text-xs">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300 appearance-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase text-xs">
                  Capacity
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: e.target.value })
                  }
                  className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300"
                  placeholder="e.g. 2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase text-xs">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300 min-h-[100px]"
                  placeholder="Enter room description..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase text-xs">
                  Image URL
                </label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  className="text-gray-700 border-2 border-gray-200 rounded-xl w-full px-4 py-3.5 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white hover:border-gray-300"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-100">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-amber-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Room
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
