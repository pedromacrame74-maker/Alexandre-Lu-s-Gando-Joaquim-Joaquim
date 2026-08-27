import React, { useState } from "react";
import {
  Search,
  Grid,
  Film,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Filter,
  Play,
  Heart,
  Bookmark,
  Share2,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { VideoItem, CategoryType } from "../types";
import { VideoPlayerCard } from "./VideoPlayerCard";

interface VideoFeedProps {
  videos: VideoItem[];
  onToggleLike: (videoId: string) => void;
  onToggleSave: (videoId: string) => void;
  onToggleOffline: (videoId: string) => void;
  onAddComment: (videoId: string, commentText: string) => void;
  onOpenUpload: () => void;
  onOpenScriptGenerator: () => void;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  videos,
  onToggleLike,
  onToggleSave,
  onToggleOffline,
  onAddComment,
  onOpenUpload,
  onOpenScriptGenerator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedMode, setFeedMode] = useState<"reels" | "grid">("reels");
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [shareModalVideo, setShareModalVideo] = useState<VideoItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filtered videos
  const filteredVideos = videos.filter((v) => {
    const matchesCategory =
      selectedCategory === "todos" || v.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.hashtags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeVideo = filteredVideos[currentReelIndex] || filteredVideos[0];

  const handleNextVideo = () => {
    if (currentReelIndex < filteredVideos.length - 1) {
      setCurrentReelIndex((prev) => prev + 1);
    } else {
      setCurrentReelIndex(0); // loop to top
    }
  };

  const handlePrevVideo = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex((prev) => prev - 1);
    } else {
      setCurrentReelIndex(filteredVideos.length - 1);
    }
  };

  const handleShare = (video: VideoItem) => {
    setShareModalVideo(video);
    setCopiedLink(false);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(
      `Confira essa dica da Dra. Ana Cária 💚: "${shareModalVideo?.title}" - ${window.location.origin}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const categories: { id: CategoryType; label: string; icon?: string }[] = [
    { id: "todos", label: "Todos os Vídeos" },
    { id: "dica_do_dia", label: "✨ Dica do Dia" },
    { id: "diabetes", label: "🩸 Diabetes" },
    { id: "hipertensao", label: "🫀 Hipertensão" },
    { id: "emagrecimento", label: "🥗 Emagrecimento" },
    { id: "mito_ou_verdade", label: "❓ Mito ou Verdade" },
    { id: "receitas_rapidas", label: "🍳 Receitas 1 min" },
    { id: "criancas", label: "🧸 Crianças" },
    { id: "respostas", label: "💬 Dra. Responde" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Banner & Highlights */}
      <div className="bg-[#1A2E1A] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#1A2E1A]/15 mb-6 relative overflow-hidden border border-[#2D6A4F]/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#2D6A4F]/40 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-[#D8F3DC]">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Vídeos Educativos & Dicas Práticas Todo Dia</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white leading-tight">
              Aprenda a comer com saúde, sem neura e com ciência 💚
            </h1>
            <p className="text-xs sm:text-sm text-[#D8F3DC]/90 font-medium leading-relaxed">
              Vídeos curtos de 20s a 60s focados em controle de glicemia, pressão arterial e reeducação alimentar para você e sua família.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap md:flex-col gap-2.5">
            <button
              id="feed-banner-script-btn"
              onClick={onOpenScriptGenerator}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerador de Roteiros IA</span>
            </button>
            <button
              id="feed-banner-upload-btn"
              onClick={onOpenUpload}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-extrabold text-xs sm:text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Film className="w-4 h-4" />
              <span>Gravar / Enviar Vídeo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A2E1A]/50" />
          <input
            type="text"
            id="video-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tema, 'diabetes', 'arroz'..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#1A2E1A]/15 text-xs sm:text-sm font-semibold text-[#1A2E1A] placeholder-[#1A2E1A]/40 focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] transition-all shadow-xs"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-[#1A2E1A]/5 p-1.5 rounded-2xl border border-[#1A2E1A]/10 w-full sm:w-auto justify-center">
          <button
            id="reels-view-toggle"
            onClick={() => setFeedMode("reels")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              feedMode === "reels"
                ? "bg-[#1A2E1A] text-white shadow-sm"
                : "text-[#1A2E1A]/70 hover:text-[#1A2E1A]"
            }`}
          >
            <Film className="w-3.5 h-3.5 text-[#D8F3DC]" />
            <span>Feed Reels</span>
          </button>

          <button
            id="grid-view-toggle"
            onClick={() => setFeedMode("grid")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              feedMode === "grid"
                ? "bg-[#1A2E1A] text-white shadow-sm"
                : "text-[#1A2E1A]/70 hover:text-[#1A2E1A]"
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-[#D8F3DC]" />
            <span>Grade ({filteredVideos.length})</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`category-pill-${cat.id}`}
            onClick={() => {
              setSelectedCategory(cat.id);
              setCurrentReelIndex(0);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === cat.id
                ? "bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/20 scale-102"
                : "bg-white text-[#1A2E1A] hover:bg-[#D8F3DC]/40 border border-[#1A2E1A]/10 shadow-xs"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Feed Content Area */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#1A2E1A]/10 p-8 shadow-xs">
          <Film className="w-12 h-12 mx-auto text-[#2D6A4F]/40 mb-3" />
          <h3 className="text-lg font-black font-display text-[#1A2E1A]">Nenhum vídeo encontrado</h3>
          <p className="text-xs sm:text-sm text-[#1A2E1A]/70 mt-1 max-w-sm mx-auto font-medium">
            Tente pesquisar com outras palavras como "glicose", "banana", "sal" ou limpe os filtros.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("todos");
              setSearchQuery("");
            }}
            className="mt-4 px-5 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-black uppercase tracking-wider shadow-sm hover:bg-[#1A2E1A]"
          >
            Limpar Filtros
          </button>
        </div>
      ) : feedMode === "reels" ? (
        /* Reels Vertical Immersion Layout */
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-2">
          {/* Main Reel Card with Up/Down navigation */}
          <div className="relative w-full max-w-md flex flex-col items-center">
            {activeVideo && (
              <VideoPlayerCard
                key={activeVideo.id}
                video={activeVideo}
                isActive={true}
                onToggleLike={onToggleLike}
                onToggleSave={onToggleSave}
                onToggleOffline={onToggleOffline}
                onAddComment={onAddComment}
                onShare={handleShare}
              />
            )}

            {/* Next / Previous Floating Controls */}
            <div className="hidden sm:flex flex-col gap-2 absolute -right-16 top-1/2 -translate-y-1/2 z-20">
              <button
                id="reel-prev-btn"
                onClick={handlePrevVideo}
                title="Vídeo Anterior"
                className="p-3 rounded-2xl bg-white hover:bg-[#D8F3DC] text-[#1A2E1A] shadow-lg border border-[#1A2E1A]/15 transition-transform hover:scale-110"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <div className="text-center text-[10px] font-black text-[#1A2E1A] bg-white py-1.5 rounded-xl border border-[#1A2E1A]/15 shadow-xs">
                {currentReelIndex + 1}/{filteredVideos.length}
              </div>
              <button
                id="reel-next-btn"
                onClick={handleNextVideo}
                title="Próximo Vídeo"
                className="p-3 rounded-2xl bg-white hover:bg-[#D8F3DC] text-[#1A2E1A] shadow-lg border border-[#1A2E1A]/15 transition-transform hover:scale-110"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile bottom navigation helper */}
            <div className="sm:hidden flex items-center justify-between w-full mt-3 px-2">
              <button
                onClick={handlePrevVideo}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white border border-[#1A2E1A]/15 text-xs font-black uppercase text-[#1A2E1A] shadow-xs"
              >
                <ChevronUp className="w-4 h-4" /> Anterior
              </button>
              <span className="text-xs font-black text-[#1A2E1A]">
                {currentReelIndex + 1} de {filteredVideos.length}
              </span>
              <button
                onClick={handleNextVideo}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white border border-[#1A2E1A]/15 text-xs font-black uppercase text-[#1A2E1A] shadow-xs"
              >
                Próximo <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Side Queue / Transcript Insight (Desktop) */}
          <div className="hidden lg:flex flex-col w-80 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-[#1A2E1A]/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#2D6A4F]" />
                <h3 className="font-black text-xs uppercase tracking-wider text-[#1A2E1A] font-display">Resumo da Dra. Ana</h3>
              </div>
              <p className="text-xs text-[#1A2E1A]/80 leading-relaxed font-medium bg-[#F4F7F2] p-3.5 rounded-2xl border border-[#1A2E1A]/10">
                "{activeVideo.transcript}"
              </p>
              <div className="mt-3 pt-3 border-t border-[#1A2E1A]/10 flex items-center justify-between text-xs text-[#2D6A4F] font-extrabold">
                <span>{activeVideo.viewsCount.toLocaleString()} visualizações</span>
                <span className="text-[#1A2E1A]/50 font-semibold">{activeVideo.publishedAt}</span>
              </div>
            </div>

            {/* Playlist Queue */}
            <div className="bg-white p-4 rounded-3xl border border-[#1A2E1A]/10 shadow-sm flex-1">
              <h4 className="font-black text-xs uppercase tracking-wider text-[#1A2E1A]/70 mb-3 font-display">
                Próximos no Feed
              </h4>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredVideos.map((v, idx) => (
                  <div
                    key={v.id}
                    onClick={() => setCurrentReelIndex(idx)}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all ${
                      idx === currentReelIndex
                        ? "bg-[#D8F3DC] border border-[#2D6A4F]/40"
                        : "hover:bg-[#F4F7F2] border border-transparent"
                    }`}
                  >
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-[#1A2E1A] line-clamp-1">
                        {v.title}
                      </p>
                      <span className="text-[10px] text-[#2D6A4F] font-bold uppercase tracking-wider">
                        {v.categoryLabel} • {v.durationSeconds}s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Grid Mode View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredVideos.map((video, idx) => (
            <div
              key={video.id}
              id={`grid-video-card-${video.id}`}
              onClick={() => {
                setCurrentReelIndex(idx);
                setFeedMode("reels");
              }}
              className="group bg-white rounded-3xl overflow-hidden border border-[#1A2E1A]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col"
            >
              {/* Thumbnail with overlay badge */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                
                {/* Duration Badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-white">
                  {video.durationSeconds}s
                </div>

                {/* Category Pill */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#2D6A4F] text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                  {video.categoryLabel}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 fill-current ml-0.5 text-[#D8F3DC]" />
                  </div>
                </div>

                {/* Bottom title in thumb */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#D8F3DC]">
                    {video.visualScene.badge}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-black text-sm text-[#1A2E1A] font-display line-clamp-2 leading-snug group-hover:text-[#2D6A4F] transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-[#1A2E1A]/70 line-clamp-2 mt-1 font-medium">
                    {video.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#1A2E1A]/10 flex items-center justify-between text-xs text-[#1A2E1A]/60">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-black text-[#1A2E1A]">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      {video.likesCount}
                    </span>
                    <span className="font-semibold">{video.comments.length} dúvidas</span>
                  </div>
                  <span className="text-[#2D6A4F] font-black uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                    Assistir <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {shareModalVideo && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShareModalVideo(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-[#1A2E1A]/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#2D6A4F]" />
                <h3 className="font-black font-display text-[#1A2E1A]">Compartilhar Dica</h3>
              </div>
              <button
                onClick={() => setShareModalVideo(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#F4F7F2] rounded-2xl border border-[#1A2E1A]/10 flex gap-3 items-center">
              <img
                src={shareModalVideo.thumbnailUrl}
                alt=""
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-xs text-[#1A2E1A] line-clamp-2">
                  {shareModalVideo.title}
                </h4>
                <p className="text-[10px] text-[#2D6A4F] font-bold">Dra. Ana Cária 💚</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                id="copy-share-link-btn"
                onClick={handleCopyShareLink}
                className="w-full py-3 rounded-xl bg-[#2D6A4F] hover:bg-[#1A2E1A] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                {copiedLink ? "✓ Link Copiado com Sucesso!" : "Copiar Link do Vídeo"}
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Olha essa dica da Dra. Ana Cária: ${shareModalVideo.title} 💚 Assista aqui: ${window.location.origin}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-[#D8F3DC] hover:bg-[#2D6A4F] hover:text-white text-[#1A2E1A] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-center"
              >
                Enviar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
