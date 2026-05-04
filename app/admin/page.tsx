"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";

export default function AdminPage() {
  const { isAuthenticated, sessionLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading) return;
    if (isAuthenticated) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, sessionLoading, router]);

  return null;
}
