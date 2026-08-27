import React, { useState } from "react";
import {
  UtensilsCrossed,
  Camera,
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Heart,
  TrendingUp,
  Award,
  Stethoscope,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { MealPlateReview, UserProfile } from "../types";

interface MealReviewModalProps {
  reviews: MealPlateReview[];
  onAddReview: (review: MealPlateReview) => void;
  currentUser: UserProfile;
}

export const MealReviewModal: React.FC<MealReviewModalProps> = ({
  reviews,
  onAddReview,
  currentUser,
}) => {
  const [mealType, setMealType] = useState<
    "Café da Manhã" | "Almoço" | "Lanche da Tarde" | "Jantar" | "Ceia"
  >("Almoço");
  const [mealDescription, setMealDescription] = useState("");
  const [patientCondition, setPatientCondition] = useState("Diabetes & Emagrecimento");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeReviewResult, setActiveReviewResult] = useState<MealPlateReview | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEvaluatePlate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealDescription.trim()) return;

    setIsEvaluating(true);
    setActiveReviewResult(null);

    try {
      const res = await fetch("/api/ai/evaluate-plate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealType,
          mealDescription,
          patientCondition,
          imageBase64: photoBase64,
        }),
      });
      const data = await res.json();
      const evalData = data.evaluation;

      const newReview: MealPlateReview = {
        id: `rev-${Date.now()}`,
        patientName: currentUser.name || "Paciente",
        patientAvatar: currentUser.avatar,
        createdAt: "Agora mesmo",
        mealType,
        mealDescription,
        photoUrl: photoBase64 || undefined,
        score: evalData?.score || 8.8,
        summary: evalData?.summary || "Prato nutritivo com ótimo balanço!",
        strengths: evalData?.strengths || ["Boa quantidade de fibras", "Proteína de qualidade"],
        improvements: evalData?.improvements || ["Acrescente azeite cru e mastigue com calma"],
        glycemicImpact: evalData?.glycemicImpact || "Baixo a moderado",
        sodiumImpact: evalData?.sodiumImpact || "Seguro para pressão",
        draTip: evalData?.draTip || "Parabéns pela escolha cuidadosa da refeição! 💚",
      };

      onAddReview(newReview);
      setActiveReviewResult(newReview);

      if (newReview.score >= 8.5) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const loadSamplePlate = (type: "ideal" | "moderado") => {
    if (type === "ideal") {
      setMealType("Almoço");
      setMealDescription(
        "Filé de tilápia grelhada com azeite, 2 colheres de arroz integral, 1 concha rasa de feijão preto, salada farta de rúcula, tomate cereja e pepino com sementes de girassol."
      );
    } else {
      setMealType("Lanche da Tarde");
      setMealDescription(
        "1 Pão de queijo médio com um copo de suco de laranja natural e um café com açúcar."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#1A2E1A] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#1A2E1A]/10 border border-[#2D6A4F]/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-[#D8F3DC]">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#52B788]" />
              <span>Avaliação Nutricional de Pratos</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Avaliar meu Prato com a Dra. Ana 🥗
            </h1>
            <p className="text-xs sm:text-sm text-[#D8F3DC]/80 max-w-xl leading-relaxed font-medium">
              Envie a foto ou descreva o que você está comendo. A Dra. Ana Cária analisa o impacto glicêmico, o equilíbrio de nutrientes e dá dicas de ouro!
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => loadSamplePlate("ideal")}
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-xs text-[#D8F3DC] font-black uppercase tracking-wider border border-white/20 transition-colors"
            >
              Exemplo Prato Saudável
            </button>
            <button
              onClick={() => loadSamplePlate("moderado")}
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-xs text-[#D8F3DC] font-black uppercase tracking-wider border border-white/20 transition-colors"
            >
              Exemplo Lanche
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#1A2E1A]/10 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-[#1A2E1A] font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2D6A4F]" />
            Nova Avaliação de Refeição
          </h2>

          <form onSubmit={handleEvaluatePlate} className="space-y-4">
            {/* Meal Type Selection */}
            <div>
              <label className="block text-xs font-black text-[#1A2E1A] uppercase tracking-wider mb-2">
                Tipo de Refeição
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {(["Café da Manhã", "Almoço", "Lanche da Tarde", "Jantar", "Ceia"] as const).map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMealType(type)}
                      className={`px-2 py-2 rounded-2xl text-[11px] font-black text-center transition-all ${
                        mealType === type
                          ? "bg-[#1A2E1A] text-white shadow-xs"
                          : "bg-[#F4F7F2] text-[#1A2E1A]/80 hover:bg-[#D8F3DC]/40 border border-[#1A2E1A]/10"
                      }`}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Health Goal / Condition */}
            <div>
              <label className="block text-xs font-black text-[#1A2E1A] uppercase tracking-wider mb-2">
                Seu Foco / Condição de Saúde
              </label>
              <select
                value={patientCondition}
                onChange={(e) => setPatientCondition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-xs font-bold text-[#1A2E1A] focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20"
              >
                <option value="Diabetes Tipo 2 / Pré-Diabetes">Controle de Diabetes / Glicose</option>
                <option value="Hipertensão Arterial">Controle de Pressão Alta (Hipertensão)</option>
                <option value="Emagrecimento & Gordura no Fígado">Emagrecimento Saudável</option>
                <option value="Saúde Geral & Família">Alimentação Saudável Geral</option>
              </select>
            </div>

            {/* Meal Description */}
            <div>
              <label className="block text-xs font-black text-[#1A2E1A] uppercase tracking-wider mb-1.5">
                O que tem no seu prato?
              </label>
              <textarea
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                placeholder="Descreva os alimentos: ex: 2 colheres de arroz, feijão, frango assado, salada de alface e tomate..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-xs text-[#1A2E1A] font-medium placeholder-[#1A2E1A]/40 focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20 leading-relaxed"
                required
              />
            </div>

            {/* Photo Upload (Optional) */}
            <div>
              <label className="block text-xs font-black text-[#1A2E1A] uppercase tracking-wider mb-1.5">
                Foto do Prato (Opcional)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 border-2 border-dashed border-[#2D6A4F]/30 hover:border-[#2D6A4F] rounded-3xl p-4 text-center cursor-pointer transition-colors bg-[#F4F7F2]">
                  <Camera className="w-6 h-6 mx-auto text-[#2D6A4F] mb-1" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#1A2E1A] block">
                    {photoBase64 ? "Trocar Foto do Prato" : "Tirar Foto ou Escolher da Galeria"}
                  </span>
                  <span className="text-[10px] text-[#1A2E1A]/60 font-bold">PNG, JPG até 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {photoBase64 && (
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#2D6A4F]/40 shrink-0">
                    <img src={photoBase64} alt="Prévia" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoBase64(null)}
                      className="absolute top-0 right-0 bg-black/70 text-white text-[10px] px-1 rounded-bl-sm"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="submit-meal-review-btn"
              type="submit"
              disabled={isEvaluating || !mealDescription.trim()}
              className="w-full py-3.5 rounded-2xl bg-[#2D6A4F] hover:bg-[#1A2E1A] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#2D6A4F]/20 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-99"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dra. Ana Cária está avaliando seu prato...</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-4 h-4" />
                  <span>Enviar para Avaliação Clínica</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results & History Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Result Card */}
          {activeReviewResult ? (
            <div className="bg-white p-6 rounded-3xl border-2 border-[#2D6A4F] shadow-xl space-y-4 animate-scaleIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A2E1A]/10">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-500" />
                  <div>
                    <h3 className="font-black text-[#1A2E1A] font-display">
                      Resultado da Avaliação
                    </h3>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#2D6A4F]">{activeReviewResult.mealType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#D8F3DC] text-[#1A2E1A] font-black text-sm border border-[#2D6A4F]/20">
                  <span className="uppercase tracking-wider text-xs">Nota:</span>
                  <span className="text-[#2D6A4F] text-base">{activeReviewResult.score}/10</span>
                </div>
              </div>

              {/* Summary message */}
              <p className="text-xs sm:text-sm text-[#1A2E1A] leading-relaxed font-bold bg-[#F4F7F2] p-3.5 rounded-2xl border border-[#1A2E1A]/10">
                {activeReviewResult.summary}
              </p>

              {/* Strengths */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-[#1A2E1A] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#2D6A4F]" /> Pontos Fortes
                </h4>
                <ul className="space-y-1 pl-1">
                  {activeReviewResult.strengths.map((str, i) => (
                    <li key={i} className="text-xs text-[#1A2E1A]/80 font-medium flex items-start gap-2">
                      <span className="text-[#2D6A4F] font-black">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Oportunidade de Melhoria
                </h4>
                <ul className="space-y-1 pl-1">
                  {activeReviewResult.improvements.map((imp, i) => (
                    <li key={i} className="text-xs text-[#1A2E1A]/80 font-medium flex items-start gap-2">
                      <span className="text-amber-600 font-black">→</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dra. Ana Personal Note */}
              <div className="p-4 rounded-2xl bg-[#1A2E1A] text-white space-y-1 border border-[#2D6A4F]/40">
                <span className="text-[11px] font-black text-[#D8F3DC] block uppercase tracking-wider">
                  Dica de Ouro da Dra. Ana Cária 💚
                </span>
                <p className="text-xs leading-relaxed text-[#D8F3DC]/90 font-medium">
                  "{activeReviewResult.draTip}"
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-[#1A2E1A]/10 text-center space-y-3">
              <UtensilsCrossed className="w-10 h-10 mx-auto text-[#2D6A4F]" />
              <h3 className="font-black text-sm text-[#1A2E1A] font-display">
                Como Funciona a Avaliação
              </h3>
              <p className="text-xs text-[#1A2E1A]/70 leading-relaxed max-w-sm mx-auto font-medium">
                Preencha os alimentos da sua refeição ao lado. A Dra. Ana Cária verifica a proporção de macronutrientes, calcula o impacto glicêmico e envia sugestões práticas na hora!
              </p>
            </div>
          )}

          {/* History Reviews List */}
          <div className="space-y-3">
            <h3 className="font-black text-xs uppercase tracking-wider text-[#1A2E1A]">
              Histórico de Pratos Avaliados ({reviews.length})
            </h3>

            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-white rounded-3xl border border-[#1A2E1A]/10 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-xl bg-[#D8F3DC] text-[#1A2E1A] text-[11px] font-black uppercase tracking-wider border border-[#2D6A4F]/20">
                      {rev.mealType}
                    </span>
                    <span className="text-xs font-black text-[#1A2E1A] font-display">{rev.patientName}</span>
                  </div>
                  <span className="text-xs font-black text-[#2D6A4F] bg-[#D8F3DC] px-2.5 py-0.5 rounded-xl border border-[#2D6A4F]/30">
                    Nota: {rev.score}
                  </span>
                </div>
                <p className="text-xs text-[#1A2E1A]/70 font-medium line-clamp-2">{rev.mealDescription}</p>
                <p className="text-xs text-[#1A2E1A] font-bold bg-[#F4F7F2] p-2.5 rounded-2xl border border-[#1A2E1A]/10">
                  💚 {rev.draTip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
