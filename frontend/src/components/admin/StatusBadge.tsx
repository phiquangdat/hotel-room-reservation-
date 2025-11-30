"use client";

export default function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Available: "bg-green-100 text-green-800 border-green-200",
    Occupied: "bg-blue-100 text-blue-800 border-blue-200",
    Booked: "bg-blue-100 text-blue-800 border-blue-200",
    Maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const className =
    styles[status] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${className}`}
    >
      {status}
    </span>
  );
}
