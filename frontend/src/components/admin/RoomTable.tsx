"use client";
import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { type BookingRoomProps } from "@/lib/actions";

interface RoomTableProps {
  initialRooms: BookingRoomProps[];
}

export default function RoomTable({ initialRooms }: RoomTableProps) {
  const [rooms, setRooms] = useState<BookingRoomProps[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = (id: number) => {
    setRooms(rooms.filter((room) => room.roomId !== id));
    setDeleteId(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Rooms</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            Add New Room
          </button>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No rooms
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Get started by creating a new room.
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Add New Room
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 font-semibold text-gray-900">Room #</th>
                    <th className="p-3 font-semibold text-gray-900">Type</th>
                    <th className="p-3 font-semibold text-gray-900">Hotel</th>
                    <th className="p-3 font-semibold text-gray-900">Price</th>
                    <th className="p-3 font-semibold text-gray-900">Status</th>
                    <th className="p-3 font-semibold text-gray-900 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">
                        {room.roomNumber}
                      </td>
                      <td className="p-3 text-gray-700">{room.roomType}</td>
                      <td className="p-3 text-gray-700">{room.hotel}</td>
                      <td className="p-3 font-medium text-gray-900">
                        {formatPrice(room.price)}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={room.status} />
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium">
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(room.id)}
                          className="text-red-600 hover:text-red-800 hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Delete Room
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this room? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
