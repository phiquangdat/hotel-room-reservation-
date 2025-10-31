"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Bed, Wifi, Tv, Coffee, Users, MapPin, DollarSign, AlertTriangle } from "lucide-react";

interface Room {
    id: string;
    hotelName: string;
    roomType: string;
    description: string;
    pricePerNight: number;
    capacity: number;
    amenities: string[];
    imageUrls: string[];
    location: string;
}

export default function RoomDetailsPage() {
    const { roomId } = useParams();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!roomId) return;

        const fetchRoom = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${roomId}`,
                    { cache: "no-store" }
                );

                if (!res.ok) {
                    setError("Room not found.");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setRoom(data);
            } catch (err) {
                console.error("Failed to fetch room:", err);
                setError("Failed to load room details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [roomId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                Loading room details...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-red-500">
                <AlertTriangle className="h-10 w-10 mb-3" />
                <p className="text-lg font-semibold">{error}</p>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                No room data available.
            </div>
        );
    }

    return (
        <div className="bg-white max-w-6xl mx-auto p-6 text-gray-800">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{room.roomType}</h1>
                <p className="text-gray-500 mt-1">{room.hotelName}</p>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 text-indigo-500" />
                    {room.location}
                </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-3 gap-4 mb-10">
                {room.imageUrls?.map((url, index) => (
                    <div key={index} className="relative h-60 rounded-lg overflow-hidden shadow-md">
                        <Image src={url} alt={`Room photo ${index + 1}`} fill className="object-cover" />
                    </div>
                ))}
            </div>

            {/* Description */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">About this Room</h2>
                <p className="text-gray-700 leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-700">
                    {room.amenities?.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border"
                        >
                            {item.includes("Wi-Fi") && <Wifi className="h-4 w-4 text-indigo-500" />}
                            {item.includes("TV") && <Tv className="h-4 w-4 text-indigo-500" />}
                            {item.includes("Coffee") && <Coffee className="h-4 w-4 text-indigo-500" />}
                            {item.includes("Bed") && <Bed className="h-4 w-4 text-indigo-500" />}
                            {item.includes("Service") && <Users className="h-4 w-4 text-indigo-500" />}
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price & Button */}
            <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <p className="text-lg text-gray-500">Price per night</p>
                    <p className="text-3xl font-bold text-indigo-600 flex items-center">
                        <DollarSign className="h-6 w-6" /> {room.pricePerNight}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">Sleeps {room.capacity} guests</p>
                </div>

                <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-all font-semibold">
                    Book Now
                </button>
            </div>
        </div>
    );
}