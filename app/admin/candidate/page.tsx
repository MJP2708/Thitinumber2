"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, Upload } from "lucide-react";
import Image from "next/image";
import { useApp } from "@/contexts/AppContext";
import AdminSidebar from "@/components/AdminSidebar";
import { Candidate } from "@/lib/defaultData";

export default function AdminCandidatePage() {
  const { isAuthenticated, candidate, updateCandidate, showToast, labels } = useApp();
  const router = useRouter();
  const [form, setForm] = useState<Candidate>(candidate);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated) router.replace("/admin/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    setForm(candidate);
  }, [candidate]);

  if (!isAuthenticated) return null;

  const handleSave = async () => {
    const ok = await updateCandidate(form);
    if (ok) showToast(labels.admin.saved, "success");
  };

  const handleChange = (field: keyof Candidate, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (field: "heroImage" | "aboutImage", file: File) => {
    setUploading((prev) => ({ ...prev, [field]: true }));
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.url) setForm((prev) => ({ ...prev, [field]: json.url }));
      else showToast(json.error ?? "อัปโหลดไม่สำเร็จ", "error");
    } catch {
      showToast("อัปโหลดไม่สำเร็จ", "error");
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const fields: Array<{ key: keyof Candidate; label: string; type?: string; textarea?: boolean }> = [
    { key: "name", label: "ชื่อผู้สมัคร" },
    { key: "number", label: "หมายเลขผู้สมัคร", type: "number" },
    { key: "slogan", label: "สโลแกน" },
    { key: "grade", label: "ระดับชั้น" },
    { key: "electionDate", label: "วันเลือกตั้ง", type: "date" },
    { key: "bio", label: "แนะนำตัวสั้น ๆ", textarea: true },
    { key: "ideology", label: "แนวคิด", textarea: true },
    { key: "mission", label: "สิ่งที่อยากทำ", textarea: true },
    { key: "vision", label: "ภาพโรงเรียนที่อยากเห็น", textarea: true },
    { key: "reasonForRunning", label: "เหตุผลที่ลงสมัคร", textarea: true },
    { key: "instagramUrl", label: "ลิงก์ Instagram", type: "url" },
  ];

  const imageFields: Array<{ key: "heroImage" | "aboutImage"; label: string }> = [
    { key: "heroImage", label: "รูปหน้าแรก" },
    { key: "aboutImage", label: "รูปหน้าเกี่ยวกับผู้สมัคร" },
  ];

  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-transparent focus:ring-2 focus:ring-[#a32f2c] dark:border-slate-700 dark:bg-slate-800 dark:text-white";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[clamp(1.75rem,8vw,2.25rem)] font-black leading-tight text-slate-950 dark:text-white">{labels.admin.candidate}</h1>
              <p className="mt-1 text-slate-500 dark:text-slate-400">แก้ไขข้อมูลที่แสดงบนหน้าเว็บหาเสียง</p>
            </div>
            <button onClick={handleSave} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#a32f2c] px-5 py-2.5 font-semibold text-white shadow-lg shadow-[#a32f2c]/20 transition hover:bg-[#8f2926] active:scale-[0.98] sm:w-auto">
              <Save className="h-4 w-4" />
              {labels.admin.save}
            </button>
          </motion.div>

          <div className="space-y-5">
            {fields.map(({ key, label, type, textarea }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.035 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
                {textarea ? (
                  <textarea
                    value={form[key] as string}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none leading-7`}
                  />
                ) : (
                  <input
                    type={type || "text"}
                    value={form[key] as string}
                    onChange={(e) => handleChange(key, type === "number" ? Number(e.target.value) : e.target.value)}
                    className={inputClass}
                  />
                )}
              </motion.div>
            ))}

            {imageFields.map(({ key, label }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (fields.length + i) * 0.035 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  {form[key] ? (
                    <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:w-56 dark:border-slate-700 dark:bg-slate-800">
                      <Image src={form[key]} alt={label} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="flex h-36 w-full shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 sm:w-56 dark:border-slate-700 dark:bg-slate-800">
                      <span className="text-xs text-slate-400">ยังไม่มีรูป</span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2">
                    <input
                      id={`img-upload-${key}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      disabled={uploading[key]}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(key, file);
                        e.target.value = "";
                      }}
                    />
                    <label
                      htmlFor={`img-upload-${key}`}
                      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#a32f2c] px-4 py-2.5 text-sm font-semibold text-[#a32f2c] transition hover:bg-[#a32f2c] hover:text-white dark:border-[#c94340] dark:text-[#c94340] dark:hover:bg-[#a32f2c] dark:hover:text-white ${uploading[key] ? "pointer-events-none opacity-50" : ""}`}
                    >
                      <Upload className="h-4 w-4" />
                      {uploading[key] ? "กำลังอัปโหลด..." : "เลือกรูปภาพ"}
                    </label>
                    <p className="text-xs text-slate-400">รองรับ JPG, PNG, WEBP, GIF</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex justify-end pt-4">
              <button onClick={handleSave} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#a32f2c] px-8 py-3 font-bold text-white shadow-lg shadow-[#a32f2c]/20 transition hover:scale-105 hover:bg-[#8f2926] active:scale-[0.98] sm:w-auto">
                <Save className="h-4 w-4" />
                {labels.admin.save}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
