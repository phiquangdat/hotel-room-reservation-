import type { Hotel } from "@/lib/actions";
import { Star, MapPin, Phone } from "lucide-react";

export default function HotelCard({
  name,
  address,
  city,
  phoneNumber,
  description,
  rating,
  imageUrl,
}: Hotel) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 h-48 flex items-center justify-center">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />

        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-gray-900">{rating}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <div>
              <div>{address}</div>
              <div className="font-medium text-gray-900">{city}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />

            <a
              href={`tel:${phoneNumber}`}
              className="hover:text-blue-600 transition-colors"
            >
              {phoneNumber}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
