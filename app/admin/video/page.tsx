"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Video, Save, X, ExternalLink, PlayCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import AdminSidebar from "@/components/AdminSidebar";
import VideoSection from "@/components/VideoSection";

function detectPlatform(url: string): string | null {
  if (!url) return null;
  if (/youtube\.com|youtu\.be/.test(url)) return "YouTube";
  if (/drive\.google\.com/.test(url)) return "Google Drive";
  if (/vimeo\.com/.test(url)) return "Vimeo";
  if (/\.(mp4|webm|ogg)(\?.*)?$/.test(url)) return "ลิงก์วิดีโอตรง";
  return null;
}

export default function AdminVideoPage() {
  const { isAuthenticated, sessionLoading, candidate, updateCandidate, showToast, labels } = useApp();
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState(candidate.videoUrl);
  const [videoTitle, setVideoTitle] = useState(candidate.videoTitle);
  const [videoDescription, setVideoDescription] = useState(candidate.videoDescription);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !isAuthenticated) router.replace("/admin/login");
  }, [isAuthenticated, sessionLoading, router]);

  useEffect(() => {
    setVideoUrl(candidate.videoUrl);
    setVideoTitle(candidate.videoTitle);
    setVideoDescription(candidate.videoDescription);
  }, [candidate]);

  if (sessionLoading || !isAuthenticated) return null;

  const handleSave = () => {
    updateCandidate({ videoUrl, videoTitle, videoDescription }).then((ok) => {
      if (ok) {
        showToast(labels.admin.saved, "success");
        setPreview(false);
      }
    });
  };

  const fieldClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#a32f2c] focus:border-transparent";

  const platform = detectPlatform(videoUrl);

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
            {/* Video URL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ลิงก์วิดีโอ
              </label>
              <p className="text-xs text-slate-400 mb-3">
                วาง URL จาก YouTube, Google Drive, Vimeo หรือลิงก์ .mp4 โดยตรง
              </p>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... หรือ https://drive.google.com/..."
                  className={fieldClass}
                />
                {videoUrl && (
                  <button
                    onClick={() => setVideoUrl("")}
                    className="p-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {videoUrl && (
                <div className="mt-3 flex items-center gap-3">
                  {platform && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs font-medium">
                      <PlayCircle className="w-3 h-3" />
                      {platform}
                    </span>
                  )}
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    เปิดดูในแท็บใหม่
                  </a>
                </div>
              )}

              {/* Helper chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-slate-400">ตัวอย่างลิงก์ที่รองรับ:</span>
                {[
                  "youtube.com/watch?v=…",
                  "youtu.be/…",
                  "drive.google.com/file/…",
                  "vimeo.com/…",
                ].map((ex) => (
                  <span
                    key={ex}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 font-mono"
                  >
                    {ex}
                  </span>
                ))}
              </div>
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
