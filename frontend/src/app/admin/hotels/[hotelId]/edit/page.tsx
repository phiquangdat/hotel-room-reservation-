"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchHotelDetails, updateHotel } from "@/lib/actions";
import toast from "react-hot-toast";
import {
  Loader2,
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  Phone,
  FileText,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth";

export default function EditHotelPage() {
  const { hotelId } = useParams();
  const router = useRouter();

  const { token, isAuthenticated } = useAuthStore();

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
          phoneNumber: hotel.phoneNumber || "",
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

    if (!form.name || !form.address || !form.city) {
      toast.error("Hotel Name, Address, and City are required fields.");
      setIsSaving(false);
      return;
    }

    if (!isAuthenticated() || !token) {
      toast.error("Session expired. Please log in again to save changes.");
      setIsSaving(false);
      router.push("/login");
      return;
    }

    try {
      const result = await updateHotel(Number(hotelId), form, token);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`Hotel ${form.name} updated successfully`);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/hotels"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Hotels
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/20 rounded-xl">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Edit Hotel</h1>
                <p className="text-indigo-100 text-sm mt-1">
                  Update hotel information
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Home className="w-4 h-4 text-indigo-600" />
                Hotel Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                placeholder="Enter hotel name"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Address <span className="text-red-500">*</span>
              </label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                placeholder="Enter street address"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                City <span className="text-red-500">*</span>
              </label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                placeholder="Enter city"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Phone className="w-4 h-4 text-indigo-600" />
                Phone Number
              </label>
              <input
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                placeholder="Enter phone number"
                type="tel"
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
                placeholder="Enter hotel description"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Add a brief description of the hotel
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Changes...
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
