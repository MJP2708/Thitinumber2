"use client";

import { useState } from "react";
import { Play, VideoOff } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

type Orientation = "horizontal" | "vertical" | "square";

function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1&vq=hd1080`;

  const gd = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (gd) return `https://drive.google.com/file/d/${gd[1]}/preview`;

  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;

  return null;
}

function isDirectVideo(url: string): boolean {
  return (
    /\.(mp4|webm|ogg)(\?.*)?$/.test(url) ||
    url.startsWith("data:video/") ||
    /public\.blob\.vercel-storage\.com/.test(url)
  );
}

function getYouTubeThumbnail(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&]+)/);
  return yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : null;
}

function aspectClass(o: Orientation) {
  if (o === "vertical") return "aspect-[9/16] max-w-xs";
  if (o === "square") return "aspect-square max-w-xl";
  return "aspect-video";
}

function VideoSkeleton() {
  return (
    <div className="absolute inset-0 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center">
        <Play className="w-6 h-6 text-slate-400 dark:text-slate-500 ml-1" />
      </div>
    </div>
  );
}

export default function VideoSection() {
  const { candidate, labels } = useApp();
  const { videoUrl, videoTitle, videoDescription } = candidate;
  const [loaded, setLoaded] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>("horizontal");

  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;
  const isDirect = videoUrl ? isDirectVideo(videoUrl) : false;
  const hasVideo = Boolean(embedUrl || isDirect);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Video container — aspect-ratio adapts to detected orientation */}
      <div className={`mx-auto w-full ${aspectClass(orientation)}`}>
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          {hasVideo && !loaded && <VideoSkeleton />}

          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={videoTitle}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setLoaded(true)}
            />
          ) : isDirect ? (
            <video
              src={videoUrl}
              controls
              playsInline
              className="w-full h-full object-contain bg-black"
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                const ratio = v.videoWidth / v.videoHeight;
                if (ratio < 0.75) setOrientation("vertical");
                else if (ratio > 1.25) setOrientation("horizontal");
                else setOrientation("square");
                setLoaded(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-slate-400" />
              </div>
              <div className="text-center px-4">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  {labels.video.placeholder}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {labels.video.placeholderSub}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {(videoTitle || videoDescription) && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{videoTitle}</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{videoDescription}</p>
        </div>
      )}
    </div>
  );
}

export function VideoPreviewCard({ onClick }: { onClick?: () => void }) {
  const { candidate, labels } = useApp();
  const { videoUrl } = candidate;
  const thumbnailUrl = videoUrl ? getYouTubeThumbnail(videoUrl) : null;
  const isDirect = videoUrl ? isDirectVideo(videoUrl) : false;

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
      ) : isDirect ? (
        <video
          src={videoUrl}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          muted
          preload="metadata"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
          <div className="text-white text-center">
            <Play className="w-12 h-12 mx-auto mb-2 opacity-60" />
            <span className="text-sm opacity-60">{labels.home.videoWatch}</span>
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
