"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/auth";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;

    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "ROLE_ADMIN") {
      router.replace("/");
    }
  }, [isMounted, user, router, isAuthenticated]);

  if (!isMounted || !user || user.role !== "ROLE_ADMIN") {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return <>{children}</>;
}
