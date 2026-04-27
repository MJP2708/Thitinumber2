"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Video, Save, X, ExternalLink } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import AdminSidebar from "@/components/AdminSidebar";
import VideoSection from "@/components/VideoSection";

export default function AdminVideoPage() {
  const { isAuthenticated, candidate, updateCandidate, showToast, t } = useApp();
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState(candidate.videoUrl);
  const [videoTitle, setVideoTitle] = useState(candidate.videoTitle);
  const [videoDescription, setVideoDescription] = useState(candidate.videoDescription);
  const [preview, setPreview] = useState(false);

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
    updateCandidate({ videoUrl, videoTitle, videoDescription });
    showToast(t("admin.saved"), "success");
    setPreview(false);
  };

  const fieldClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                {t("admin.video")}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Upload or update your campaign video
              </p>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Save className="w-4 h-4" />
              {t("admin.save")}
            </button>
          </div>

          <div className="space-y-5">
            {/* Video URL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Video URL
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Supports YouTube links (e.g., https://youtu.be/...) or direct video file URLs (.mp4)
              </p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
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
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open in new tab
                </a>
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
                Video Title
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Campaign video title"
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
                Video Description
              </label>
              <textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                rows={4}
                placeholder="Describe your campaign video..."
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
                {preview ? "Hide Preview" : "Preview Video"}
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
                  Preview
                </h3>
                <VideoSection />
              </motion.div>
            )}

            {/* Save */}
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
