"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import type { RoomCardProps } from "@/lib/actions";

const DEFAULT_IMAGE = "/placeholder-room.jpg";

export default function RoomCard({
  roomId,
  imageUrl,
  hotelName,
  roomTypeName,
  pricePerNight,
  capacity,
}: RoomCardProps) {
  const router = useRouter();

  const handleReserveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/booking/${roomId}`);
  };

  // Fallback if imageUrl is missing or broken
  const safeImageUrl =
    imageUrl && imageUrl.trim() !== "" ? imageUrl : DEFAULT_IMAGE;

  return (
    <Link
      href={`/rooms/${roomId}`}
      className="group block focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg transition-transform"
    >
      <article className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl group-hover:scale-[1.02]">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full bg-gray-200">
          <Image
            src={safeImageUrl}
            alt={`${roomTypeName} at ${hotelName}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
            onError={(e) => {
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {hotelName}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-gray-900 line-clamp-1">
            {roomTypeName}
          </h3>

          <div className="mt-3 flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">Sleeps up to {capacity}</span>
          </div>

          <div className="mt-5 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-indigo-600">
                ${Number(pricePerNight).toFixed(0)}
              </span>
              <span className="ml-1 text-sm text-gray-500">/ night</span>
            </div>
          </div>

          <button
            onClick={handleReserveClick}
            className="mt-5 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            Reserve Now
          </button>
        </div>
      </article>
    </Link>
  );
}
