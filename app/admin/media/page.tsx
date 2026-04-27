"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon, Plus, Pencil, Trash2, Save, X,
  GripVertical, Eye, User,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import AdminSidebar from "@/components/AdminSidebar";
import ConfirmModal from "@/components/ConfirmModal";
import { GalleryImage } from "@/lib/defaultData";

const GALLERY_CATEGORIES = ["Events", "School", "Campaign", "Personal"];

type GalleryForm = Omit<GalleryImage, "id">;
const emptyForm: GalleryForm = { url: "", caption: "", category: "Events" };

export default function AdminMediaPage() {
  const {
    isAuthenticated, candidate, updateCandidate, gallery,
    addGalleryImage, updateGalleryImage, deleteGalleryImage,
    showToast, t,
  } = useApp();
  const router = useRouter();

  const [heroImage, setHeroImage] = useState(candidate.heroImage);
  const [aboutImage, setAboutImage] = useState(candidate.aboutImage);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/admin/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    setHeroImage(candidate.heroImage);
    setAboutImage(candidate.aboutImage);
  }, [candidate]);

  if (!isAuthenticated) return null;

  const handleSaveImages = () => {
    updateCandidate({ heroImage, aboutImage });
    showToast(t("admin.saved"), "success");
  };

  const handleEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setForm({ url: img.url, caption: img.caption, category: img.category });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleSaveGallery = () => {
    if (!form.url.trim()) { showToast("Image URL is required", "error"); return; }
    if (editingId) {
      updateGalleryImage(editingId, form);
      showToast("Image updated!", "success");
    } else {
      addGalleryImage(form);
      showToast("Image added!", "success");
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteGalleryImage(deleteId);
      showToast("Image deleted", "info");
      setDeleteId(null);
    }
  };

  const fieldClass = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Media & Gallery</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage candidate photos and gallery images</p>
          </div>

          {/* Hero & About Images */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-bold text-slate-900 dark:text-white">Candidate Photos</h2>
              </div>
              <button onClick={handleSaveImages} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors">
                <Save className="w-4 h-4" />
                {t("admin.save")}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Hero / Home Page Photo URL
                </label>
                <p className="text-xs text-slate-400 mb-2">Large portrait shown on the homepage hero section</p>
                <div className="flex gap-2 mb-3">
                  <input type="url" value={heroImage} onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className={fieldClass}
                  />
                  {heroImage && (
                    <button onClick={() => setPreviewImg(heroImage)}
                      className="p-3 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all flex-shrink-0">
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {heroImage && (
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <img src={heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              {/* About Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  About Page Photo URL
                </label>
                <p className="text-xs text-slate-400 mb-2">Portrait displayed on the About Me page</p>
                <div className="flex gap-2 mb-3">
                  <input type="url" value={aboutImage} onChange={(e) => setAboutImage(e.target.value)}
                    placeholder="https://example.com/about-photo.jpg"
                    className={fieldClass}
                  />
                  {aboutImage && (
                    <button onClick={() => setPreviewImg(aboutImage)}
                      className="p-3 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all flex-shrink-0">
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {aboutImage && (
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <img src={aboutImage} alt="About preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Gallery Images */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Gallery Images</h2>
                  <p className="text-xs text-slate-400">{gallery.length} photos</p>
                </div>
              </div>
              <button onClick={handleNew}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors">
                <Plus className="w-4 h-4" />
                Add Photo
              </button>
            </div>

            {/* Add/Edit Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-5"
                >
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {editingId ? "Edit Photo" : "Add New Photo"}
                      </h3>
                      <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Image URL *</label>
                        <input type="url" value={form.url} onChange={(e) => setForm(f => ({ ...f, url: e.target.value }))}
                          placeholder="https://example.com/photo.jpg" className={fieldClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Caption</label>
                        <input type="text" value={form.caption} onChange={(e) => setForm(f => ({ ...f, caption: e.target.value }))}
                          placeholder="Photo caption" className={fieldClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
                        <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className={fieldClass}>
                          {GALLERY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      {form.url && (
                        <div className="md:col-span-2">
                          <div className="h-32 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                            <img src={form.url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 mt-4 justify-end">
                      <button onClick={() => setShowForm(false)}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleSaveGallery}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors">
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gallery List */}
            {gallery.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No gallery images. Click &ldquo;Add Photo&rdquo; to start.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {gallery.map((img) => (
                  <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800"
                  >
                    <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button onClick={() => handleEdit(img)}
                        className="w-8 h-8 bg-white/20 hover:bg-indigo-600 rounded-full flex items-center justify-center text-white transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(img.id)}
                        className="w-8 h-8 bg-white/20 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-white text-[10px] font-medium truncate">{img.caption || "No caption"}</p>
                      <p className="text-white/60 text-[9px]">{img.category}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Image preview modal */}
      <AnimatePresence>
        {previewImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
            onClick={() => setPreviewImg(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={previewImg}
              alt="Preview"
              className="max-h-[85vh] max-w-[85vw] rounded-2xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={() => setPreviewImg(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
