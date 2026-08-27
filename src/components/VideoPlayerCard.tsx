import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  Download,
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle,
  Flame,
  HeartPulse,
  Smile,
  Clock,
  Send,
  UserCheck,
  Check,
  RotateCcw,
} from "lucide-react";
import { VideoItem, Comment } from "../types";

interface VideoPlayerCardProps {
  video: VideoItem;
  isActive: boolean;
  onToggleLike: (videoId: string) => void;
  onToggleSave: (videoId: string) => void;
  onToggleOffline: (videoId: string) => void;
  onAddComment: (videoId: string, commentText: string) => void;
  onShare: (video: VideoItem) => void;
  autoPlay?: boolean;
}

export const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({
  video,
  isActive,
  onToggleLike,
  onToggleSave,
  onToggleOffline,
  onAddComment,
  onShare,
  autoPlay = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(isActive && autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isAnsweringAI, setIsAnsweringAI] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  const duration = video.durationSeconds || 30;
  const progressPercent = (currentTime / duration) * 100;

  // Sync playback when active card changes in carousel
  useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isActive]);

  // Video progress timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return 0; // loop
          }
          return Math.min(duration, prev + 0.2 * playbackSpeed);
        });
      }, 200);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed]);

  // Determine current active step in script
  const currentStep =
    [...video.visualScene.steps]
      .reverse()
      .find((step) => currentTime >= step.time) || video.visualScene.steps[0];

  const handleCardClick = (e: React.MouseEvent) => {
    // Only toggle play if clicking main video surface
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input") || target.closest("textarea")) {
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleLike = () => {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
    onToggleLike(video.id);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const text = newComment;
    setNewComment("");
    onAddComment(video.id, text);

    // Auto trigger Dra. Ana AI reply if patient asks a question
    if (text.includes("?") || text.toLowerCase().includes("posso") || text.toLowerCase().includes("dra")) {
      setIsAnsweringAI(true);
      try {
        const res = await fetch("/api/ai/ask-dra", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: text,
            context: `Vídeo: ${video.title} - Categoria: ${video.categoryLabel}`,
          }),
        });
        const data = await res.json();
        if (data.answer) {
          setTimeout(() => {
            onAddComment(video.id, `Dra. Ana Cária 💚: ${data.answer}`);
            setIsAnsweringAI(false);
          }, 1200);
        } else {
          setIsAnsweringAI(false);
        }
      } catch (err) {
        setIsAnsweringAI(false);
      }
    }
  };

  const getSceneIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap":
        return <Zap className="w-6 h-6 text-amber-400" />;
      case "HelpCircle":
        return <HelpCircle className="w-6 h-6 text-cyan-400" />;
      case "Flame":
        return <Flame className="w-6 h-6 text-orange-400" />;
      case "HeartPulse":
        return <HeartPulse className="w-6 h-6 text-rose-400" />;
      case "Smile":
        return <Smile className="w-6 h-6 text-pink-400" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6 text-emerald-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div
      id={`video-card-${video.id}`}
      className="relative w-full max-w-sm md:max-w-md mx-auto aspect-[9/16] max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl bg-[#081C15] border-2 border-[#1A2E1A] select-none group"
      onClick={handleCardClick}
    >
      {/* Background Animated Layer */}
      <div className={`absolute inset-0 bg-gradient-to-b ${video.bgGradient} opacity-90`} />

      {/* Decorative blurred background thumbnail */}
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="absolute inset-0 w-full h-full object-cover opacity-30 filter blur-xs mix-blend-overlay"
      />

      {/* Animated Visual Canvas Scene */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 bg-[#1A2E1A]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
            <span className="text-[#D8F3DC]">{video.categoryLabel}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/90">{Math.round(duration)}s</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed toggle */}
            <button
              id={`speed-btn-${video.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setPlaybackSpeed(playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1);
              }}
              className="px-2.5 py-1 rounded-full bg-[#1A2E1A]/80 backdrop-blur-md border border-white/20 text-white text-xs font-black hover:bg-white/20"
            >
              {playbackSpeed}x
            </button>

            {/* Mute button */}
            <button
              id={`mute-btn-${video.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-2 rounded-full bg-[#1A2E1A]/80 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-[#D8F3DC]" />}
            </button>
          </div>
        </div>

        {/* Center Clinical Concept Visualizer */}
        <div className="flex-1 flex flex-col items-center justify-center my-4 text-center px-4">
          {/* Badge Icon */}
          <div className="w-18 h-18 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center mb-3 shadow-xl shadow-black/50 animate-bounce duration-1000">
            {getSceneIcon(video.visualScene.iconName)}
          </div>

          <span className="inline-block px-3 py-1 rounded-xl bg-[#2D6A4F]/80 border border-[#52B788]/60 text-[#D8F3DC] text-xs font-black uppercase tracking-wider mb-2 shadow-sm">
            {video.visualScene.badge}
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md font-display leading-tight">
            {video.visualScene.title}
          </h2>
          <p className="text-xs text-[#D8F3DC]/90 mt-1 font-bold max-w-xs">
            {video.visualScene.subtitle}
          </p>

          {/* Current Script Callout Step Box */}
          <div className="w-full mt-5 p-4 rounded-2xl bg-[#1A2E1A]/90 backdrop-blur-md border border-[#2D6A4F]/60 text-left transition-all duration-300 transform scale-100 shadow-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#52B788]" />
              <span className="text-[10px] uppercase font-black text-[#D8F3DC] tracking-wider">
                Orientação da Dra. Ana
              </span>
            </div>
            <p className="text-sm font-extrabold text-white leading-snug">
              {currentStep?.text || video.title}
            </p>
          </div>

          {/* Audio waveform simulation */}
          {isPlaying && (
            <div className="flex items-center gap-1 mt-4">
              {[40, 70, 90, 60, 100, 45, 80, 65, 95, 30].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-[#52B788] rounded-full animate-pulse"
                  style={{
                    height: `${(h * (isPlaying ? 1 : 0.2)) / 4}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Metadata & Auto-Captions Section */}
        <div className="space-y-3">
          {/* Synchronized Closed Captions / Subtitle Bar */}
          {showCaptions && (
            <div className="bg-[#1A2E1A]/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#2D6A4F]/50 text-xs text-center shadow-xl">
              <span className="text-[#D8F3DC] font-black mr-1 uppercase text-[11px] tracking-wider">Dra. Ana:</span>
              <span className="text-white font-bold italic">
                "{currentStep?.text.replace(/^[🚨🥑🥚🥜❌🟢🥣🥞🌱🍫🧂🌿🥣🩺🍚🔬❄️🔄🧃🍎🧀🥖💧🍋⚖️🥗💚]/, "").trim()}"
              </span>
            </div>
          )}

          {/* Author info and Video Title */}
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <img
                  src={video.author.avatar}
                  alt={video.author.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#52B788]"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black font-display text-white">{video.author.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#52B788] fill-[#52B788]/20" />
                  </div>
                  <span className="text-[10px] text-[#D8F3DC] font-bold">{video.author.title}</span>
                </div>
              </div>

              <h3 className="text-sm font-black font-display text-white line-clamp-2 leading-snug drop-shadow-sm">
                {video.title}
              </h3>

              <div className="flex flex-wrap gap-1">
                {video.hashtags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[11px] text-[#D8F3DC] font-black">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Action Icons Column */}
            <div className="flex flex-col items-center gap-3.5 pb-1">
              {/* Like */}
              <button
                id={`like-btn-${video.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className="flex flex-col items-center gap-1 group/btn"
              >
                <div
                  className={`p-3 rounded-full backdrop-blur-md transition-all ${
                    video.isLiked
                      ? "bg-rose-500 text-white scale-110 shadow-lg shadow-rose-500/40"
                      : "bg-[#1A2E1A]/80 border border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${video.isLiked ? "fill-current" : ""} ${
                      likeAnim ? "scale-125" : ""
                    } transition-transform`}
                  />
                </div>
                <span className="text-[11px] font-black text-white drop-shadow-xs">
                  {video.likesCount}
                </span>
              </button>

              {/* Comments */}
              <button
                id={`comments-btn-${video.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCommentsDrawer(!showCommentsDrawer);
                }}
                className="flex flex-col items-center gap-1"
              >
                <div className="p-3 rounded-full bg-[#1A2E1A]/80 border border-white/20 text-white backdrop-blur-md hover:bg-white/20 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-white drop-shadow-xs">
                  {video.comments.length}
                </span>
              </button>

              {/* Bookmark / Save */}
              <button
                id={`save-btn-${video.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(video.id);
                }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`p-3 rounded-full backdrop-blur-md transition-all ${
                    video.isSaved
                      ? "bg-amber-400 text-amber-950 shadow-lg shadow-amber-400/30"
                      : "bg-[#1A2E1A]/80 border border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${video.isSaved ? "fill-current" : ""}`} />
                </div>
                <span className="text-[10px] font-black text-white">Salvar</span>
              </button>

              {/* Download for Offline */}
              <button
                id={`download-offline-btn-${video.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleOffline(video.id);
                }}
                title={video.isOfflineDownloaded ? "Salvo para ver Offline" : "Baixar para ver Offline"}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`p-2.5 rounded-full backdrop-blur-md text-xs transition-all ${
                    video.isOfflineDownloaded
                      ? "bg-[#D8F3DC] text-[#1A2E1A] font-black shadow-md"
                      : "bg-[#1A2E1A]/80 border border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {video.isOfflineDownloaded ? (
                    <Check className="w-4 h-4 text-[#1A2E1A] stroke-[3]" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </div>
                <span className="text-[9px] font-black text-white/90">Offline</span>
              </button>

              {/* Share */}
              <button
                id={`share-btn-${video.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(video);
                }}
                className="flex flex-col items-center gap-1"
              >
                <div className="p-2.5 rounded-full bg-[#1A2E1A]/80 border border-white/20 text-white backdrop-blur-md hover:bg-white/20 transition-colors">
                  <Share2 className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* Timeline & Progress Bar */}
          <div className="pt-1">
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden relative cursor-pointer">
              <div
                className="bg-gradient-to-r from-[#2D6A4F] via-[#52B788] to-amber-300 h-full rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-white/70 font-mono mt-1 font-bold">
              <span>{Math.floor(currentTime)}s</span>
              <span>{duration}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Center Pause / Play indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 pointer-events-none">
          <div className="w-18 h-18 rounded-full bg-[#1A2E1A]/90 backdrop-blur-md flex items-center justify-center text-white border-2 border-[#D8F3DC]/40 shadow-2xl animate-scaleIn">
            <Play className="w-8 h-8 fill-[#D8F3DC] text-[#D8F3DC] ml-1" />
          </div>
        </div>
      )}

      {/* Interactive Comments Drawer Overlay */}
      {showCommentsDrawer && (
        <div
          className="absolute inset-0 bg-[#081C15]/95 backdrop-blur-xl z-30 flex flex-col p-5 text-white animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#52B788]" />
              <span className="font-black font-display text-sm">Dúvidas & Comentários ({video.comments.length})</span>
            </div>
            <button
              onClick={() => setShowCommentsDrawer(false)}
              className="text-xs font-bold text-white/70 hover:text-white px-3 py-1.5 rounded-xl bg-white/10"
            >
              ✕ Fechar
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
            {video.comments.length === 0 ? (
              <div className="text-center text-white/70 py-8">
                <HelpCircle className="w-8 h-8 mx-auto text-[#52B788]/60 mb-2" />
                <p className="font-bold text-white">Nenhuma dúvida ainda.</p>
                <p className="text-[11px] text-[#D8F3DC]/80 font-medium">Seja o primeiro a perguntar para a Dra. Ana Cária!</p>
              </div>
            ) : (
              video.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded-2xl border ${
                    comment.isDraReply
                      ? "bg-[#1A2E1A] border-[#2D6A4F] text-[#D8F3DC]"
                      : "bg-white/5 border-white/10 text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {comment.authorAvatar && (
                        <img
                          src={comment.authorAvatar}
                          alt=""
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      )}
                      <span className="font-black text-[11px] text-[#D8F3DC]">
                        {comment.authorName}
                      </span>
                      {comment.isDraReply && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-[#2D6A4F] text-white font-black uppercase tracking-wider">
                          Dra. Oficial 💚
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-white/50 font-semibold">{comment.createdAt}</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">{comment.text}</p>
                </div>
              ))
            )}

            {isAnsweringAI && (
              <div className="p-3.5 rounded-2xl bg-[#1A2E1A] border border-[#52B788]/60 flex items-center gap-2 text-xs text-[#D8F3DC] animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span className="font-bold">Dra. Ana Cária está digitando uma resposta clínica para você...</span>
              </div>
            )}
          </div>

          {/* Post Question / Comment Form */}
          <form onSubmit={handlePostComment} className="pt-2 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tire uma dúvida com a Dra. Ana..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/50 font-semibold focus:outline-hidden focus:border-[#52B788]"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1A2E1A] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
