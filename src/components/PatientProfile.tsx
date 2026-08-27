import React, { useState } from "react";
import {
  User,
  Bookmark,
  Download,
  Camera,
  Edit3,
  Heart,
  MessageSquare,
  UtensilsCrossed,
  CheckCircle2,
  Sparkles,
  Award,
  Calendar,
  Save,
  Trash2,
  ExternalLink,
  Shield,
  Activity,
  Apple,
  Clock,
  ChevronRight,
  Upload,
} from "lucide-react";
import { UserProfile, VideoItem, FoodItem, MealPlateReview, ForumPost } from "../types";

interface PatientProfileProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  videos: VideoItem[];
  foods: FoodItem[];
  mealReviews: MealPlateReview[];
  forumPosts: ForumPost[];
  onSelectVideo: (videoId: string) => void;
  onSelectForumPost: (postId: string) => void;
  onToggleSaveVideo: (videoId: string) => void;
  onToggleSaveFood: (foodId: string) => void;
}

const HEALTH_CONDITION_OPTIONS = [
  "Diabetes Tipo 2",
  "Pré-diabetes / Resistência Insulínica",
  "Hipertensão Arterial (Pressão Alta)",
  "Gordura no Fígado (Esteatose Hepática)",
  "Colesterol / Triglicerídeos Altos",
  "Emagrecimento / Perda de Gordura",
  "Ganho de Massa Muscular",
  "Saúde Intestinal / Digestão",
];

const DIETARY_OPTIONS = [
  "Sem Açúcar Refinado",
  "Baixo Sódio / Sal Controlado",
  "Rico em Fibras",
  "Low Carb Moderado",
  "Sem Glúten",
  "Sem Lactose",
  "Vegetariano / Plant-based",
  "Comida de Verdade 100%",
];

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
];

export const PatientProfile: React.FC<PatientProfileProps> = ({
  currentUser,
  onUpdateProfile,
  videos,
  foods,
  mealReviews,
  forumPosts,
  onSelectVideo,
  onSelectForumPost,
  onToggleSaveVideo,
  onToggleSaveFood,
}) => {
  const [activeTab, setActiveTab] = useState<"saved_videos" | "saved_foods" | "forum_activity" | "meal_reviews" | "edit_profile">("saved_videos");

  // Edit profile state
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    currentUser.healthConditions || ["Pré-diabetes", "Hipertensão Leve"]
  );
  const [selectedDietary, setSelectedDietary] = useState<string[]>(
    currentUser.dietaryPreferences || ["Sem Açúcar Refinado", "Baixo Sódio"]
  );
  const [saveMessage, setSaveMessage] = useState(false);

  // Derived user activity items
  const savedVideos = videos.filter((v) => currentUser.savedVideoIds.includes(v.id));
  const savedFoods = foods.filter((f) => currentUser.savedFoodIds.includes(f.id));
  const myReviews = mealReviews.filter(
    (r) => r.patientName.toLowerCase() === currentUser.name.toLowerCase() || r.patientName.toLowerCase() === "maria silva"
  );
  const myForumQuestions = forumPosts.filter(
    (p) => p.authorId === currentUser.id || p.authorUsername === currentUser.username
  );
  const myForumReplies = forumPosts.flatMap((p) =>
    p.replies
      .filter((r) => r.authorId === currentUser.id || r.authorUsername === currentUser.username)
      .map((r) => ({ ...r, postTitle: p.title, postCategory: p.categoryLabel }))
  );

  // Handle custom photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setAvatar(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleCondition = (cond: string) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const handleToggleDietary = (item: string) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.replace(/^@/, "").trim().toLowerCase();

    onUpdateProfile({
      name: name.trim(),
      username: cleanUsername,
      bio: bio.trim(),
      avatar: avatar,
      healthConditions: selectedConditions,
      dietaryPreferences: selectedDietary,
      specialtyOrGoal: `Foco: ${selectedConditions.join(", ")}`,
    });

    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 animate-fadeIn">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A2E1A]/10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar with edit overlay */}
          <div className="relative group">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-[#2D6A4F]/20 shadow-lg"
            />
            <button
              onClick={() => setActiveTab("edit_profile")}
              className="absolute bottom-1 right-1 bg-[#1A2E1A] text-white p-2 rounded-2xl shadow-md hover:bg-[#2D6A4F] transition-colors"
              title="Trocar Foto de Perfil"
            >
              <Camera className="w-4 h-4 text-[#D8F3DC]" />
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1A2E1A] font-display">
                {currentUser.name}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#D8F3DC] text-[#1A2E1A] border border-[#2D6A4F]/30">
                @{currentUser.username || "paciente"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F4F7F2] text-[#2D6A4F] border border-[#1A2E1A]/10">
                Paciente Cadastrado 💚
              </span>
            </div>

            <p className="text-xs text-[#1A2E1A]/80 max-w-2xl leading-relaxed font-medium">
              {currentUser.bio || "Em acompanhamento nutricional e aprendendo a comer com equilíbrio sem restrições exageradas."}
            </p>

            {/* Health Conditions & Preferences Tags */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
              {currentUser.healthConditions?.map((cond, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-[#F4F7F2] border border-[#1A2E1A]/10 text-[11px] font-bold text-[#1A2E1A]"
                >
                  🎯 {cond}
                </span>
              ))}
              {currentUser.dietaryPreferences?.map((diet, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-[#D8F3DC]/40 border border-[#2D6A4F]/20 text-[11px] font-bold text-[#2D6A4F]"
                >
                  🥗 {diet}
                </span>
              ))}
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3 text-xs">
              <div className="px-3.5 py-2 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10">
                <span className="font-black text-[#1A2E1A] text-sm">{savedVideos.length}</span>{" "}
                <span className="text-[#1A2E1A]/60 font-bold uppercase text-[10px] tracking-wider">Vídeos Salvos</span>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10">
                <span className="font-black text-[#1A2E1A] text-sm">{savedFoods.length}</span>{" "}
                <span className="text-[#1A2E1A]/60 font-bold uppercase text-[10px] tracking-wider">Alimentos Salvos</span>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10">
                <span className="font-black text-[#1A2E1A] text-sm">{myForumQuestions.length + myForumReplies.length}</span>{" "}
                <span className="text-[#1A2E1A]/60 font-bold uppercase text-[10px] tracking-wider">Interações no Fórum</span>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10">
                <span className="font-black text-[#1A2E1A] text-sm">{myReviews.length}</span>{" "}
                <span className="text-[#1A2E1A]/60 font-bold uppercase text-[10px] tracking-wider">Pratos Avaliados</span>
              </div>
            </div>
          </div>

          {/* Edit Profile Action Button */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("edit_profile")}
              className="px-5 py-2.5 rounded-2xl bg-[#1A2E1A] hover:bg-[#2D6A4F] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Edit3 className="w-4 h-4 text-[#D8F3DC]" />
              <span>Editar Meu Perfil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#1A2E1A]/10 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("saved_videos")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "saved_videos"
              ? "bg-[#2D6A4F] text-white shadow-xs"
              : "text-[#1A2E1A]/70 hover:bg-[#F4F7F2]"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Vídeos Favoritos ({savedVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("saved_foods")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "saved_foods"
              ? "bg-[#2D6A4F] text-white shadow-xs"
              : "text-[#1A2E1A]/70 hover:bg-[#F4F7F2]"
          }`}
        >
          <Apple className="w-3.5 h-3.5" />
          <span>Alimentos Salvos ({savedFoods.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("forum_activity")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "forum_activity"
              ? "bg-[#2D6A4F] text-white shadow-xs"
              : "text-[#1A2E1A]/70 hover:bg-[#F4F7F2]"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Minhas Dúvidas no Fórum ({myForumQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("meal_reviews")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "meal_reviews"
              ? "bg-[#2D6A4F] text-white shadow-xs"
              : "text-[#1A2E1A]/70 hover:bg-[#F4F7F2]"
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Meus Pratos ({myReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("edit_profile")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "edit_profile"
              ? "bg-[#1A2E1A] text-white shadow-xs"
              : "text-[#1A2E1A]/70 hover:bg-[#F4F7F2]"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span>Configurações & Saúde</span>
        </button>
      </div>

      {/* Tab Content 1: Saved Videos */}
      {activeTab === "saved_videos" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#1A2E1A] font-display">
              Vídeos e Dicas Salvos para Rever
            </h2>
            <span className="text-xs text-[#1A2E1A]/60 font-bold uppercase tracking-wider">
              {savedVideos.length} vídeos favoritados
            </span>
          </div>

          {savedVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#1A2E1A]/10 shadow-xs hover:shadow-md transition-all group"
                >
                  <div
                    onClick={() => onSelectVideo(video.id)}
                    className="relative aspect-video bg-[#1A2E1A] cursor-pointer overflow-hidden"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#52B788] text-black">
                        {video.categoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3
                      onClick={() => onSelectVideo(video.id)}
                      className="font-black text-sm text-[#1A2E1A] line-clamp-2 cursor-pointer hover:text-[#2D6A4F] transition-colors"
                    >
                      {video.title}
                    </h3>
                    <p className="text-xs text-[#1A2E1A]/60 line-clamp-2 font-medium">
                      {video.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1A2E1A]/10 text-xs">
                      <button
                        onClick={() => onSelectVideo(video.id)}
                        className="text-[#2D6A4F] font-black uppercase tracking-wider text-[11px] hover:underline"
                      >
                        Assistir Vídeo →
                      </button>

                      <button
                        onClick={() => onToggleSaveVideo(video.id)}
                        className="text-rose-600 hover:text-rose-700 p-1 font-bold text-xs"
                        title="Remover dos favoritos"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#1A2E1A]/10 space-y-3">
              <Bookmark className="w-10 h-10 mx-auto text-[#2D6A4F]/40" />
              <p className="font-black text-base text-[#1A2E1A] font-display">Nenhum vídeo salvo ainda</p>
              <p className="text-xs text-[#1A2E1A]/60 max-w-sm mx-auto font-medium">
                Navegue pelo feed de vídeos e clique no ícone de salvar para criar a sua biblioteca de orientações rápidas!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Saved Foods */}
      {activeTab === "saved_foods" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#1A2E1A] font-display">
              Alimentos Favoritos da Biblioteca "Pode ou Não Pode"
            </h2>
            <span className="text-xs text-[#1A2E1A]/60 font-bold uppercase tracking-wider">
              {savedFoods.length} alimentos marcados
            </span>
          </div>

          {savedFoods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedFoods.map((food) => (
                <div
                  key={food.id}
                  className="bg-white rounded-3xl p-5 border border-[#1A2E1A]/10 shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-[#1A2E1A]/10"
                      />
                      <div>
                        <h3 className="font-black text-sm text-[#1A2E1A] font-display">{food.name}</h3>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            food.status === "pode"
                              ? "bg-[#D8F3DC] text-[#1A2E1A]"
                              : food.status === "moderacao"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-rose-100 text-rose-900"
                          }`}
                        >
                          {food.status === "pode"
                            ? "✓ Liberado / Recomendado"
                            : food.status === "moderacao"
                            ? "⚠️ Consumo com Moderação"
                            : "✕ Evitar / Reduzir"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleSaveFood(food.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Remover alimento salvo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#1A2E1A]/70 line-clamp-2 font-medium">
                    {food.summaryReason}
                  </p>

                  <div className="p-3 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10 text-xs text-[#1A2E1A] font-bold">
                    💚 {food.draTip}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#1A2E1A]/10 space-y-3">
              <Apple className="w-10 h-10 mx-auto text-[#2D6A4F]/40" />
              <p className="font-black text-base text-[#1A2E1A] font-display">Nenhum alimento salvo</p>
              <p className="text-xs text-[#1A2E1A]/60 max-w-sm mx-auto font-medium">
                Acesse a aba "Pode ou Não Pode" e salve os alimentos do seu dia a dia para consultar rápido suas propriedades glicêmicas.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Forum Activity */}
      {activeTab === "forum_activity" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#1A2E1A] font-display">
              Minhas Perguntas e Interações na Comunidade
            </h2>
          </div>

          {/* User's Created Posts */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#1A2E1A] uppercase tracking-wider">
              Dúvidas que perguntei ({myForumQuestions.length})
            </h3>

            {myForumQuestions.length > 0 ? (
              <div className="space-y-3">
                {myForumQuestions.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onSelectForumPost(post.id)}
                    className="p-5 bg-white rounded-3xl border border-[#1A2E1A]/10 hover:border-[#2D6A4F]/40 shadow-xs cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-xl bg-[#F4F7F2] text-[#2D6A4F] text-[10px] font-black uppercase tracking-wider border border-[#1A2E1A]/10">
                        {post.categoryLabel}
                      </span>
                      <span className="text-[11px] text-[#1A2E1A]/60 font-semibold">{post.createdAt}</span>
                    </div>
                    <h4 className="font-black text-sm text-[#1A2E1A] font-display">{post.title}</h4>
                    <p className="text-xs text-[#1A2E1A]/70 line-clamp-2 font-medium">{post.content}</p>

                    <div className="flex items-center justify-between pt-2 text-xs font-bold text-[#1A2E1A]/60">
                      <div className="flex items-center gap-3">
                        <span>❤️ {post.likesCount} curtidas</span>
                        <span>💬 {post.replies.length} respostas</span>
                      </div>
                      {post.hasDoctorReply && (
                        <span className="text-[#2D6A4F] font-black uppercase text-[10px] tracking-wider">
                          ✓ Respondido pela Dra. Ana
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white rounded-2xl border border-[#1A2E1A]/10 text-center text-xs text-[#1A2E1A]/60 font-medium">
                Você ainda não criou nenhum tópico. Vá na aba <strong>Comunidade</strong> para fazer uma pergunta!
              </div>
            )}
          </div>

          {/* User's Replies in Forum */}
          {myForumReplies.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#1A2E1A]/10">
              <h3 className="text-xs font-black text-[#1A2E1A] uppercase tracking-wider">
                Minhas Respostas em Outros Tópicos ({myForumReplies.length})
              </h3>
              <div className="space-y-3">
                {myForumReplies.map((reply) => (
                  <div
                    key={reply.id}
                    onClick={() => onSelectForumPost(reply.postId)}
                    className="p-4 bg-white rounded-2xl border border-[#1A2E1A]/10 shadow-xs cursor-pointer hover:border-[#2D6A4F]/40 space-y-1.5"
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#2D6A4F]">
                      No tópico: "{reply.postTitle}"
                    </span>
                    <p className="text-xs text-[#1A2E1A] font-medium">"{reply.content}"</p>
                    <div className="flex items-center justify-between text-[10px] text-[#1A2E1A]/60 font-semibold">
                      <span>{reply.createdAt}</span>
                      <span>❤️ {reply.likesCount} curtidas</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Meal Reviews History */}
      {activeTab === "meal_reviews" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#1A2E1A] font-display">
              Meus Pratos e Refeições Avaliados
            </h2>
            <span className="text-xs text-[#1A2E1A]/60 font-bold uppercase tracking-wider">
              {myReviews.length} avaliações registradas
            </span>
          </div>

          {myReviews.length > 0 ? (
            <div className="space-y-4">
              {myReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-6 border border-[#1A2E1A]/10 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#1A2E1A]/10">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full bg-[#D8F3DC] text-[#1A2E1A] text-xs font-black uppercase tracking-wider border border-[#2D6A4F]/20">
                        {rev.mealType}
                      </span>
                      <span className="text-xs text-[#1A2E1A]/60 font-bold">{rev.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-[#D8F3DC] text-[#1A2E1A] font-black text-sm border border-[#2D6A4F]/20">
                      <span className="text-xs uppercase tracking-wider">Nota:</span>
                      <span className="text-[#2D6A4F] text-base">{rev.score}/10</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-black text-[#1A2E1A] uppercase tracking-wider">Alimentos do Prato:</span>
                    <p className="text-xs text-[#1A2E1A]/80 font-medium leading-relaxed">{rev.mealDescription}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10 text-xs space-y-1">
                    <span className="font-black text-[#1A2E1A] block">Resumo do Impacto Nutricional:</span>
                    <p className="text-[#1A2E1A]/80 font-medium">{rev.summary}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1A2E1A] text-white border border-[#2D6A4F]/40 space-y-1">
                    <span className="text-[11px] font-black text-[#D8F3DC] block uppercase tracking-wider">
                      Dica de Ouro da Dra. Ana Cária 💚
                    </span>
                    <p className="text-xs leading-relaxed text-[#D8F3DC]/90 font-medium">"{rev.draTip}"</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#1A2E1A]/10 space-y-3">
              <UtensilsCrossed className="w-10 h-10 mx-auto text-[#2D6A4F]/40" />
              <p className="font-black text-base text-[#1A2E1A] font-display">Nenhuma refeição enviada ainda</p>
              <p className="text-xs text-[#1A2E1A]/60 max-w-sm mx-auto font-medium">
                Envie o que você está comendo na aba "Avaliar Prato" para receber nota nutricional e dicas personalizadas da Dra. Ana Cária.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 5: Edit Profile & Health Focus Form */}
      {activeTab === "edit_profile" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A2E1A]/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#1A2E1A]/10 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#1A2E1A] font-display">
                Editar Dados do Meu Perfil & Foco de Saúde
              </h2>
              <p className="text-xs text-[#2D6A4F] font-bold">
                Personalize seu nome de usuário, foto e metas para recomendações mais precisas
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
            {/* Profile Picture Chooser / Uploader */}
            <div className="space-y-3">
              <label className="block font-black text-[#1A2E1A] uppercase tracking-wider">
                Foto de Perfil
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={avatar}
                  alt="Prévia Avatar"
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-[#2D6A4F]/20 shadow-md shrink-0"
                />

                <div className="space-y-3 flex-1 w-full">
                  <div>
                    <span className="text-[11px] font-bold text-[#1A2E1A]/70 block mb-1.5">
                      Fazer Upload de Foto do Dispositivo:
                    </span>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F4F7F2] hover:bg-[#D8F3DC]/60 border border-[#1A2E1A]/15 font-black text-xs uppercase tracking-wider text-[#1A2E1A] cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-[#2D6A4F]" />
                      <span>Escolher Imagem / Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#1A2E1A]/70 block mb-1.5">
                      Ou Escolha um Avatar Pré-definido:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {AVATAR_PRESETS.map((p, i) => (
                        <img
                          key={i}
                          src={p}
                          alt={`Preset ${i}`}
                          onClick={() => setAvatar(p)}
                          className={`w-10 h-10 rounded-xl object-cover cursor-pointer transition-all ${
                            avatar === p ? "ring-3 ring-[#2D6A4F] scale-105" : "opacity-60 hover:opacity-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Name & Username Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20"
                  required
                />
              </div>

              <div>
                <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
                  Nome de Usuário (@username)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A2E1A]/40 font-bold">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ""))}
                    placeholder="mariasilva"
                    className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
                Sobre Você / Biografia Curta
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ex: Em jornada de reeducação alimentar para reverter pré-diabetes..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-medium leading-relaxed"
              />
            </div>

            {/* Health Conditions Checkboxes */}
            <div className="space-y-2">
              <label className="block font-black text-[#1A2E1A] uppercase tracking-wider">
                Suas Condições de Saúde / Foco Principal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HEALTH_CONDITION_OPTIONS.map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => handleToggleCondition(cond)}
                    className={`p-3 rounded-2xl border text-left font-bold transition-all flex items-center justify-between ${
                      selectedConditions.includes(cond)
                        ? "bg-[#D8F3DC] border-[#2D6A4F] text-[#1A2E1A]"
                        : "bg-[#F4F7F2] border-[#1A2E1A]/10 text-[#1A2E1A]/70 hover:bg-white"
                    }`}
                  >
                    <span>{cond}</span>
                    <span className="text-xs font-black">
                      {selectedConditions.includes(cond) ? "✓" : "+"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preferences Checkboxes */}
            <div className="space-y-2">
              <label className="block font-black text-[#1A2E1A] uppercase tracking-wider">
                Preferências Alimentares
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DIETARY_OPTIONS.map((diet) => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => handleToggleDietary(diet)}
                    className={`p-3 rounded-2xl border text-left font-bold transition-all flex items-center justify-between ${
                      selectedDietary.includes(diet)
                        ? "bg-[#D8F3DC] border-[#2D6A4F] text-[#1A2E1A]"
                        : "bg-[#F4F7F2] border-[#1A2E1A]/10 text-[#1A2E1A]/70 hover:bg-white"
                    }`}
                  >
                    <span>{diet}</span>
                    <span className="text-xs font-black">
                      {selectedDietary.includes(diet) ? "✓" : "+"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#2D6A4F] hover:bg-[#1A2E1A] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#2D6A4F]/20 transition-all hover:scale-101"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações do Perfil</span>
              </button>

              {saveMessage && (
                <div className="mt-3 p-3 rounded-2xl bg-[#D8F3DC] border border-[#2D6A4F]/40 text-[#1A2E1A] text-xs font-black flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                  <span>Perfil atualizado com sucesso!</span>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
