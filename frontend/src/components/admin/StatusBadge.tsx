"use client";

export default function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toUpperCase();

  const styles: Record<string, string> = {
    AVAILABLE: "bg-green-100 text-green-800 border-green-200",
    OCCUPIED: "bg-blue-100 text-blue-800 border-blue-200",
    BOOKED: "bg-blue-100 text-blue-800 border-blue-200",
    MAINTENANCE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const className =
    styles[normalizedStatus] || "bg-gray-100 text-gray-800 border-gray-200";

  const formatDisplayStatus = (s: string) => {
    const lower = s.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1).replace(/_/g, " ");
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${className}`}
    >
      {formatDisplayStatus(status)}
    </span>
  );
}
