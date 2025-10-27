import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";

export interface RoomCardProps {
  id: string;
  imageUrl: string;
  hotelName: string;
  roomType: string;
  pricePerNight: number;
  capacity: number;
}

export default function RoomCard({
  id,
  imageUrl,
  hotelName,
  roomType,
  pricePerNight,
  capacity,
}: RoomCardProps) {
  return (
    <Link href={`/rooms/${id}`} className="group block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl group-hover:scale-[1.03]">
        <div className="relative h-52 w-full">
          {" "}
          <Image
            src={imageUrl}
            alt={`Photo of ${roomType} at ${hotelName}`}
            fill
            style={{ objectFit: "cover" }}
            className="transition-opacity duration-300 group-hover:opacity-85"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=" // Tiny transparent blur placeholder
          />
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {hotelName}
          </p>
          <h3 className="text-md font-semibold text-gray-800 truncate mt-1">
            {roomType}
          </h3>

          <div className="flex items-center text-gray-600 mt-2">
            <Users className="h-4 w-4 mr-1.5 text-gray-500" />
            <span className="text-sm">Sleeps {capacity}</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-bold text-indigo-700">
              ${pricePerNight}
              <span className="text-sm font-normal text-gray-500">
                {" "}
                / night
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
