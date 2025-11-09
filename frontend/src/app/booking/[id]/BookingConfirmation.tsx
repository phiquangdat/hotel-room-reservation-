"use client";

import { useState } from "react";
import { useSearchStore } from "@/lib/store";
import { createBooking, type BookingRoomProps } from "@/lib/actions";
import { calculateNights, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Moon,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function BookingConfirmation(room: BookingRoomProps) {
  const { checkInDate, checkOutDate, guestCapacity } = useSearchStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!checkInDate || !checkOutDate || !guestCapacity) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-800 font-medium">
            Booking details are missing. Please start a new search.
          </p>
        </div>
      </div>
    );
  }

  const numberOfNights = calculateNights(checkInDate, checkOutDate);
  const totalPrice = (numberOfNights * room.pricePerNight).toFixed(2);
  const roomId = "roomId" in room ? room.roomId : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!firstName || !lastName || !email || !phoneNumber) {
        setError("Please fill in all guest details.");
        return;
      }

      const result = await createBooking({
        firstName,
        lastName,
        email,
        phoneNumber,
        roomId: roomId,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        numberOfGuests: guestCapacity,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      toast.success("Booking confirmed successfully!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      window.location.href = `/`;
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl shadow-xl border border-indigo-100/50 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6" />
          Booking Summary
        </h2>
        <p className="text-indigo-100 text-sm mt-1">
          Review your reservation details
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="flex items-center text-gray-600 gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="font-medium">Check-in</span>
            </span>
            <span className="font-semibold text-gray-900">
              {formatDate(checkInDate)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="flex items-center text-gray-600 gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="font-medium">Check-out</span>
            </span>
            <span className="font-semibold text-gray-900">
              {formatDate(checkOutDate)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="flex items-center text-gray-600 gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Moon className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="font-medium">Total Nights</span>
            </span>
            <span className="font-semibold text-gray-900">
              {numberOfNights}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="flex items-center text-gray-600 gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="font-medium">Guests</span>
            </span>
            <span className="font-semibold text-gray-900">{guestCapacity}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">
            Price Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-gray-700">
              <span>
                ${room.pricePerNight.toFixed(2)} × {numberOfNights} nights
              </span>
              <span className="font-medium">${totalPrice}</span>
            </div>

            <div className="border-t-2 border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">
                  Total Price
                </span>
                <span className="text-2xl font-bold text-indigo-600 flex items-center gap-1">
                  <DollarSign className="w-6 h-6" />
                  {totalPrice}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Guest Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || numberOfNights <= 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Confirm & Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}
