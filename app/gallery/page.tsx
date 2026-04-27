"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Camera } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import GalleryGrid from "@/components/GalleryGrid";

export default function GalleryPage() {
  const { gallery, candidate } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-[#060618] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-700/20 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-700/20 rounded-full blur-[80px] translate-x-1/4 translate-y-1/2" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-28 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/8 border border-white/12 px-4 py-2 rounded-full text-white/70 text-xs font-bold uppercase tracking-widest mb-5"
          >
            <Camera className="w-3.5 h-3.5" />
            Photo Gallery
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-black mb-4"
          >
            Behind the Campaign
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            A visual journey through {candidate.name}&apos;s campaign, school life, and community engagement.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex items-center justify-center gap-2 text-white/30 text-sm"
          >
            <ImageIcon className="w-4 h-4" />
            {gallery.length} photos
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8"
        >
          <GalleryGrid images={gallery} />
        </motion.div>

        {gallery.length === 0 && (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No photos yet</h3>
            <p className="text-slate-400">Visit the admin panel to add campaign photos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
