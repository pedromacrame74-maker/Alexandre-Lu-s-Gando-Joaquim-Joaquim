import React, { useState } from "react";
import {
  User,
  Award,
  Stethoscope,
  Heart,
  Calendar,
  Phone,
  Video,
  Bookmark,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { UserProfile, VideoItem, FoodItem } from "../types";

interface DoctorProfileProps {
  currentUser: UserProfile;
  videos: VideoItem[];
  foods: FoodItem[];
  onOpenUpload: () => void;
  onOpenScriptGenerator: () => void;
  onSelectVideo: (videoId: string) => void;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({
  currentUser,
  videos,
  foods,
  onOpenUpload,
  onOpenScriptGenerator,
  onSelectVideo,
}) => {
  const [profileTab, setProfileTab] = useState<"bio" | "saved_videos" | "saved_foods" | "offline">("bio");
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const savedVideos = videos.filter((v) => currentUser.savedVideoIds.includes(v.id));
  const savedFoods = foods.filter((f) => currentUser.savedFoodIds.includes(f.id));
  const offlineVideos = videos.filter((v) => currentUser.offlineVideoIds.includes(v.id));

  const handleRequestConsultation = () => {
    setScheduleSuccess(true);
    setTimeout(() => setScheduleSuccess(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A2E1A]/10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar with verified badge */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1594824813598-13292b3ef3fb?w=400&auto=format&fit=crop&q=80"
              alt="Dra. Ana Cária"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-[#2D6A4F]/20 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-[#2D6A4F] text-white p-1.5 rounded-full shadow-md">
              <CheckCircle2 className="w-5 h-5 fill-current" />
            </div>
          </div>

          {/* Bio text & credentials */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1A2E1A] font-display">
                Dra. Ana Cária
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#D8F3DC] text-[#1A2E1A] border border-[#2D6A4F]/30">
                CRN-3 48.912 💚
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-[#2D6A4F]">
              Nutricionista Clínica Especialista em Diabetes, Hipertensão e Reeducação Alimentar
            </p>

            <p className="text-xs text-[#1A2E1A]/70 max-w-2xl leading-relaxed font-medium">
              Formada pela USP com especialização em Doenças Crônicas e Modulação Intestinal. Acredito em uma nutrição sem terrorismo, onde o paciente aprende a combinar alimentos reais para ter longevidade, disposição e exames impecáveis.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs">
              <div className="px-3.5 py-2 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10">
                <span className="font-black text-[#1A2E1A] text-sm">180K+</span>{" "}
                <span className="text-[#1A2E1A]/60 font-bold uppercase text-[10px] tracking-wider">Visualizações</span>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10">
                <span className="font-black text-[#1A2E1A] text-sm">2.400+</span>{" "}
                <span className="text-[#1A2E1A]/60 font-bold uppercase text-[10px] tracking-wider">Pacientes</span>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10">
                <span className="font-black text-[#1A2E1A] text-sm">4.9 ★</span>{" "}
                <span className="text-[#1A2E1A]/60 font-bold uppercase text-[10px] tracking-wider">Avaliação</span>
              </div>
            </div>
          </div>

          {/* Booking & WhatsApp actions */}
          <div className="flex flex-col gap-2.5 w-full sm:w-auto">
            <button
              id="request-consultation-btn"
              onClick={handleRequestConsultation}
              className="px-5 py-3 rounded-2xl bg-[#2D6A4F] hover:bg-[#1A2E1A] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#2D6A4F]/20 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Consulta</span>
            </button>

            <a
              href="https://api.whatsapp.com/send?text=Olá Dra. Ana Cária, gostaria de informações sobre acompanhamento nutricional!"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-2xl bg-[#D8F3DC] hover:bg-[#b7e4c7] text-[#1A2E1A] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-center border border-[#2D6A4F]/20"
            >
              <MessageCircle className="w-4 h-4 text-[#2D6A4F]" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Schedule notification toast */}
        {scheduleSuccess && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#D8F3DC] border border-[#2D6A4F]/40 text-[#1A2E1A] text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span>
              Solicitação de agendamento enviada! A equipe da Dra. Ana Cária entrará em contato via WhatsApp/Email.
            </span>
          </div>
        )}
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-[#1A2E1A]/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setProfileTab("bio")}
          className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
            profileTab === "bio"
              ? "bg-[#2D6A4F] text-white shadow-xs"
              : "text-[#1A2E1A]/70 hover:bg-[#F4F7F2]"
          }`}
        >
          Consultório & Metodologia
        </button>

        <button
          onClick={() => setProfileTab("saved_videos")}
          className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
            profileTab === "saved_videos"
              ? "bg-[#2D6A4F] text-white shadow-xs"
              : "text-[#1A2E1A]/70 hover:bg-[#F4F7F2]"
          }`}
        >
          Vídeos Salvos ({savedVideos.length})
        </button>

        <button
          onClick={() => setProfileTab("saved_foods")}
          className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
            profileTab === "saved_foods"
              ? "bg-[#2D6A4F] text-white shadow-xs"
              : "text-[#1A2E1A]/70 hover:bg-[#F4F7F2]"
          }`}
        >
          Alimentos Salvos ({savedFoods.length})
        </button>

        <button
          onClick={() => setProfileTab("offline")}
          className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
            profileTab === "offline"
              ? "bg-[#1A2E1A] text-white shadow-xs"
              : "text-[#1A2E1A]/70 hover:bg-[#F4F7F2]"
          }`}
        >
          Baixados Offline ({offlineVideos.length})
        </button>
      </div>

      {/* Tab Contents */}
      {profileTab === "bio" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Methodology Pillars */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#1A2E1A]/10 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#1A2E1A] font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2D6A4F]" />
                Os 3 Pilares da Metodologia Dra. Ana Cária
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10 space-y-1">
                  <h4 className="font-black text-xs text-[#1A2E1A] font-display uppercase tracking-wider">
                    1. Acompanhamento Visual & Prático
                  </h4>
                  <p className="text-xs text-[#1A2E1A]/70 leading-relaxed font-medium">
                    Você aprende vendo vídeos curtos e objetivos. Nada de tabelas chatas que ninguém entende!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10 space-y-1">
                  <h4 className="font-black text-xs text-[#1A2E1A] font-display uppercase tracking-wider">
                    2. Combinações Inteligentes (Sem Terrorismo)
                  </h4>
                  <p className="text-xs text-[#1A2E1A]/70 leading-relaxed font-medium">
                    Nenhum alimento é seu inimigo quando combinado com as fibras e proteínas certas que estabilizam a glicemia.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10 space-y-1">
                  <h4 className="font-black text-xs text-[#1A2E1A] font-display uppercase tracking-wider">
                    3. Respostas Rápidas & Avaliação de Prato
                  </h4>
                  <p className="text-xs text-[#1A2E1A]/70 leading-relaxed font-medium">
                    Tire dúvidas diárias e receba feedback em tempo real para nunca ficar inseguro na hora de montar suas refeições.
                  </p>
                </div>
              </div>
            </div>

            {/* Credentials Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#1A2E1A]/10 shadow-sm space-y-3">
              <h3 className="text-base font-black text-[#1A2E1A] font-display flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2D6A4F]" />
                Formação & Registros Profissionais
              </h3>
              <ul className="space-y-2 text-xs text-[#1A2E1A]/80 font-medium">
                <li className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#2D6A4F]" />
                  <span>Graduação em Nutrição pela Universidade de São Paulo (USP)</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#2D6A4F]" />
                  <span>Pós-graduação em Nutrição Clínica e Fisiologia do Exercício</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#2D6A4F]" />
                  <span>Membro da Sociedade Brasileira de Diabetes (SBD)</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#2D6A4F]" />
                  <span>Registro Ativo: Conselho Regional de Nutricionistas 3ª Região (CRN-3 48.912)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar Quick Info */}
          <div className="space-y-6">
            <div className="bg-[#1A2E1A] text-white p-6 rounded-3xl shadow-md space-y-4 border border-[#2D6A4F]/40">
              <h4 className="font-black text-sm font-display text-white uppercase tracking-wider">Consultório Digital</h4>
              <p className="text-xs text-[#D8F3DC]/90 leading-relaxed font-medium">
                Atendimento presencial em São Paulo e teleconsultas para todo o Brasil e exterior.
              </p>

              <div className="pt-2 border-t border-[#2D6A4F]/40 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#52B788]" />
                  <span className="font-bold">Segunda a Sexta: 08h às 19h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#52B788]" />
                  <span className="font-bold">(11) 98765-4321</span>
                </div>
              </div>
            </div>

            {/* Quick action for Doctor */}
            {currentUser.role === "doctor" && (
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl space-y-3">
                <h4 className="font-black text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Painel da Dra.
                </h4>
                <p className="text-xs text-amber-950/80 font-medium">
                  Gere novos roteiros com IA ou envie novos vídeos para o feed oficial dos pacientes.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={onOpenScriptGenerator}
                    className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Gerar Roteiros com IA
                  </button>
                  <button
                    onClick={onOpenUpload}
                    className="w-full py-2.5 rounded-2xl bg-[#2D6A4F] hover:bg-[#1A2E1A] text-white font-black text-xs uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Gravar Novo Vídeo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {profileTab === "saved_videos" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {savedVideos.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-[#1A2E1A]/10 p-8">
              <Bookmark className="w-10 h-10 mx-auto text-[#2D6A4F]/40 mb-2" />
              <h4 className="font-black text-[#1A2E1A] font-display">Nenhum vídeo salvo ainda</h4>
              <p className="text-xs text-[#1A2E1A]/60 mt-1 font-medium">
                Toque no ícone de salvar em qualquer vídeo do feed para criar sua biblioteca pessoal.
              </p>
            </div>
          ) : (
            savedVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video.id)}
                className="bg-white rounded-3xl overflow-hidden border border-[#1A2E1A]/10 shadow-xs hover:shadow-md cursor-pointer group"
              >
                <div className="aspect-video relative bg-slate-900">
                  <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/70 text-white text-[10px] font-black">
                    {video.durationSeconds}s
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-wider">
                    {video.categoryLabel}
                  </span>
                  <h4 className="text-xs font-black text-[#1A2E1A] font-display line-clamp-2">
                    {video.title}
                  </h4>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {profileTab === "saved_foods" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {savedFoods.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-[#1A2E1A]/10 p-8">
              <Bookmark className="w-10 h-10 mx-auto text-[#2D6A4F]/40 mb-2" />
              <h4 className="font-black text-[#1A2E1A] font-display">Nenhum alimento salvo nos favoritos</h4>
              <p className="text-xs text-[#1A2E1A]/60 mt-1 font-medium">
                Acesse a aba "Pode ou Não Pode" e salve os alimentos que você consome no seu dia a dia.
              </p>
            </div>
          ) : (
            savedFoods.map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-3xl p-4 border border-[#1A2E1A]/10 shadow-xs flex items-center gap-3"
              >
                <img src={food.imageUrl} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-[#1A2E1A] font-display">{food.name}</h4>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#2D6A4F]">
                    {food.status === "pode" ? "✅ Recomendado" : "⚠️ Com Moderação"}
                  </span>
                  <p className="text-[11px] text-[#1A2E1A]/70 line-clamp-1 font-medium">{food.draTip}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {profileTab === "offline" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {offlineVideos.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-[#1A2E1A]/10 p-8">
              <Download className="w-10 h-10 mx-auto text-[#2D6A4F]/40 mb-2" />
              <h4 className="font-black text-[#1A2E1A] font-display">Nenhum vídeo baixado para offline</h4>
              <p className="text-xs text-[#1A2E1A]/60 mt-1 font-medium">
                Toque no botão "Offline" no vídeo para assistir mesmo quando estiver sem sinal ou internet no supermercado.
              </p>
            </div>
          ) : (
            offlineVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video.id)}
                className="bg-white rounded-3xl overflow-hidden border border-[#1A2E1A]/10 shadow-xs hover:shadow-md cursor-pointer group"
              >
                <div className="aspect-video relative bg-slate-900">
                  <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#1A2E1A] text-[#D8F3DC] text-[10px] font-black uppercase tracking-wider">
                    ✓ Baixado
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-wider">
                    Disponível Offline
                  </span>
                  <h4 className="text-xs font-black text-[#1A2E1A] font-display line-clamp-2">
                    {video.title}
                  </h4>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
