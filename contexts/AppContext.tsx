"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  Candidate,
  Policy,
  FeedbackItem,
  defaultCandidate,
  defaultPolicies,
} from "@/lib/defaultData";
import { translations } from "@/lib/translations";

type Language = "en" | "th";
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
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  updateCandidate: (data: Partial<Candidate>) => void;
  addPolicy: (policy: Omit<Policy, "id">) => void;
  updatePolicy: (id: string, data: Partial<Policy>) => void;
  deletePolicy: (id: string) => void;
  addFeedback: (feedback: Omit<FeedbackItem, "id" | "timestamp" | "isRead">) => void;
  markFeedbackRead: (id: string) => void;
  deleteFeedback: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [candidate, setCandidate] = useState<Candidate>(defaultCandidate);
  const [policies, setPolicies] = useState<Policy[]>(defaultPolicies);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      const sc = localStorage.getItem("candidate");
      if (sc) {
        const storedCandidate = JSON.parse(sc) as Candidate;
        setCandidate({
          ...defaultCandidate,
          ...storedCandidate,
          name: storedCandidate.name === "Matthew Prueksakij" ? defaultCandidate.name : storedCandidate.name,
          number: storedCandidate.number === 7 ? defaultCandidate.number : storedCandidate.number,
          electionDate: storedCandidate.electionDate === "2026-05-15" ? defaultCandidate.electionDate : storedCandidate.electionDate,
        });
      }
      const sp = localStorage.getItem("policies");
      if (sp) setPolicies(JSON.parse(sp));
      const sf = localStorage.getItem("feedback");
      if (sf) setFeedbackList(JSON.parse(sf));
      const st = localStorage.getItem("theme") as Theme | null;
      if (st) setTheme(st);
      const sl = localStorage.getItem("language") as Language | null;
      if (sl) setLanguage(sl);
      const sa = sessionStorage.getItem("isAuthenticated");
      if (sa === "true") setIsAuthenticated(true);
    } catch {}
  }, []);

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

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next = prev === "en" ? "th" : "en";
      try { localStorage.setItem("language", next); } catch {}
      return next;
    });
  }, []);

  const translate = useCallback(
    (key: string) => translations[language]?.[key] || translations["en"]?.[key] || key,
    [language]
  );

  const login = useCallback((username: string, password: string): boolean => {
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

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateCandidate = useCallback((data: Partial<Candidate>) => {
    setCandidate((prev) => {
      const updated = { ...prev, ...data };
      try { localStorage.setItem("candidate", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const addPolicy = useCallback((policy: Omit<Policy, "id">) => {
    setPolicies((prev) => {
      const updated = [...prev, { ...policy, id: Date.now().toString() }];
      try { localStorage.setItem("policies", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const updatePolicy = useCallback((id: string, data: Partial<Policy>) => {
    setPolicies((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...data } : p));
      try { localStorage.setItem("policies", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const deletePolicy = useCallback((id: string) => {
    setPolicies((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try { localStorage.setItem("policies", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const addFeedback = useCallback((feedback: Omit<FeedbackItem, "id" | "timestamp" | "isRead">) => {
    setFeedbackList((prev) => {
      const updated = [{ ...feedback, id: Date.now().toString(), timestamp: new Date().toISOString(), isRead: false }, ...prev];
      try { localStorage.setItem("feedback", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const markFeedbackRead = useCallback((id: string) => {
    setFeedbackList((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, isRead: true } : f));
      try { localStorage.setItem("feedback", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const deleteFeedback = useCallback((id: string) => {
    setFeedbackList((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try { localStorage.setItem("feedback", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        candidate, policies, feedbackList,
        theme, toggleTheme,
        language, toggleLanguage, t: translate,
        isAuthenticated, login, logout,
        toasts, showToast, removeToast,
        updateCandidate,
        addPolicy, updatePolicy, deletePolicy,
        addFeedback, markFeedbackRead, deleteFeedback,
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
