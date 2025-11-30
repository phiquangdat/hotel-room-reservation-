"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddRoomPage() {
  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "",
    hotel: "",
    price: "",
  });
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("New room added successfully (mock only)");
    router.push("/admin/rooms");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Room</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label className="block mb-1 font-medium capitalize">{key}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="border rounded-lg w-full p-2"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Save Room
        </button>
      </form>
    </div>
  );
}
