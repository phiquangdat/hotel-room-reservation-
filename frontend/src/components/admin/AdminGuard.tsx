"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // If not logged in OR not an admin, redirect
      if (!isAuthenticated() || user?.role !== "ROLE_ADMIN") {
        router.replace("/"); // Redirect to home or login
      }
    }
  }, [isMounted, isAuthenticated, user, router]);

  // Show a loading spinner while checking permissions to prevent flashing
  if (!isMounted || !user || user.role !== "ROLE_ADMIN") {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If authorized, render the admin page
  return <>{children}</>;
}
