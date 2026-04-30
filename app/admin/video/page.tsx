"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Video, Save, X, Upload, Loader2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import AdminSidebar from "@/components/AdminSidebar";
import VideoSection from "@/components/VideoSection";

export default function AdminVideoPage() {
  const { isAuthenticated, candidate, updateCandidate, showToast, labels } = useApp();
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState(candidate.videoUrl);
  const [videoTitle, setVideoTitle] = useState(candidate.videoTitle);
  const [videoDescription, setVideoDescription] = useState(candidate.videoDescription);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/admin/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    setVideoUrl(candidate.videoUrl);
    setVideoTitle(candidate.videoTitle);
    setVideoDescription(candidate.videoDescription);
  }, [candidate]);

  if (!isAuthenticated) return null;

  const handleSave = () => {
    updateCandidate({ videoUrl, videoTitle, videoDescription }).then((ok) => {
      if (ok) {
        showToast(labels.admin.saved, "success");
        setPreview(false);
      }
    });
  };

  const uploadFile = async (file: File) => {
    const allowed = ["video/mp4", "video/webm", "video/ogg"];
    if (!allowed.includes(file.type)) {
      showToast("รองรับเฉพาะ MP4, WebM, OGG", "error");
      return;
    }

    setUploading(true);
    try {
      const res = await fetch("/api/upload/video", {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "อัปโหลดไม่สำเร็จ");
      setVideoUrl(data.url);
      showToast("อัปโหลดวิดีโอสำเร็จ", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const fieldClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#a32f2c] focus:border-transparent";

  const fileName = videoUrl
    ? videoUrl.startsWith("data:")
      ? "วิดีโอ (base64)"
      : videoUrl.split("/").pop() ?? videoUrl
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 md:flex-row">
      <AdminSidebar />

      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[clamp(1.75rem,8vw,2.25rem)] font-black leading-tight text-slate-900 dark:text-white">
                {labels.admin.video}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                เพิ่มหรือแก้ไขวิดีโอแนะนำตัวของผู้สมัคร
              </p>
            </div>
            <button
              onClick={handleSave}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#a32f2c] px-5 py-2.5 font-semibold text-white shadow-lg shadow-[#a32f2c]/20 transition-colors hover:bg-[#8f2926] active:scale-[0.98] sm:w-auto"
            >
              <Save className="w-4 h-4" />
              {labels.admin.save}
            </button>
          </div>

          <div className="space-y-5">
            {/* Video Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                ไฟล์วิดีโอ
              </label>
              <p className="text-xs text-slate-400 mb-4">
                รองรับไฟล์ MP4, WebM, OGG
              </p>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all ${
                  dragOver
                    ? "border-[#a32f2c] bg-red-50 dark:bg-red-950/20"
                    : "border-slate-300 dark:border-slate-600 hover:border-[#a32f2c] hover:bg-slate-50 dark:hover:bg-slate-800/50"
                } ${uploading ? "cursor-not-allowed opacity-60" : ""}`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-10 h-10 text-[#a32f2c] animate-spin" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      กำลังอัปโหลด...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-slate-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        คลิกหรือลากไฟล์วิดีโอมาวางที่นี่
                      </p>
                      <p className="text-xs text-slate-400 mt-1">MP4, WebM, OGG</p>
                    </div>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Current file */}
              {fileName && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Video className="w-4 h-4 text-[#a32f2c] shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-400 truncate flex-1">
                    {fileName}
                  </span>
                  <button
                    onClick={() => setVideoUrl("")}
                    className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Video Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                ชื่อวิดีโอ
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="เช่น วิดีโอแนะนำตัวหมายเลข 2"
                className={fieldClass}
              />
            </motion.div>

            {/* Video Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                รายละเอียดวิดีโอ
              </label>
              <textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                rows={4}
                placeholder="อธิบายวิดีโอสั้น ๆ"
                className={`${fieldClass} resize-none`}
              />
            </motion.div>

            {/* Preview Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setPreview(!preview)}
                className="flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors text-sm"
              >
                <Video className="w-4 h-4" />
                {preview ? "ซ่อนตัวอย่าง" : "ดูตัวอย่างวิดีโอ"}
              </button>
            </motion.div>

            {/* Preview */}
            {preview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden"
              >
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">
                  ตัวอย่าง
                </h3>
                <VideoSection />
              </motion.div>
            )}

            {/* Save */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-[#a32f2c] hover:bg-[#8f2926] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#a32f2c]/20 hover:scale-105"
              >
                <Save className="w-4 h-4" />
                {labels.admin.save}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
