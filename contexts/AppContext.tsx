"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type Candidate,
  type FeedbackItem,
  type Policy,
  defaultCandidate,
  defaultPolicies,
} from "@/lib/defaultData";
import { labels } from "@/lib/labels";

type Theme = "light" | "dark";
type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface AppContextType {
  candidate: Candidate;
  policies: Policy[];
  feedbackList: FeedbackItem[];
  isLoading: boolean;
  dataError: string | null;
  refreshData: () => Promise<void>;
  theme: Theme;
  toggleTheme: () => void;
  labels: typeof labels;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  updateCandidate: (data: Partial<Candidate>) => Promise<boolean>;
  addPolicy: (policy: Omit<Policy, "id">) => Promise<boolean>;
  updatePolicy: (id: string, data: Partial<Policy>) => Promise<boolean>;
  deletePolicy: (id: string) => Promise<boolean>;
  addFeedback: (feedback: Omit<FeedbackItem, "id" | "timestamp" | "isRead" | "likes">) => Promise<boolean>;
  likeFeedback: (id: string) => Promise<boolean>;
  markFeedbackRead: (id: string) => void;
  deleteFeedback: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | null>(null);

async function readApiError(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [candidate, setCandidate] = useState<Candidate>(defaultCandidate);
  const [policies, setPolicies] = useState<Policy[]>(defaultPolicies);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setDataError(null);
    try {
      const response = await fetch("/api/campaign", { cache: "no-store" });
      if (!response.ok) throw new Error(await readApiError(response, "โหลดข้อมูลไม่สำเร็จ"));
      const data = await response.json();
      setCandidate(data.candidate);
      setPolicies(data.policies);
      setFeedbackList(data.feedbackList);
    } catch (error) {
      const message = error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ";
      setDataError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      if (storedTheme) setTheme(storedTheme);
      if (sessionStorage.getItem("isAuthenticated") === "true") setIsAuthenticated(true);
    } catch {}
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try { localStorage.setItem("theme", next); } catch {}
      return next;
    });
  }, []);

  const login = useCallback((username: string, password: string) => {
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      try { sessionStorage.setItem("isAuthenticated", "true"); } catch {}
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try { sessionStorage.removeItem("isAuthenticated"); } catch {}
  }, []);

  const updateCandidate = useCallback(async (data: Partial<Candidate>) => {
    const isVideoOnly =
      ("videoUrl" in data || "videoTitle" in data || "videoDescription" in data) &&
      Object.keys(data).every((key) => ["videoUrl", "videoTitle", "videoDescription"].includes(key));

    try {
      const response = await fetch(isVideoOnly ? "/api/video" : "/api/candidate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isVideoOnly ? data : { ...candidate, ...data }),
      });
      if (!response.ok) throw new Error(await readApiError(response, "บันทึกข้อมูลไม่สำเร็จ"));
      setCandidate(await response.json());
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : "บันทึกข้อมูลไม่สำเร็จ", "error");
      return false;
    }
  }, [candidate, showToast]);

  const addPolicy = useCallback(async (policy: Omit<Policy, "id">) => {
    try {
      const response = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policy),
      });
      if (!response.ok) throw new Error(await readApiError(response, "เพิ่มนโยบายไม่สำเร็จ"));
      const created = await response.json();
      setPolicies((prev) => [...prev, created]);
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : "เพิ่มนโยบายไม่สำเร็จ", "error");
      return false;
    }
  }, [showToast]);

  const updatePolicy = useCallback(async (id: string, data: Partial<Policy>) => {
    try {
      const current = policies.find((policy) => policy.id === id);
      if (!current) throw new Error("ไม่พบนโยบายนี้");
      const response = await fetch(`/api/policies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...current, ...data }),
      });
      if (!response.ok) throw new Error(await readApiError(response, "แก้ไขนโยบายไม่สำเร็จ"));
      const updated = await response.json();
      setPolicies((prev) => prev.map((policy) => (policy.id === id ? updated : policy)));
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : "แก้ไขนโยบายไม่สำเร็จ", "error");
      return false;
    }
  }, [policies, showToast]);

  const deletePolicy = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/policies/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(await readApiError(response, "ลบนโยบายไม่สำเร็จ"));
      setPolicies((prev) => prev.filter((policy) => policy.id !== id));
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : "ลบนโยบายไม่สำเร็จ", "error");
      return false;
    }
  }, [showToast]);

  const addFeedback = useCallback(async (feedback: Omit<FeedbackItem, "id" | "timestamp" | "isRead" | "likes">) => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });
      if (!response.ok) throw new Error(await readApiError(response, "ส่งความคิดเห็นไม่สำเร็จ"));
      const created = await response.json();
      setFeedbackList((prev) => [created, ...prev]);
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : "ส่งความคิดเห็นไม่สำเร็จ", "error");
      return false;
    }
  }, [showToast]);

  const likeFeedback = useCallback(async (id: string) => {
    try {
      const liked = JSON.parse(localStorage.getItem("likedFeedbackIds") || "[]") as string[];
      if (liked.includes(id)) return false;

      const response = await fetch(`/api/feedback/${id}/like`, { method: "POST" });
      if (!response.ok) throw new Error(await readApiError(response, "กดเห็นด้วยไม่สำเร็จ"));
      const updated = await response.json();
      localStorage.setItem("likedFeedbackIds", JSON.stringify([...liked, id]));
      setFeedbackList((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : "กดเห็นด้วยไม่สำเร็จ", "error");
      return false;
    }
  }, [showToast]);

  const markFeedbackRead = useCallback((id: string) => {
    setFeedbackList((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
  }, []);

  const deleteFeedback = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/feedback/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(await readApiError(response, "ลบความคิดเห็นไม่สำเร็จ"));
      setFeedbackList((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : "ลบความคิดเห็นไม่สำเร็จ", "error");
      return false;
    }
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        candidate,
        policies,
        feedbackList,
        isLoading,
        dataError,
        refreshData,
        theme,
        toggleTheme,
        labels,
        isAuthenticated,
        login,
        logout,
        toasts,
        showToast,
        removeToast,
        updateCandidate,
        addPolicy,
        updatePolicy,
        deletePolicy,
        addFeedback,
        likeFeedback,
        markFeedbackRead,
        deleteFeedback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
