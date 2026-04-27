"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, CheckCircle, Lock } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const CATEGORIES = [
  "Academic",
  "Wellness",
  "Communication",
  "Events",
  "Environment",
  "Safety",
  "Other",
];

export default function FeedbackPage() {
  const { addFeedback, t, showToast } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "Other",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10) e.message = "Message is too short";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    addFeedback({
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      category: form.category,
      message: form.message.trim(),
    });
    showToast(t("feedback.success"), "success");
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ name: "", email: "", category: "Other", message: "" });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 pt-16 pb-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4"
          >
            <MessageCircle className="w-4 h-4" />
            Your Voice Matters
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black mb-3"
          >
            {t("feedback.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-indigo-200 text-lg"
          >
            {t("feedback.subtitle")}
          </motion.p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                Thank You!
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {t("feedback.success")}
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
              >
                Submit Another
              </button>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-600 mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3">
                <Lock className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>{t("feedback.note")}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t("feedback.name")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder={t("feedback.name.placeholder")}
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.name
                        ? "border-red-400 dark:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t("feedback.email")}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder={t("feedback.email.placeholder")}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t("feedback.category")}
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t("feedback.message")} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder={t("feedback.message.placeholder")}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                      errors.message
                        ? "border-red-400 dark:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-400">
                    {form.message.length} characters
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02]"
                >
                  <Send className="w-4 h-4" />
                  {t("feedback.submit")}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
