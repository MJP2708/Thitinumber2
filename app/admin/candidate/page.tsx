"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Plus, X, Save } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import AdminSidebar from "@/components/AdminSidebar";
import { Candidate } from "@/lib/defaultData";

export default function AdminCandidatePage() {
  const { isAuthenticated, candidate, updateCandidate, showToast, t } = useApp();
  const router = useRouter();
  const [form, setForm] = useState<Candidate>(candidate);
  const [newValue, setNewValue] = useState("");
  const [newStrength, setNewStrength] = useState("");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/admin/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    setForm(candidate);
  }, [candidate]);

  if (!isAuthenticated) return null;

  const handleSave = () => {
    updateCandidate(form);
    showToast(t("admin.saved"), "success");
  };

  const handleChange = (
    field: keyof Candidate,
    value: string | number | string[]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addValue = () => {
    if (newValue.trim() && !form.values.includes(newValue.trim())) {
      handleChange("values", [...form.values, newValue.trim()]);
      setNewValue("");
    }
  };

  const removeValue = (v: string) => {
    handleChange(
      "values",
      form.values.filter((x) => x !== v)
    );
  };

  const addStrength = () => {
    if (newStrength.trim() && !form.strengths.includes(newStrength.trim())) {
      handleChange("strengths", [...form.strengths, newStrength.trim()]);
      setNewStrength("");
    }
  };

  const removeStrength = (s: string) => {
    handleChange(
      "strengths",
      form.strengths.filter((x) => x !== s)
    );
  };

  const fields: Array<{ key: keyof Candidate; label: string; type?: string; textarea?: boolean }> = [
    { key: "name", label: "Full Name" },
    { key: "number", label: "Candidate Number", type: "number" },
    { key: "slogan", label: "Campaign Slogan" },
    { key: "grade", label: "Grade / Class" },
    { key: "electionDate", label: "Election Date", type: "date" },
    { key: "bio", label: "Short Bio", textarea: true },
    { key: "ideology", label: "Ideology", textarea: true },
    { key: "mission", label: "Mission", textarea: true },
    { key: "vision", label: "Vision", textarea: true },
    { key: "reasonForRunning", label: "Reason for Running", textarea: true },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                {t("admin.candidate")}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Edit your campaign profile information
              </p>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Save className="w-4 h-4" />
              {t("admin.save")}
            </button>
          </motion.div>

          <div className="space-y-5">
            {/* Text fields */}
            {fields.map(({ key, label, type, textarea }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
              >
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {label}
                </label>
                {textarea ? (
                  <textarea
                    value={form[key] as string}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <input
                    type={type || "text"}
                    value={form[key] as string}
                    onChange={(e) =>
                      handleChange(
                        key,
                        type === "number" ? Number(e.target.value) : e.target.value
                      )
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                )}
              </motion.div>
            ))}

            {/* Campaign Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
            >
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Campaign Values
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.values.map((v) => (
                  <span
                    key={v}
                    className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    {v}
                    <button
                      onClick={() => removeValue(v)}
                      className="text-indigo-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addValue()}
                  placeholder="Add a value..."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={addValue}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
            >
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Strengths &amp; Skills
              </label>
              <div className="flex flex-col gap-2 mb-3">
                {form.strengths.map((s) => (
                  <div
                    key={s}
                    className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-sm px-3 py-2 rounded-lg"
                  >
                    <span className="font-medium">{s}</span>
                    <button
                      onClick={() => removeStrength(s)}
                      className="text-emerald-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addStrength()}
                  placeholder="Add a strength..."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={addStrength}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Save button bottom */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-600/20 hover:scale-105"
              >
                <Save className="w-4 h-4" />
                {t("admin.save")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
