import React, { useState } from "react";
import {
  Film,
  Camera,
  Upload,
  Sparkles,
  CheckCircle,
  Clock,
  Layers,
  Image as ImageIcon,
  Tag,
  Zap,
} from "lucide-react";
import { VideoItem, CategoryType, UserProfile } from "../types";

interface VideoUploadModalProps {
  onClose: () => void;
  onPublishVideo: (video: VideoItem) => void;
  currentUser: UserProfile;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  onClose,
  onPublishVideo,
  currentUser,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryType>("dica_do_dia");
  const [durationSeconds, setDurationSeconds] = useState(30);
  const [description, setDescription] = useState("");
  const [transcript, setTranscript] = useState("");
  const [highlightStep, setHighlightStep] = useState("");
  const [customThumbnail, setCustomThumbnail] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState<"emerald" | "amber" | "teal" | "rose">("emerald");

  const categoryLabels: Record<CategoryType, string> = {
    todos: "Geral",
    dica_do_dia: "Dica do Dia",
    diabetes: "Diabetes",
    hipertensao: "Hipertensão",
    emagrecimento: "Emagrecimento",
    mito_ou_verdade: "Mito ou Verdade",
    receitas_rapidas: "Receita Rápida",
    criancas: "Crianças",
    respostas: "Dra. Responde",
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomThumbnail(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const gradients = {
      emerald: "from-emerald-950 via-teal-900 to-slate-950",
      amber: "from-amber-950 via-stone-900 to-black",
      teal: "from-teal-950 via-cyan-950 to-slate-950",
      rose: "from-rose-950 via-pink-950 to-black",
    };

    const newVideo: VideoItem = {
      id: `vid-${Date.now()}`,
      title,
      description: description || "Vídeo educativo publicado pela Dra. Ana Cária 💚",
      durationSeconds,
      category,
      categoryLabel: categoryLabels[category] || "Dica",
      author: {
        name: currentUser.name || "Dra. Ana Cária",
        title: currentUser.role === "doctor" ? "Nutricionista Clínica" : "Paciente",
        avatar: currentUser.avatar,
        verified: currentUser.role === "doctor",
      },
      thumbnailUrl:
        customThumbnail ||
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80",
      videoType: "animated_canvas",
      bgGradient: gradients[themeColor],
      themeColor,
      visualScene: {
        title,
        subtitle: "Dica de Nutrição Clínica & Saúde",
        iconName: "Zap",
        steps: [
          { time: 0, text: highlightStep || title, highlight: true },
          { time: 10, text: transcript.slice(0, 80) || "Dica de ouro explicada com carinho", highlight: false },
          { time: 20, text: "💚 Salve e compartilhe com quem precisa!", highlight: true },
        ],
        badge: categoryLabels[category],
      },
      likesCount: 1,
      isLiked: true,
      viewsCount: 1,
      transcript: transcript || title,
      caption: `${title} 💚 #DraAnaCaria #${categoryLabels[category]} #Nutricao`,
      hashtags: ["#DraAnaCaria", `#${categoryLabels[category]}`, "#SaudeSemNeura"],
      comments: [],
      publishedAt: "Agora mesmo",
    };

    onPublishVideo(newVideo);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl border border-[#1A2E1A]/10 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1A2E1A]/10 pb-3">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#2D6A4F]" />
            <h2 className="text-lg font-black text-[#1A2E1A] font-display">
              {currentUser.role === "doctor" ? "Publicar Novo Vídeo Oficial" : "Postar Vídeo de Refeição"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-[#1A2E1A]/40 hover:text-[#1A2E1A] bg-[#F4F7F2]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
              Título do Vídeo
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 3 lanches que não sobem a glicose..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-bold"
              >
                <option value="dica_do_dia">✨ Dica do Dia</option>
                <option value="diabetes">🩸 Diabetes</option>
                <option value="hipertensao">🫀 Hipertensão</option>
                <option value="emagrecimento">🥗 Emagrecimento</option>
                <option value="mito_ou_verdade">❓ Mito ou Verdade</option>
                <option value="receitas_rapidas">🍳 Receita Rápida</option>
                <option value="criancas">🧸 Crianças</option>
                <option value="respostas">💬 Dra. Responde</option>
              </select>
            </div>

            <div>
              <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
                Duração (Segundos)
              </label>
              <select
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-bold"
              >
                <option value={20}>20s (Rápido / Mito)</option>
                <option value={30}>30s (Padrão Feed)</option>
                <option value={45}>45s (Receita)</option>
                <option value={60}>60s (Aprofundado)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
              Orientação / Frase Principal na Tela
            </label>
            <input
              type="text"
              value={highlightStep}
              onChange={(e) => setHighlightStep(e.target.value)}
              placeholder="Ex: Abacate com chia e limão = Glicose estável"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-semibold"
            />
          </div>

          <div>
            <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
              Transcrição / Legenda do Vídeo
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Texto falado no vídeo para gerar legenda automática sincronizada..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-medium leading-relaxed"
            />
          </div>

          {/* Thumbnail Capa */}
          <div>
            <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
              Capa do Vídeo
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 border-2 border-dashed border-[#2D6A4F]/30 hover:border-[#2D6A4F] rounded-2xl p-3.5 text-center cursor-pointer transition-colors bg-[#F4F7F2]">
                <Camera className="w-5 h-5 mx-auto text-[#2D6A4F] mb-1" />
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1A2E1A] block">
                  {customThumbnail ? "Capa Selecionada ✓" : "Upload de Capa ou Frame"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {customThumbnail && (
                <img
                  src={customThumbnail}
                  alt="Thumb"
                  className="w-12 h-16 rounded-2xl object-cover border border-[#2D6A4F]/40"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#2D6A4F] hover:bg-[#1A2E1A] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#2D6A4F]/20 transition-all hover:scale-101"
          >
            <Film className="w-4 h-4" />
            <span>Publicar Vídeo no Feed</span>
          </button>
        </form>
      </div>
    </div>
  );
};
