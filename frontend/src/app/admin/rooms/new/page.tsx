"use client";
import { useState } from "react";

export default function AddRoomPage() {
  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "Single",
    hotel: "",
    price: "",
    status: "Available" as "Available" | "Occupied" | "Maintenance",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roomTypes = ["Single", "Double", "Suite", "Deluxe"];
  const statusOptions = ["Available", "Occupied", "Maintenance"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.roomNumber.trim()) {
      newErrors.roomNumber = "Room number is required";
    }

    if (!form.hotel.trim()) {
      newErrors.hotel = "Hotel name is required";
    }

    if (!form.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (validateForm()) {
      alert(`Room ${form.roomNumber} added successfully!`);

      setForm({
        roomNumber: "",
        roomType: "Single",
        hotel: "",
        price: "",
        status: "Available",
      });
      setErrors({});
    }
  };

  const handleCancel = () => {
    alert("Cancel clicked - would navigate back to rooms list");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Room</h1>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the details to add a new room to the system
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block mb-1.5 font-medium text-gray-900">
              Room Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={form.roomNumber}
              onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
              className={`border rounded-lg w-full p-2.5 text-gray-900 ${
                errors.roomNumber ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              placeholder="e.g., 101, 205"
            />
            {errors.roomNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.roomNumber}</p>
            )}
          </div>

          <div>
            <label className="block mb-1.5 font-medium text-gray-900">
              Room Type <span className="text-red-600">*</span>
            </label>
            <select
              value={form.roomType}
              onChange={(e) => setForm({ ...form, roomType: e.target.value })}
              className="border border-gray-300 rounded-lg w-full p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1.5 font-medium text-gray-900">
              Hotel <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={form.hotel}
              onChange={(e) => setForm({ ...form, hotel: e.target.value })}
              className={`border rounded-lg w-full p-2.5 text-gray-900 ${
                errors.hotel ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              placeholder="e.g., Grand Plaza"
            />
            {errors.hotel && (
              <p className="text-red-600 text-sm mt-1">{errors.hotel}</p>
            )}
          </div>

          <div>
            <label className="block mb-1.5 font-medium text-gray-900">
              Price per Night <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={`border rounded-lg w-full p-2.5 pl-8 text-gray-900 ${
                  errors.price ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            {errors.price && (
              <p className="text-red-600 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block mb-1.5 font-medium text-gray-900">
              Status <span className="text-red-600">*</span>
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as
                    | "Available"
                    | "Occupied"
                    | "Maintenance",
                })
              }
              className="border border-gray-300 rounded-lg w-full p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              Save Room
            </button>
            <button
              onClick={handleCancel}
              className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
