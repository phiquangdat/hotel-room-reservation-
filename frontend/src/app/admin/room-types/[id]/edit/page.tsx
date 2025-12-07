"use client";
export const dynamic = "force-dynamic";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  fetchRoomTypeById,
  updateRoomType,
  fetchAllHotels,
} from "@/lib/actions";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";
import {
  Loader2,
  ArrowLeft,
  Save,
  X,
  Users,
  DollarSign,
  ImageIcon,
  FileText,
  Building2,
  Bed,
} from "lucide-react";
import Link from "next/link";

type FormState = {
  name: string;
  description: string;
  imageUrl: string;
  pricePerNight: number;
  capacity: number;
  hotelId: string;
};

export default function RoomTypeEditPage() {
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const id = params?.id?.toString();

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    imageUrl: "",
    pricePerNight: 0,
    capacity: 0,
    hotelId: "",
  });

  const [hotels, setHotels] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      if (!isAuthenticated() || !token) {
        toast.error("Session expired. Please log in to load data.");
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const [roomType, hotelList] = await Promise.all([
          fetchRoomTypeById(Number(id), token),
          fetchAllHotels(),
        ]);

        setForm({
          name: roomType.name,
          description: roomType.description || "",
          imageUrl: roomType.imageUrl || "",
          pricePerNight: roomType.pricePerNight,
          capacity: roomType.capacity,
          hotelId: String(roomType.hotelId),
        });

        setHotels(hotelList);
      } catch (err) {
        toast.error("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, token]);

  const validateField = (field: string, value: string | number) => {
    switch (field) {
      case "name":
        return value ? "" : "Room type name is required";

      case "hotelId":
        return value ? "" : "Please select a hotel";

      case "pricePerNight":
        return Number(value) > 0 ? "" : "Price must be greater than 0";

      case "capacity":
        return Number(value) > 0 ? "" : "Capacity must be at least 1";

      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    const parsedValue =
      name === "pricePerNight" || name === "capacity" ? Number(value) : value;

    setForm((prev) => ({ ...prev, [name]: parsedValue }));

    if (touched[name]) {
      const error = validateField(name, parsedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
    const allTouched = Object.keys(form).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<string, boolean>
    );
    setTouched(allTouched);

    const newErrors: Record<string, string> = {};
    (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Fix all errors before saving");
      return;
    }

    if (!id) {
      toast.error("Invalid room ID");
      return;
    }

    if (!isAuthenticated() || !token) {
      toast.error("Your session has expired. Please log in.");
      router.push("/login");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl,
      pricePerNight: form.pricePerNight,
      capacity: form.capacity,
      hotelId: Number(form.hotelId),
    };

    console.log("✅ UPDATE PAYLOAD:", payload);

    setSaving(true);
    try {
      await updateRoomType(Number(id), payload, token);
      toast.success("Room type updated successfully!");
      router.push("/admin/room-types");
    } catch (err) {
      toast.error("Failed to update room type");
      console.error("❌ UPDATE FAILED:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/admin/room-types"
          className="group inline-flex items-center gap-3 mb-8 text-slate-700 hover:text-blue-600 transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-white shadow-md group-hover:shadow-lg flex items-center justify-center transition-all group-hover:scale-105">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg">Back to Room Types</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bed className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Edit Room Type
                </h1>
                <p className="text-blue-100 font-medium">{form.name}</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 lg:p-10 space-y-8">
            {/* Hotel Selection */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Hotel Assignment
                <span className="text-red-500">*</span>
              </label>
              <select
                name="hotelId"
                value={form.hotelId}
                onChange={handleChange}
                onBlur={() => handleBlur("hotelId")}
                className={`w-full px-4 py-3.5 text-slate-900 rounded-xl border-2 focus:ring-4 focus:ring-blue-100 outline-none bg-white transition-all ${
                  errors.hotelId && touched.hotelId
                    ? "border-red-500 bg-red-50"
                    : "border-slate-300 hover:border-slate-400 focus:border-blue-500"
                }`}
                required
              >
                <option value="">Select a hotel...</option>
                {hotels.map((h) => (
                  <option key={h.id} value={String(h.id)}>
                    {h.name}
                  </option>
                ))}
              </select>
              {errors.hotelId && touched.hotelId && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.hotelId}
                </p>
              )}
            </div>

            {/* Room Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Room Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Room Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  placeholder="e.g., Deluxe Suite"
                  className={`w-full px-4 py-3.5 text-slate-900 rounded-xl border-2 outline-none bg-white transition-all focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400 ${
                    errors.name && touched.name
                      ? "border-red-500 bg-red-50"
                      : "border-slate-300 hover:border-slate-400 focus:border-blue-500"
                  }`}
                  required
                />
                {errors.name && touched.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Price per Night <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={form.pricePerNight}
                    onChange={handleChange}
                    onBlur={() => handleBlur("pricePerNight")}
                    placeholder="99.99"
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-4 py-3.5 text-slate-900 rounded-xl border-2 outline-none bg-white transition-all focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400 ${
                      errors.pricePerNight && touched.pricePerNight
                        ? "border-red-500 bg-red-50"
                        : "border-slate-300 hover:border-slate-400 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
                {errors.pricePerNight && touched.pricePerNight && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.pricePerNight}
                  </p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Guest Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  onBlur={() => handleBlur("capacity")}
                  placeholder="2"
                  min="1"
                  className={`w-full px-4 py-3.5 text-slate-900 rounded-xl border-2 outline-none bg-white transition-all focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400 ${
                    errors.capacity && touched.capacity
                      ? "border-red-500 bg-red-50"
                      : "border-slate-300 hover:border-slate-400 focus:border-blue-500"
                  }`}
                  required
                />
                {errors.capacity && touched.capacity && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.capacity}
                  </p>
                )}
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Image URL
                </label>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3.5 text-slate-900 rounded-xl border-2 border-slate-300 outline-none bg-white transition-all focus:ring-4 focus:ring-blue-100 hover:border-slate-400 focus:border-blue-500 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                Room Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the room's features, amenities, and highlights..."
                className="w-full px-4 py-3.5 text-slate-900 rounded-xl border-2 border-slate-300 outline-none bg-white transition-all focus:ring-4 focus:ring-blue-100 hover:border-slate-400 focus:border-blue-500 resize-none placeholder:text-slate-400"
                rows={5}
              />
              <p className="mt-2 text-sm text-slate-500">
                {form.description.length} characters
              </p>
            </div>

            {/* Image Preview */}
            {form.imageUrl && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Image Preview
                </label>
                <div className="rounded-2xl border-2 border-slate-200 overflow-hidden shadow-lg">
                  <img
                    src={form.imageUrl}
                    alt="Room Type Preview"
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://via.placeholder.com/800x400?text=Image+Load+Failed";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 mt-8 border-t-2 border-slate-100">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={saving}
                className="px-6 py-3.5 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border-2 border-slate-300 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-98"
              >
                {saving ? (
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
