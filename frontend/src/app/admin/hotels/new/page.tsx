"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHotel } from "@/lib/actions";
import toast from "react-hot-toast";

export default function AddHotelPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phoneNumber: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof typeof form, value: string) => {
    switch (field) {
      case "name":
        return value.trim() ? "" : "Hotel name is required";
      case "address":
        return value.trim() ? "" : "Address is required";
      case "city":
        return value.trim() ? "" : "City is required";
      case "phoneNumber":
        if (!value) return "";
        return /^[\d\s\-\+\(\)]+$/.test(value)
          ? ""
          : "Please enter a valid phone number";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    (Object.keys(form) as Array<keyof typeof form>).forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(form).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSaving(true);

    try {
      const result = await createHotel(form);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Hotel created successfully!");
        router.push("/admin/hotels");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to create hotel. Please try again.");
      console.error("Error creating hotel:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });

    // Validate on change if field was already touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleBlur = (field: keyof typeof form) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, form[field]);
    setErrors({ ...errors, [field]: error });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Add New Hotel
            </h1>
            <p className="text-slate-600">
              Fill in the details below to create a new hotel listing
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hotel Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Hotel Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g., Grand Plaza Hotel"
                required
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                className={`w-full px-4 py-3 text-slate-900 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 ${
                  errors.name && touched.name
                    ? "border-red-500 bg-red-50"
                    : "border-slate-300 hover:border-slate-400"
                }`}
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

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                id="address"
                type="text"
                placeholder="e.g., 123 Main Street"
                required
                value={form.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                onBlur={() => handleBlur("address")}
                className={`w-full px-4 py-3 text-slate-900 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 ${
                  errors.address && touched.address
                    ? "border-red-500 bg-red-50"
                    : "border-slate-300 hover:border-slate-400"
                }`}
              />
              {errors.address && touched.address && (
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
                  {errors.address}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                type="text"
                placeholder="e.g., New York"
                required
                value={form.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                onBlur={() => handleBlur("city")}
                className={`w-full px-4 py-3 text-slate-900 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 ${
                  errors.city && touched.city
                    ? "border-red-500 bg-red-50"
                    : "border-slate-300 hover:border-slate-400"
                }`}
              />
              {errors.city && touched.city && (
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
                  {errors.city}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="e.g., +1 (555) 123-4567"
                value={form.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                onBlur={() => handleBlur("phoneNumber")}
                className={`w-full px-4 py-3 text-slate-900 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 ${
                  errors.phoneNumber && touched.phoneNumber
                    ? "border-red-500 bg-red-50"
                    : "border-slate-300 hover:border-slate-400"
                }`}
              />
              {errors.phoneNumber && touched.phoneNumber && (
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
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Describe the hotel's features, amenities, and unique characteristics..."
                rows={5}
                value={form.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full px-4 py-3 text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400 transition-all resize-none placeholder:text-slate-400"
              />
              <p className="mt-2 text-sm text-slate-500">
                {form.description.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-98 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Hotel
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSaving}
                className="px-8 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold active:scale-98"
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
