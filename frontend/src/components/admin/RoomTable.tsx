"use client";
import Link from "next/link";
import { useState } from "react";
import StatusBadge from "./StatusBadge";

export interface Room {
    id: number;
    roomNumber: string;
    roomType: string;
    hotel: string;
    price: number;
    status: "Available" | "Occupied" | "Maintenance";
}

export default function RoomTable() {
    const [rooms, setRooms] = useState<Room[]>([
        {
            id: 1,
            roomNumber: "101",
            roomType: "Deluxe King",
            hotel: "Scandic Waskia",
            price: 179,
            status: "Available",
        },
        {
            id: 2,
            roomNumber: "202",
            roomType: "Standard Twin",
            hotel: "Original Sokos Hotel",
            price: 120,
            status: "Occupied",
        },
    ]);

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this room?")) {
            setRooms(rooms.filter((room) => room.id !== id));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">All Rooms</h1>
                <Link
                    href="/admin/rooms/new"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                    Add New Room
                </Link>
            </div>

            <table className="w-full text-left border">
                <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="p-3">Room #</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Hotel</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                </tr>
                </thead>
                <tbody>
                {rooms.map((room) => (
                    <tr key={room.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{room.roomNumber}</td>
                        <td className="p-3">{room.roomType}</td>
                        <td className="p-3">{room.hotel}</td>
                        <td className="p-3">${room.price}</td>
                        <td className="p-3">
                            <StatusBadge status={room.status} />
                        </td>
                        <td className="p-3 text-right space-x-2">
                            <Link
                                href={`/admin/rooms/${room.id}/edit`}
                                className="text-indigo-600 hover:underline"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(room.id)}
                                className="text-red-600 hover:underline"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}