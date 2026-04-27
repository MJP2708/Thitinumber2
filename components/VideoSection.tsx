"use client";

import { Play, VideoOff } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }
  return null;
}

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/.test(url);
}

export default function VideoSection() {
  const { candidate, t } = useApp();
  const { videoUrl, videoTitle, videoDescription } = candidate;

  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;
  const isDirect = videoUrl ? isDirectVideo(videoUrl) : false;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={videoTitle}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isDirect ? (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
            title={videoTitle}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                {t("video.placeholder")}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {t("video.placeholder.sub")}
              </p>
            </div>
          </div>
        )}
      </div>

      {(videoTitle || videoDescription) && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {videoTitle}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {videoDescription}
          </p>
        </div>
      )}
    </div>
  );
}

export function VideoPreviewCard({ onClick }: { onClick?: () => void }) {
  const { candidate, t } = useApp();
  const { videoUrl } = candidate;
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;
  const thumbnailUrl = embedUrl
    ? `https://img.youtube.com/vi/${embedUrl.split("/embed/")[1]?.split("?")[0]}/hqdefault.jpg`
    : null;

  return (
    <div
      onClick={onClick}
      className="relative aspect-video w-full rounded-2xl overflow-hidden cursor-pointer group bg-slate-900"
    >
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt="วิดีโอแนะนำตัว"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
          <div className="text-white text-center">
            <Play className="w-12 h-12 mx-auto mb-2 opacity-60" />
            <span className="text-sm opacity-60">{t("home.video.watch")}</span>
          </div>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl border border-white/30">
          <Play className="w-6 h-6 text-white ml-1" fill="white" />
        </div>
      </div>
    </div>
  );
}
