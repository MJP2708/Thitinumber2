"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";

export default function AdminPage() {
  const { isAuthenticated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, router]);

  return null;
}
