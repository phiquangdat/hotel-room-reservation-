"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchHotelDetails, updateHotel } from "@/lib/actions";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, Save, Building2 } from "lucide-react";
import Link from "next/link";

export default function EditHotelPage() {
  const { hotelId } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phoneNumber: "",
    description: "",
  });

  useEffect(() => {
    if (!hotelId) return;

    const loadHotel = async () => {
      try {
        const hotel = await fetchHotelDetails(Number(hotelId));

        setForm({
          name: hotel.name,
          address: hotel.address,
          city: hotel.city,
          phoneNumber: hotel.phoneNumber,
          description: hotel.description || "",
        });
      } catch {
        toast.error("Failed to load hotel");
      } finally {
        setIsLoading(false);
      }
    };

    loadHotel();
  }, [hotelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateHotel(Number(hotelId), form);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Hotel updated successfully");
        router.push("/admin/hotels");
        router.refresh();
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/hotels" className="flex items-center gap-2 mb-8">
          <ArrowLeft /> Back to Hotels
        </Link>

        <div className="bg-white rounded-2xl shadow-xl">
          <div className="bg-indigo-600 p-8 text-white flex items-center gap-3">
            <Building2 className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Edit Hotel</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Hotel Name"
              required
            />

            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Address"
              required
            />

            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border rounded-xl px-4 py-3"
              placeholder="City"
              required
            />

            <input
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Phone Number"
            />

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Description"
            />

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
