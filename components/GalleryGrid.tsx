"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand, Image as ImageIcon } from "lucide-react";
import { GalleryImage } from "@/lib/defaultData";

const CATEGORIES = ["All", "Events", "School", "Campaign", "Personal"];

interface GalleryGridProps {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? images
    : images.filter((img) => img.category === activeCategory);

  const usedCategories = CATEGORIES.filter(
    (c) => c === "All" || images.some((img) => img.category === c)
  );

  const openModal = (idx: number) => setSelectedIdx(idx);
  const closeModal = () => setSelectedIdx(null);

  const navigate = (dir: "prev" | "next") => {
    if (selectedIdx === null) return;
    if (dir === "prev") {
      setSelectedIdx((selectedIdx - 1 + filtered.length) % filtered.length);
    } else {
      setSelectedIdx((selectedIdx + 1) % filtered.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") navigate("prev");
    if (e.key === "ArrowRight") navigate("next");
    if (e.key === "Escape") closeModal();
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={-1} className="outline-none">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {usedCategories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700"
            }`}
          >
            {cat}
            {cat !== "All" && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === cat ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}>
                {images.filter((img) => img.category === cat).length}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No photos in this category</p>
        </div>
      ) : (
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-0">
          <AnimatePresence>
            {filtered.map((image, i) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="break-inside-avoid mb-4 cursor-pointer group"
                onClick={() => openModal(i)}
              >
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                    <p className="text-white font-semibold text-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {image.caption}
                    </p>
                    <span className="text-white/70 text-xs mt-0.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {image.category}
                    </span>
                  </div>
                  {/* Expand icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <Expand className="w-4 h-4 text-white" />
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {image.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedIdx !== null && filtered[selectedIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-sm font-medium">
              {selectedIdx + 1} / {filtered.length}
            </div>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); navigate("prev"); }}
              className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedIdx}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[selectedIdx].url}
                alt={filtered[selectedIdx].caption}
                className="max-h-[80vh] max-w-full object-contain"
              />
              <div className="bg-black/60 backdrop-blur-sm p-4">
                <p className="text-white font-semibold">{filtered[selectedIdx].caption}</p>
                <p className="text-white/60 text-sm mt-0.5">{filtered[selectedIdx].category}</p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); navigate("next"); }}
              className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
