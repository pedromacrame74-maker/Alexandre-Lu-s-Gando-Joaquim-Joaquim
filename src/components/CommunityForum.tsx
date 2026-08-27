import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Pin,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  Heart,
  Share2,
  Sparkles,
  Award,
  Send,
  Flame,
  AlertCircle,
  Clock,
  Eye,
  Tag,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  X,
  Stethoscope,
} from "lucide-react";
import { ForumPost, ForumReply, ForumCategory, UserProfile } from "../types";

interface CommunityForumProps {
  posts: ForumPost[];
  currentUser: UserProfile;
  onAddPost: (post: ForumPost) => void;
  onAddReply: (postId: string, reply: ForumReply) => void;
  onToggleLikePost: (postId: string) => void;
  onToggleLikeReply: (postId: string, replyId: string) => void;
  onTogglePinPost?: (postId: string) => void;
  onToggleLockPost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onDeleteReply?: (postId: string, replyId: string) => void;
}

const CATEGORY_ITEMS: { id: ForumCategory; label: string; icon: string }[] = [
  { id: "todos", label: "Todos os Tópicos", icon: "🌐" },
  { id: "diabetes", label: "Diabetes & Glicose", icon: "🩸" },
  { id: "hipertensao", label: "Pressão Alta & Coração", icon: "🫀" },
  { id: "emagrecimento", label: "Emagrecimento", icon: "🥗" },
  { id: "duvidas_pratos", label: "Dúvidas de Cardápio", icon: "🍽️" },
  { id: "receitas", label: "Receitas Saudáveis", icon: "🍳" },
  { id: "exames_suplementos", label: "Exames & Suplementos", icon: "💊" },
  { id: "avisos", label: "Avisos da Dra. Ana", icon: "📢" },
];

export const CommunityForum: React.FC<CommunityForumProps> = ({
  posts,
  currentUser,
  onAddPost,
  onAddReply,
  onToggleLikePost,
  onToggleLikeReply,
  onTogglePinPost,
  onToggleLockPost,
  onDeletePost,
  onDeleteReply,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory>("todos");
  const [activeFilter, setActiveFilter] = useState<"all" | "doctor_answered" | "popular" | "my_posts">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

  // New post modal state
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ForumCategory>("diabetes");
  const [newContent, setNewContent] = useState("");
  const [newTagsInput, setNewTagsInput] = useState("");

  // Reply state for currently selected post
  const [replyText, setReplyText] = useState("");
  const [isDoctorOfficial, setIsDoctorOfficial] = useState(currentUser.role === "doctor");

  // Keep selectedPost in sync with posts array
  const currentPost = useMemo(() => {
    if (!selectedPost) return null;
    return posts.find((p) => p.id === selectedPost.id) || selectedPost;
  }, [posts, selectedPost]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        // Category filter
        if (selectedCategory !== "todos" && post.category !== selectedCategory) {
          return false;
        }

        // Sub-filter tabs
        if (activeFilter === "doctor_answered" && !post.hasDoctorReply) {
          return false;
        }
        if (activeFilter === "my_posts" && post.authorId !== currentUser.id && post.authorUsername !== currentUser.username) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = post.title.toLowerCase().includes(q);
          const matchesContent = post.content.toLowerCase().includes(q);
          const matchesAuthor = post.authorName.toLowerCase().includes(q) || post.authorUsername.toLowerCase().includes(q);
          const matchesTags = post.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesContent && !matchesAuthor && !matchesTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned posts always stay on top
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (activeFilter === "popular") {
          return b.likesCount + b.replies.length * 2 - (a.likesCount + a.replies.length * 2);
        }
        // Default sort by id or creation
        return b.id.localeCompare(a.id);
      });
  }, [posts, selectedCategory, activeFilter, searchQuery, currentUser]);

  // Handle submit new post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const categoryObj = CATEGORY_ITEMS.find((c) => c.id === newCategory);
    const parsedTags = newTagsInput
      .split(/[\s,#,]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newPost: ForumPost = {
      id: `fp-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      categoryLabel: categoryObj?.label.replace(/^[^\s]+\s/, "") || "Geral",
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username || currentUser.name.toLowerCase().replace(/\s+/g, ""),
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      createdAt: "Agora mesmo",
      likesCount: 1,
      isLiked: true,
      isPinned: false,
      isLocked: false,
      hasDoctorReply: currentUser.role === "doctor",
      tags: parsedTags.length > 0 ? parsedTags : ["Nutricao"],
      viewsCount: 1,
      replies: [],
    };

    onAddPost(newPost);
    setIsNewPostModalOpen(false);
    setNewTitle("");
    setNewContent("");
    setNewTagsInput("");
    setSelectedPost(newPost);
  };

  // Handle submit reply
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost || !replyText.trim()) return;

    const isDraReply = currentUser.role === "doctor" && isDoctorOfficial;

    const newReply: ForumReply = {
      id: `fpr-${Date.now()}`,
      postId: currentPost.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username || currentUser.name.toLowerCase().replace(/\s+/g, ""),
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      content: replyText.trim(),
      createdAt: "Agora mesmo",
      likesCount: 1,
      isLiked: true,
      isOfficialDoctorReply: isDraReply,
    };

    onAddReply(currentPost.id, newReply);
    setReplyText("");
  };

  // Quick prompt templates for Dra. Ana or patients
  const loadReplyTemplate = (text: string) => {
    setReplyText((prev) => (prev ? `${prev}\n\n${text}` : text));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Forum Header Banner */}
      <div className="bg-[#1A2E1A] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#1A2E1A]/10 border border-[#2D6A4F]/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-[#D8F3DC]">
              <MessageSquare className="w-3.5 h-3.5 text-[#52B788]" />
              <span>Comunidade & Fórum de Nutrição</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Tire suas Dúvidas com a Comunidade & Dra. Ana 💬
            </h1>
            <p className="text-xs sm:text-sm text-[#D8F3DC]/80 max-w-2xl leading-relaxed font-medium">
              Um espaço acolhedor e seguro para você postar dúvidas sobre alimentação, glicose, pressão, receitas e trocar experiências reais com outros pacientes e a Dra. Ana Cária.
            </p>
          </div>

          <button
            id="create-forum-post-btn"
            onClick={() => setIsNewPostModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-[#52B788] hover:bg-[#D8F3DC] text-[#1A2E1A] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#52B788]/20 flex items-center gap-2 transition-all hover:scale-102 active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Fazer Nova Pergunta</span>
          </button>
        </div>
      </div>

      {/* Main View: Split view or Post Detail View */}
      {selectedPost ? (
        /* Post Detailed Discussion View */
        <div className="space-y-6 animate-fadeIn">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-[#D8F3DC]/60 border border-[#1A2E1A]/10 text-xs font-black uppercase tracking-wider text-[#1A2E1A] shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#2D6A4F]" />
              <span>Voltar para Lista de Tópicos</span>
            </button>

            {currentUser.role === "doctor" && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Painel de Moderação Ativo (Dra. Ana)</span>
              </div>
            )}
          </div>

          {/* Detailed Question Card */}
          {currentPost && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A2E1A]/10 shadow-sm space-y-6">
              {/* Post Meta & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1A2E1A]/10">
                <div className="flex items-center gap-3">
                  <img
                    src={currentPost.authorAvatar}
                    alt={currentPost.authorName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#2D6A4F]/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#1A2E1A] font-display">
                        {currentPost.authorName}
                      </span>
                      {currentPost.authorRole === "doctor" ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#1A2E1A] text-[#D8F3DC] text-[10px] font-black uppercase tracking-wider">
                          Dra. Nutricionista
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#D8F3DC] text-[#1A2E1A] text-[10px] font-black uppercase tracking-wider">
                          Paciente
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#1A2E1A]/60 font-semibold">
                      <span>@{currentPost.authorUsername}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {currentPost.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#F4F7F2] border border-[#1A2E1A]/10 text-xs font-black uppercase tracking-wider text-[#2D6A4F]">
                    {currentPost.categoryLabel}
                  </span>

                  {currentPost.isPinned && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider">
                      <Pin className="w-3 h-3 text-amber-700" />
                      Fixado
                    </span>
                  )}

                  {currentPost.isLocked && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-xs font-black uppercase tracking-wider">
                      <Lock className="w-3 h-3 text-rose-700" />
                      Fechado
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-black font-display text-[#1A2E1A] leading-tight">
                  {currentPost.title}
                </h2>
                <p className="text-sm text-[#1A2E1A]/90 leading-relaxed whitespace-pre-line font-medium">
                  {currentPost.content}
                </p>
              </div>

              {/* Tags */}
              {currentPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {currentPost.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F4F7F2] text-[#1A2E1A]/70 text-[11px] font-bold"
                    >
                      <Tag className="w-3 h-3 text-[#2D6A4F]" />
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions & Moderation Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1A2E1A]/10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleLikePost(currentPost.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                      currentPost.isLiked
                        ? "bg-rose-50 text-rose-600 border border-rose-200 shadow-xs"
                        : "bg-[#F4F7F2] text-[#1A2E1A]/80 hover:bg-[#D8F3DC]/40 border border-[#1A2E1A]/10"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${currentPost.isLiked ? "fill-rose-600 text-rose-600" : ""}`} />
                    <span>{currentPost.likesCount} Curtidas</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A2E1A]/60 px-3 py-2">
                    <MessageSquare className="w-4 h-4 text-[#2D6A4F]" />
                    <span>{currentPost.replies.length} Respostas</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A2E1A]/60 px-3 py-2">
                    <Eye className="w-4 h-4 text-[#2D6A4F]" />
                    <span>{currentPost.viewsCount} Visualizações</span>
                  </div>
                </div>

                {/* Administrator Moderation Actions */}
                {currentUser.role === "doctor" && (
                  <div className="flex items-center gap-2">
                    {onTogglePinPost && (
                      <button
                        onClick={() => onTogglePinPost(currentPost.id)}
                        className={`p-2 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                          currentPost.isPinned
                            ? "bg-amber-100 border-amber-300 text-amber-900"
                            : "bg-[#F4F7F2] border-[#1A2E1A]/15 text-[#1A2E1A] hover:bg-amber-50"
                        }`}
                        title={currentPost.isPinned ? "Desafixar tópico" : "Fixar tópico no topo"}
                      >
                        <Pin className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{currentPost.isPinned ? "Desafixar" : "Fixar"}</span>
                      </button>
                    )}

                    {onToggleLockPost && (
                      <button
                        onClick={() => onToggleLockPost(currentPost.id)}
                        className={`p-2 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                          currentPost.isLocked
                            ? "bg-rose-100 border-rose-300 text-rose-900"
                            : "bg-[#F4F7F2] border-[#1A2E1A]/15 text-[#1A2E1A] hover:bg-rose-50"
                        }`}
                        title={currentPost.isLocked ? "Destrancar tópico" : "Trancar tópico"}
                      >
                        {currentPost.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{currentPost.isLocked ? "Destrancar" : "Trancar"}</span>
                      </button>
                    )}

                    {onDeletePost && (
                      <button
                        onClick={() => {
                          if (window.confirm("Deseja realmente excluir este tópico da comunidade?")) {
                            onDeletePost(currentPost.id);
                            setSelectedPost(null);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                        title="Excluir tópico inapropriado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Excluir</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Replies Thread Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-[#1A2E1A] font-display flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#2D6A4F]" />
                <span>Discussão e Respostas ({currentPost?.replies.length || 0})</span>
              </h3>
            </div>

            {/* Replies List */}
            {currentPost && currentPost.replies.length > 0 ? (
              <div className="space-y-4">
                {currentPost.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`rounded-3xl p-5 sm:p-6 transition-all ${
                      reply.isOfficialDoctorReply
                        ? "bg-[#1A2E1A] text-white border-2 border-[#52B788] shadow-lg shadow-[#1A2E1A]/10"
                        : "bg-white text-[#1A2E1A] border border-[#1A2E1A]/10 shadow-xs"
                    }`}
                  >
                    {/* Reply Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-current/10">
                      <div className="flex items-center gap-3">
                        <img
                          src={reply.authorAvatar}
                          alt={reply.authorName}
                          className={`w-10 h-10 rounded-2xl object-cover ${
                            reply.isOfficialDoctorReply ? "ring-2 ring-[#52B788]" : "ring-1 ring-[#1A2E1A]/20"
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs sm:text-sm font-display">
                              {reply.authorName}
                            </span>
                            {reply.isOfficialDoctorReply && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#52B788] text-[#1A2E1A] text-[10px] font-black uppercase tracking-wider">
                                <Award className="w-3 h-3" /> Resposta Oficial da Dra. Ana Cária 💚
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] font-semibold ${reply.isOfficialDoctorReply ? "text-[#D8F3DC]/70" : "text-[#1A2E1A]/60"}`}>
                            @{reply.authorUsername} • {reply.createdAt}
                          </p>
                        </div>
                      </div>

                      {/* Delete reply for admin or author */}
                      {(currentUser.role === "doctor" || currentUser.id === reply.authorId) && onDeleteReply && (
                        <button
                          onClick={() => {
                            if (window.confirm("Excluir esta resposta?")) {
                              onDeleteReply(currentPost.id, reply.id);
                            }
                          }}
                          className={`p-1.5 rounded-xl text-xs transition-colors ${
                            reply.isOfficialDoctorReply ? "text-[#D8F3DC]/60 hover:text-white" : "text-[#1A2E1A]/40 hover:text-rose-600"
                          }`}
                          title="Excluir resposta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Reply Content */}
                    <p className={`text-xs sm:text-sm mt-3 leading-relaxed font-medium ${reply.isOfficialDoctorReply ? "text-[#D8F3DC]/95" : "text-[#1A2E1A]/90"}`}>
                      {reply.content}
                    </p>

                    {/* Like Reply */}
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={() => onToggleLikeReply(currentPost.id, reply.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                          reply.isLiked
                            ? reply.isOfficialDoctorReply
                              ? "bg-[#52B788] text-[#1A2E1A]"
                              : "bg-rose-50 text-rose-600 border border-rose-200"
                            : reply.isOfficialDoctorReply
                            ? "bg-white/10 hover:bg-white/20 text-[#D8F3DC]"
                            : "bg-[#F4F7F2] hover:bg-[#D8F3DC]/50 text-[#1A2E1A]/80 border border-[#1A2E1A]/10"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${reply.isLiked ? "fill-current" : ""}`} />
                        <span>{reply.likesCount}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#1A2E1A]/10 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-[#2D6A4F]/50" />
                <p className="font-black text-sm text-[#1A2E1A] font-display">Ainda não há respostas para esta pergunta.</p>
                <p className="text-xs text-[#1A2E1A]/60 font-medium">Seja o primeiro a responder ou aguarde o parecer da Dra. Ana!</p>
              </div>
            )}

            {/* Reply Input Form */}
            {!currentPost?.isLocked ? (
              <div className="bg-white rounded-3xl p-6 border border-[#1A2E1A]/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1A2E1A] flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#2D6A4F]" />
                    Escrever Resposta como {currentUser.name}
                  </span>

                  {currentUser.role === "doctor" && (
                    <label className="flex items-center gap-2 cursor-pointer bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 text-xs font-black text-emerald-900">
                      <input
                        type="checkbox"
                        checked={isDoctorOfficial}
                        onChange={(e) => setIsDoctorOfficial(e.target.checked)}
                        className="rounded text-[#2D6A4F] focus:ring-[#2D6A4F]"
                      />
                      <span>Selo de Resposta Clínica Oficial 💚</span>
                    </label>
                  )}
                </div>

                {/* Quick Prompts for Dra. Ana */}
                {currentUser.role === "doctor" && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#1A2E1A]/60 self-center">Sugestões Rápidas:</span>
                    <button
                      type="button"
                      onClick={() => loadReplyTemplate("Olá! Ótima dúvida. Para pacientes com diabetes, o segredo é sempre associar fibras e proteínas para baixar a carga glicêmica.")}
                      className="px-2.5 py-1 rounded-xl bg-[#F4F7F2] hover:bg-[#D8F3DC] text-[11px] font-bold text-[#1A2E1A] transition-colors"
                    >
                      ⚡ Regra da Carga Glicêmica
                    </button>
                    <button
                      type="button"
                      onClick={() => loadReplyTemplate("Sempre verifique o rótulo: se tiver maltodextrina, xarope de glicose ou açúcar nos 3 primeiros ingredientes, evite!")}
                      className="px-2.5 py-1 rounded-xl bg-[#F4F7F2] hover:bg-[#D8F3DC] text-[11px] font-bold text-[#1A2E1A] transition-colors"
                    >
                      ⚡ Dica de Rótulo
                    </button>
                    <button
                      type="button"
                      onClick={() => loadReplyTemplate("Consulte também o seu médico para ajustar as dosagens caso esteja fazendo medições glicêmicas alteradas.")}
                      className="px-2.5 py-1 rounded-xl bg-[#F4F7F2] hover:bg-[#D8F3DC] text-[11px] font-bold text-[#1A2E1A] transition-colors"
                    >
                      ⚡ Alerta Clínico
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendReply} className="space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={
                      currentUser.role === "doctor"
                        ? "Digite sua orientação clínica detalhada para o paciente..."
                        : "Escreva sua mensagem, experiência ou dica construtiva..."
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-xs text-[#1A2E1A] font-medium placeholder-[#1A2E1A]/40 focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20 leading-relaxed"
                    required
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-6 py-3 rounded-2xl bg-[#2D6A4F] hover:bg-[#1A2E1A] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#2D6A4F]/20 transition-all hover:scale-102"
                    >
                      <Send className="w-4 h-4" />
                      <span>Publicar Resposta</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-600" />
                <span>Este tópico foi encerrado para novas respostas pela moderação da Dra. Ana.</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Forum Posts Feed & Category Filters */
        <div className="space-y-6">
          {/* Search and Filter Row */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#1A2E1A]/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A2E1A]/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar por assunto, dúvida, alimento, @usuário ou #tag..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-xs text-[#1A2E1A] font-semibold placeholder-[#1A2E1A]/40 focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A2E1A]/40 hover:text-[#1A2E1A]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sub-filter tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    activeFilter === "all"
                      ? "bg-[#1A2E1A] text-white shadow-xs"
                      : "bg-[#F4F7F2] text-[#1A2E1A]/80 hover:bg-[#D8F3DC]/40 border border-[#1A2E1A]/10"
                  }`}
                >
                  Todos ({posts.length})
                </button>
                <button
                  onClick={() => setActiveFilter("doctor_answered")}
                  className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeFilter === "doctor_answered"
                      ? "bg-[#2D6A4F] text-white shadow-xs"
                      : "bg-[#F4F7F2] text-[#1A2E1A]/80 hover:bg-[#D8F3DC]/40 border border-[#1A2E1A]/10"
                  }`}
                >
                  <span>💚 Respondidos pela Dra.</span>
                </button>
                <button
                  onClick={() => setActiveFilter("popular")}
                  className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeFilter === "popular"
                      ? "bg-[#1A2E1A] text-white shadow-xs"
                      : "bg-[#F4F7F2] text-[#1A2E1A]/80 hover:bg-[#D8F3DC]/40 border border-[#1A2E1A]/10"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Em Alta</span>
                </button>
                <button
                  onClick={() => setActiveFilter("my_posts")}
                  className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    activeFilter === "my_posts"
                      ? "bg-[#1A2E1A] text-white shadow-xs"
                      : "bg-[#F4F7F2] text-[#1A2E1A]/80 hover:bg-[#D8F3DC]/40 border border-[#1A2E1A]/10"
                  }`}
                >
                  Meus Tópicos
                </button>
              </div>
            </div>

            {/* Category Badges Scroll */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORY_ITEMS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    selectedCategory === cat.id
                      ? "bg-[#2D6A4F] text-white shadow-sm"
                      : "bg-[#F4F7F2] text-[#1A2E1A]/80 hover:bg-[#D8F3DC]/50 border border-[#1A2E1A]/10"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Posts Cards Grid / List */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`group bg-white rounded-3xl p-6 border transition-all cursor-pointer hover:shadow-md hover:scale-[1.008] space-y-4 ${
                    post.isPinned
                      ? "border-amber-300 bg-linear-to-r from-amber-50/30 to-white"
                      : "border-[#1A2E1A]/10"
                  }`}
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-2xl object-cover ring-1 ring-[#1A2E1A]/15"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs sm:text-sm text-[#1A2E1A] font-display">
                            {post.authorName}
                          </span>
                          {post.authorRole === "doctor" ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#1A2E1A] text-[#D8F3DC] text-[9px] font-black uppercase tracking-wider">
                              Dra. Nutricionista
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#1A2E1A]/50 font-semibold">
                              @{post.authorUsername}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#1A2E1A]/50 font-semibold block">
                          {post.createdAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {post.isPinned && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider">
                          <Pin className="w-3 h-3 text-amber-700" />
                          Fixado
                        </span>
                      )}

                      <span className="px-2.5 py-1 rounded-xl bg-[#F4F7F2] text-[#2D6A4F] text-[10px] font-black uppercase tracking-wider border border-[#1A2E1A]/10">
                        {post.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Title & Preview Content */}
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-black font-display text-[#1A2E1A] group-hover:text-[#2D6A4F] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#1A2E1A]/70 line-clamp-2 font-medium leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-[#F4F7F2] text-[#1A2E1A]/60 text-[10px] font-bold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Meta & Doctor Reply Indicator */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#1A2E1A]/10 text-xs">
                    <div className="flex items-center gap-4 text-[#1A2E1A]/70 font-bold">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500" /> {post.likesCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-[#2D6A4F]" /> {post.replies.length} respostas
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" /> {post.viewsCount} visualizações
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {post.hasDoctorReply && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#D8F3DC] text-[#1A2E1A] text-[10px] font-black uppercase tracking-wider border border-[#2D6A4F]/30">
                          <CheckCircle2 className="w-3 h-3 text-[#2D6A4F]" />
                          Respondido pela Dra. Ana
                        </span>
                      )}

                      <span className="text-[#2D6A4F] group-hover:translate-x-1 transition-transform inline-flex items-center">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#1A2E1A]/10 space-y-4">
                <MessageSquare className="w-12 h-12 mx-auto text-[#2D6A4F]/40" />
                <h3 className="text-lg font-black text-[#1A2E1A] font-display">Nenhum tópico encontrado</h3>
                <p className="text-xs text-[#1A2E1A]/60 max-w-md mx-auto font-medium">
                  Não encontramos perguntas com estes filtros. Que tal ser o primeiro a abrir um tópico sobre este assunto?
                </p>
                <button
                  onClick={() => setIsNewPostModalOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-[#2D6A4F] hover:bg-[#1A2E1A] text-white font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Criar Nova Pergunta</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create New Post Modal */}
      {isNewPostModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setIsNewPostModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl border border-[#1A2E1A]/10 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1A2E1A]/10 pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#2D6A4F]" />
                <h2 className="text-lg font-black text-[#1A2E1A] font-display">
                  Fazer Nova Pergunta na Comunidade
                </h2>
              </div>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-2 rounded-2xl text-[#1A2E1A]/40 hover:text-[#1A2E1A] bg-[#F4F7F2]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              {/* Category Select */}
              <div>
                <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
                  Categoria do Assunto
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ForumCategory)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-bold"
                >
                  <option value="diabetes">🩸 Diabetes & Controle Glicêmico</option>
                  <option value="hipertensao">🫀 Hipertensão & Redução de Sódio</option>
                  <option value="emagrecimento">🥗 Emagrecimento & Saciedade</option>
                  <option value="duvidas_pratos">🍽️ Dúvidas de Cardápio & Prato</option>
                  <option value="receitas">🍳 Receitas & Dicas Culinárias</option>
                  <option value="exames_suplementos">💊 Exames, Vitaminas & Suplementos</option>
                  {currentUser.role === "doctor" && (
                    <option value="avisos">📢 Comunicado Oficial da Dra. Ana</option>
                  )}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
                  Título da Dúvida / Assunto
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Posso comer cuscuz de milho no café sem subir a glicose?"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
                  Explique com detalhes a sua situação ou dúvida
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Conte seus sintomas, como prepara o alimento, horários em que costuma comer ou o que você gostaria de saber..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-medium leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20"
                  required
                />
              </div>

              {/* Tags Input */}
              <div>
                <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
                  Tags (Separadas por vírgula ou espaço)
                </label>
                <input
                  type="text"
                  value={newTagsInput}
                  onChange={(e) => setNewTagsInput(e.target.value)}
                  placeholder="Ex: Cuscuz, CafeDaManha, Glicemia, Fibras"
                  className="w-full px-3.5 py-2 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-semibold"
                />
              </div>

              {/* Author Preview Card */}
              <div className="p-3 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10 flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[11px] font-black text-[#1A2E1A] block">
                    Publicando como: {currentUser.name} (@{currentUser.username})
                  </span>
                  <span className="text-[10px] text-[#2D6A4F] font-bold">
                    {currentUser.role === "doctor" ? "Perfil Oficial de Nutricionista" : "Perfil de Paciente"}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#2D6A4F] hover:bg-[#1A2E1A] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#2D6A4F]/20 transition-all hover:scale-101"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Pergunta no Fórum</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
