"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  FileText,
  GripVertical,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import AdminSidebar from "@/components/AdminSidebar";
import ConfirmModal from "@/components/ConfirmModal";
import { Policy } from "@/lib/defaultData";

const ICONS = [
  "MessageSquare", "Heart", "Star", "Leaf", "BookOpen", "Zap",
  "Globe", "Users", "Music", "Shield", "Target", "Lightbulb",
];

const CATEGORIES = [
  "Technology", "Wellness", "Culture", "Environment", "Education", "Other",
];

type PolicyForm = Omit<Policy, "id">;

const emptyForm: PolicyForm = {
  title: "",
  category: "Technology",
  description: "",
  impact: "",
  icon: "Lightbulb",
  impactScore: 7,
};

export default function AdminPoliciesPage() {
  const {
    isAuthenticated,
    policies,
    addPolicy,
    updatePolicy,
    deletePolicy,
    showToast,
    t,
  } = useApp();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PolicyForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/admin/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleEdit = (policy: Policy) => {
    setEditingId(policy.id);
    setForm({
      title: policy.title,
      category: policy.category,
      description: policy.description,
      impact: policy.impact,
      icon: policy.icon,
      impactScore: policy.impactScore,
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim()) {
      showToast("Title and description are required", "error");
      return;
    }
    if (editingId) {
      updatePolicy(editingId, form);
      showToast("Policy updated!", "success");
    } else {
      addPolicy(form);
      showToast("Policy added!", "success");
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deletePolicy(deleteId);
      showToast("Policy deleted", "info");
      setDeleteId(null);
    }
  };

  const fieldClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                {t("admin.policies")}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {policies.length} policies · Add, edit, or remove policies
              </p>
            </div>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              {t("admin.add")}
            </button>
          </div>

          {/* Policy Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      {editingId ? "Edit Policy" : "New Policy"}
                    </h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, title: e.target.value }))
                        }
                        placeholder="Policy title"
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Category
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, category: e.target.value }))
                        }
                        className={fieldClass}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Icon
                      </label>
                      <select
                        value={form.icon}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, icon: e.target.value }))
                        }
                        className={fieldClass}
                      >
                        {ICONS.map((ic) => (
                          <option key={ic}>{ic}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Impact Score (1–10)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={form.impactScore}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, impactScore: Number(e.target.value) }))
                          }
                          className="flex-1 accent-indigo-600"
                        />
                        <span className="w-8 text-center font-black text-indigo-600 dark:text-indigo-400 text-lg">
                          {form.impactScore}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Description *
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, description: e.target.value }))
                        }
                        rows={3}
                        placeholder="Describe this policy..."
                        className={`${fieldClass} resize-none`}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Expected Impact
                      </label>
                      <textarea
                        value={form.impact}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, impact: e.target.value }))
                        }
                        rows={2}
                        placeholder="What impact will this policy have?"
                        className={`${fieldClass} resize-none`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5 justify-end">
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      {t("admin.cancel")}
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {t("admin.save")}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Policies List */}
          <div className="space-y-3">
            {policies.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">
                  No policies yet. Click &ldquo;Add New Policy&rdquo; to get started.
                </p>
              </div>
            ) : (
              policies.map((policy, i) => (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-start gap-4"
                >
                  <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-700 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {policy.title}
                      </span>
                      <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                        {policy.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {policy.description}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(policy)}
                      className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(policy.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={!!deleteId}
        title={t("admin.confirm.delete")}
        message={t("admin.confirm.delete.sub")}
        confirmLabel={t("admin.delete")}
        cancelLabel={t("admin.cancel")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
