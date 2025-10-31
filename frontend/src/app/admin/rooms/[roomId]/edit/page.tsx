"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditRoomPage() {
    const { roomId } = useParams();
    const router = useRouter();
    const [form, setForm] = useState({
        roomNumber: "",
        roomType: "",
        hotel: "",
        price: "",
    });

    useEffect(() => {
        // Mock: Fetch existing data
        setForm({
            roomNumber: "101",
            roomType: "Deluxe King",
            hotel: "Scandic Waskia",
            price: "179",
        });
    }, [roomId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Room ${roomId} updated successfully (mock only)`);
        router.push("/admin/rooms");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Edit Room #{roomId}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {Object.entries(form).map(([key, value]) => (
                    <div key={key}>
                        <label className="block mb-1 font-medium capitalize">{key}</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) =>
                                setForm({ ...form, [key]: e.target.value })
                            }
                            className="border rounded-lg w-full p-2"
                            required
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    Update Room
                </button>
            </form>
        </div>
    );
}