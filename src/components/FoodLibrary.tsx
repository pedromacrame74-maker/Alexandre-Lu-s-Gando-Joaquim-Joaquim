import React, { useState } from "react";
import {
  Search,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  Heart,
  Flame,
  Activity,
  ArrowRight,
  Bookmark,
  Share2,
  Info,
  Layers,
  Send,
  Stethoscope,
  ShieldAlert,
  Award,
  Globe,
  Dumbbell,
  Baby,
  Smile,
  Zap,
} from "lucide-react";
import { FoodItem, FoodStatus, UserProfile } from "../types";

interface FoodLibraryProps {
  foods: FoodItem[];
  savedFoodIds: string[];
  onToggleSaveFood: (foodId: string) => void;
}

export const FoodLibrary: React.FC<FoodLibraryProps> = ({
  foods,
  savedFoodIds,
  onToggleSaveFood,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<
    "todos" | "diabetes" | "hipertensao" | "emagrecimento" | "ganho_muscular" | "criancas" | "idosos" | "desporto" | "renal"
  >("todos");
  const [selectedStatus, setSelectedStatus] = useState<"todos" | FoodStatus>("todos");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [onlyAngolan, setOnlyAngolan] = useState(false);
  const [activeFoodModal, setActiveFoodModal] = useState<FoodItem | null>(null);

  // AI Nutri-Chat question state for the modal
  const [customQuestion, setCustomQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingAI, setIsAskingAI] = useState(false);

  // Filter logic
  const filteredFoods = foods.filter((f) => {
    // Angolan-only toggle
    if (onlyAngolan && !f.isAngolanOrigin) {
      return false;
    }

    // Condition filter
    let matchesCondition = true;
    if (selectedCondition === "diabetes") {
      matchesCondition = f.recommendedFor.diabetes !== "evitar";
    } else if (selectedCondition === "hipertensao") {
      matchesCondition = f.recommendedFor.hipertensao !== "evitar";
    } else if (selectedCondition === "emagrecimento") {
      matchesCondition = f.recommendedFor.emagrecimento !== "evitar";
    } else if (selectedCondition === "ganho_muscular") {
      matchesCondition = f.recommendedFor.ganho_muscular === "ótimo";
    } else if (selectedCondition === "criancas") {
      matchesCondition = f.recommendedFor.criancas === "ótimo";
    } else if (selectedCondition === "idosos") {
      matchesCondition = f.recommendedFor.idosos === "ótimo";
    } else if (selectedCondition === "desporto") {
      matchesCondition = f.recommendedFor.desporto === "ótimo";
    } else if (selectedCondition === "renal") {
      matchesCondition = f.recommendedFor.renal === "ótimo";
    }

    // Status filter
    const matchesStatus =
      selectedStatus === "todos" || f.status === selectedStatus;

    // Category filter
    const matchesCategory =
      selectedCategory === "todos" || f.category === selectedCategory;

    // Search query
    const matchesSearch =
      searchQuery === "" ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.summaryReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.draTip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.mainNutrients && f.mainNutrients.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.keyBenefits && f.keyBenefits.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.healthyAlternatives &&
        f.healthyAlternatives.some((alt) =>
          alt.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    return matchesCondition && matchesStatus && matchesCategory && matchesSearch;
  });

  const handleAskDraAboutFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || !activeFoodModal) return;

    setIsAskingAI(true);
    setAiAnswer(null);

    try {
      const res = await fetch("/api/ai/ask-dra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: customQuestion,
          context: `Alimento: ${activeFoodModal.name} - Status: ${activeFoodModal.status} - IG: ${activeFoodModal.glycemicIndex} - Nutrientes: ${activeFoodModal.mainNutrients || ""} - Benefícios: ${activeFoodModal.keyBenefits || ""} - Dica: ${activeFoodModal.draTip}`,
        }),
      });
      const data = await res.json();
      setAiAnswer(data.answer || "Aqui está a recomendação da Dra. Ana Cária!");
    } catch (err) {
      setAiAnswer(
        "A Dra. Ana Cária recomenda sempre balancear este alimento com boas fontes de fibras e proteínas para evitar qualquer alteração brusca na glicemia. 💚"
      );
    } finally {
      setIsAskingAI(false);
    }
  };

  const getStatusBadge = (status: FoodStatus) => {
    switch (status) {
      case "pode":
        return {
          label: "Melhor Escolha / Pode",
          color: "bg-[#D8F3DC] text-[#1A2E1A] border-[#2D6A4F]/40 font-black",
          icon: <CheckCircle className="w-4 h-4 text-[#2D6A4F]" />,
        };
      case "moderacao":
        return {
          label: "Moderar / Atenção",
          color: "bg-amber-100 text-amber-950 border-amber-300 font-black",
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
        };
      case "evitar":
        return {
          label: "Limitar / Evitar",
          color: "bg-rose-100 text-rose-950 border-rose-300 font-black",
          icon: <XCircle className="w-4 h-4 text-rose-600" />,
        };
    }
  };

  const getGlycemicBadge = (gi: string) => {
    switch (gi) {
      case "baixo":
        return <span className="text-[#2D6A4F] font-black text-xs uppercase tracking-wider">Baixo IG</span>;
      case "medio":
        return <span className="text-amber-800 font-black text-xs uppercase tracking-wider">Médio IG</span>;
      case "alto":
        return <span className="text-rose-800 font-black text-xs uppercase tracking-wider">Alto IG ⚠️</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-[#1A2E1A] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#1A2E1A]/15 mb-6 border border-[#2D6A4F]/40 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-[#D8F3DC]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Base Nutricional Dra. Ana Cária</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-200 text-xs font-black uppercase tracking-wider">
              <span>🇦🇴 Especial Gastronomia & Alimentos Angolanos</span>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white leading-tight">
            Tabela de Alimentos: O Que Comer & O Que Moderar 🥑🇦🇴
          </h1>
          <p className="text-xs sm:text-sm text-[#D8F3DC]/90 leading-relaxed font-medium">
            Consulte mais de 50 alimentos e pratos angolanos tradicionais (Funge, Kizaca, Mukua, Mufete, Calulu) com nutrientes, calorias, macros e recomendações clínicas para cada objetivo de saúde.
          </p>
        </div>

        {/* Quick Instant Search Bar */}
        <div className="mt-6 relative max-w-xl z-10">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#1A2E1A]/50" />
          <input
            type="text"
            id="food-search-main"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquise por 'funge', 'kizaca', 'mukua', 'mufete', 'banana', 'feijão'..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-[#1A2E1A] placeholder-[#1A2E1A]/40 font-bold text-xs sm:text-sm focus:outline-hidden focus:ring-4 focus:ring-[#2D6A4F]/20 shadow-lg border border-[#1A2E1A]/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black uppercase text-slate-500 hover:text-slate-900 bg-[#F4F7F2] px-2.5 py-1 rounded-xl"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Clinical Disclaimer Box */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-amber-950 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 font-medium leading-relaxed">
          <p className="font-black uppercase tracking-wider text-amber-900">
            Aviso de Responsabilidade Médica & Nutricional
          </p>
          <p className="text-amber-900/90">
            Para condições de saúde como diabetes descompensada, hipertensão severa, doença renal ou outras situações clínicas, as informações desta aplicação têm finalidade estritamente educativa e <strong>não substituem uma avaliação individual e personalizada de um nutricionista ou médico</strong>.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-4 mb-8">
        {/* Quick Origin & Highlight Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            id="filter-toggle-all"
            onClick={() => setOnlyAngolan(false)}
            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              !onlyAngolan
                ? "bg-[#1A2E1A] text-white shadow-md"
                : "bg-white text-[#1A2E1A] border border-[#1A2E1A]/10 hover:bg-slate-50"
            }`}
          >
            🌍 Todos os Alimentos
          </button>
          <button
            id="filter-toggle-angola"
            onClick={() => setOnlyAngolan(true)}
            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
              onlyAngolan
                ? "bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400"
                : "bg-amber-50 text-amber-950 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            <span>🇦🇴 Apenas Alimentos & Pratos Angolanos</span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-200/60 text-[10px] font-black">
              {foods.filter((f) => f.isAngolanOrigin).length}
            </span>
          </button>
        </div>

        {/* Condition Focus Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-black text-[#1A2E1A]/60 uppercase tracking-wider mr-1 shrink-0">
            Objetivo de Saúde:
          </span>
          {[
            { id: "todos", label: "Geral" },
            { id: "diabetes", label: "🩸 Diabetes" },
            { id: "hipertensao", label: "🫀 Hipertensão" },
            { id: "emagrecimento", label: "🥗 Emagrecimento" },
            { id: "ganho_muscular", label: "💪 Ganho Muscular" },
            { id: "criancas", label: "👶 Crianças" },
            { id: "idosos", label: "👵 Idosos" },
            { id: "desporto", label: "⚡ Desporto" },
            { id: "renal", label: "🩺 Renal" },
          ].map((cond) => (
            <button
              key={cond.id}
              id={`filter-condition-${cond.id}`}
              onClick={() => setSelectedCondition(cond.id as any)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCondition === cond.id
                  ? "bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/20"
                  : "bg-white text-[#1A2E1A] border border-[#1A2E1A]/10 hover:bg-[#D8F3DC]/40 shadow-xs"
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>

        {/* Status Tag Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-black text-[#1A2E1A]/60 uppercase tracking-wider mr-1 shrink-0">
            Classificação:
          </span>
          {[
            { id: "todos", label: "Todas" },
            { id: "pode", label: "✅ Melhor Escolha" },
            { id: "moderacao", label: "⚠️ Moderar" },
            { id: "evitar", label: "❌ Limitar" },
          ].map((st) => (
            <button
              key={st.id}
              id={`filter-status-${st.id}`}
              onClick={() => setSelectedStatus(st.id as any)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedStatus === st.id
                  ? "bg-[#1A2E1A] text-white shadow-sm"
                  : "bg-white text-[#1A2E1A] border border-[#1A2E1A]/10 hover:bg-slate-50 shadow-xs"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Food Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-black text-[#1A2E1A]/60 uppercase tracking-wider mr-1 shrink-0">
            Categoria:
          </span>
          {[
            { id: "todos", label: "Todos os Grupos" },
            { id: "pratos_tipicos", label: "🍲 Pratos Típicos Angolanos" },
            { id: "carboidratos", label: "🍚 Funges, Tubérculos & Grãos" },
            { id: "vegetais", label: "🥬 Kizacas, Couves & Folhas" },
            { id: "proteinas", label: "🐟 Peixes, Carnes & Leguminosas" },
            { id: "frutas", label: "🥭 Frutas & Mukua" },
            { id: "gorduras", label: "🥜 Jinguba, Abacate & Azeites" },
            { id: "bebidas", label: "🍵 Chás & Bebidas" },
            { id: "doces_lanches", label: "🛑 Processados & Caldos" },
          ].map((cat) => (
            <button
              key={cat.id}
              id={`filter-category-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#2D6A4F] text-white shadow-xs font-black"
                  : "bg-white/80 text-[#1A2E1A]/80 border border-[#1A2E1A]/10 hover:bg-[#D8F3DC]/30 shadow-xs"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map((food) => {
          const status = getStatusBadge(food.status);
          const isSaved = savedFoodIds.includes(food.id);

          return (
            <div
              key={food.id}
              id={`food-card-${food.id}`}
              onClick={() => {
                setActiveFoodModal(food);
                setAiAnswer(null);
                setCustomQuestion("");
              }}
              className="bg-white rounded-3xl p-5 border border-[#1A2E1A]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Origin Badge */}
                  {food.isAngolanOrigin && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#1A2E1A]/85 backdrop-blur-md text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-300/30">
                      <span>🇦🇴 Angola</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      id={`save-food-btn-${food.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveFood(food.id);
                      }}
                      className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                        isSaved
                          ? "bg-amber-400 text-amber-950 font-black"
                          : "bg-black/50 text-white hover:bg-black/70"
                      }`}
                      title={isSaved ? "Salvo nos Favoritos" : "Salvar Alimento"}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-md border ${status.color}`}
                    >
                      {status.icon}
                      <span>{status.label}</span>
                    </span>
                  </div>
                </div>

                {/* Title and Summary */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-black text-[#1A2E1A] font-display group-hover:text-[#2D6A4F] transition-colors">
                      {food.name}
                    </h3>
                    <div className="px-2.5 py-1 rounded-xl bg-[#F4F7F2] border border-[#1A2E1A]/10 text-[11px] shrink-0">
                      {getGlycemicBadge(food.glycemicIndex)}
                    </div>
                  </div>

                  {food.mainNutrients && (
                    <p className="text-[11px] font-black text-[#2D6A4F] uppercase tracking-wider">
                      ✨ {food.mainNutrients}
                    </p>
                  )}

                  <p className="text-xs text-[#1A2E1A]/70 line-clamp-2 leading-relaxed font-medium">
                    {food.summaryReason}
                  </p>
                </div>

                {/* Macro summary pills */}
                <div className="grid grid-cols-4 gap-1.5 my-3 p-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10 text-center">
                  <div>
                    <span className="block text-[9px] text-[#1A2E1A]/60 font-black uppercase">Carb</span>
                    <span className="font-black text-xs text-[#1A2E1A]">{food.carbsGrams}g</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-[#1A2E1A]/60 font-black uppercase">Prot</span>
                    <span className="font-black text-xs text-[#1A2E1A]">{food.proteinGrams}g</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-[#1A2E1A]/60 font-black uppercase">Fibra</span>
                    <span className="font-black text-xs text-[#2D6A4F]">{food.fiberGrams}g</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-[#1A2E1A]/60 font-black uppercase">Gord</span>
                    <span className="font-black text-xs text-[#1A2E1A]">{food.fatsGrams ?? 0}g</span>
                  </div>
                </div>

                {/* Dra. Ana Tip preview */}
                <div className="bg-[#D8F3DC]/40 p-3 rounded-2xl border border-[#2D6A4F]/20 flex items-start gap-2">
                  <span className="text-[#2D6A4F] font-black text-xs shrink-0">💚 Dica:</span>
                  <p className="text-xs text-[#1A2E1A] font-semibold line-clamp-2">
                    {food.draTip}
                  </p>
                </div>
              </div>

              {/* Action link */}
              <div className="pt-3 mt-3 border-t border-[#1A2E1A]/10 flex items-center justify-between text-xs text-[#2D6A4F] font-black uppercase tracking-wider">
                <span>Ver tabela e dicas clínicas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#1A2E1A]/10 p-8 shadow-xs">
          <BookOpen className="w-12 h-12 mx-auto text-[#2D6A4F]/40 mb-3" />
          <h3 className="text-lg font-black font-display text-[#1A2E1A]">Nenhum alimento encontrado</h3>
          <p className="text-sm text-[#1A2E1A]/70 mt-1 max-w-sm mx-auto font-medium">
            Experimente buscar por outro nome ou limpar os filtros aplicados.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCondition("todos");
              setSelectedStatus("todos");
              setSelectedCategory("todos");
              setOnlyAngolan(false);
            }}
            className="mt-4 px-5 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#1A2E1A]"
          >
            Ver Todos os Alimentos
          </button>
        </div>
      )}

      {/* Deep Food Detail Modal */}
      {activeFoodModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveFoodModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-[#1A2E1A]/15 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-[#1A2E1A] font-display">
                    {activeFoodModal.name}
                  </h2>
                  {activeFoodModal.isAngolanOrigin && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black uppercase">
                      🇦🇴 Angola
                    </span>
                  )}
                </div>
                {activeFoodModal.scientificName && (
                  <p className="text-xs italic text-[#1A2E1A]/50 font-bold">
                    {activeFoodModal.scientificName}
                  </p>
                )}
                <div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${
                      getStatusBadge(activeFoodModal.status).color
                    }`}
                  >
                    {getStatusBadge(activeFoodModal.status).icon}
                    {getStatusBadge(activeFoodModal.status).label}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveFoodModal(null)}
                className="p-2 rounded-xl bg-[#F4F7F2] hover:bg-slate-200 text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Food Image Banner */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 relative">
              <img
                src={activeFoodModal.imageUrl}
                alt={activeFoodModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-[#1A2E1A]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs text-[#D8F3DC] font-black uppercase tracking-wider">
                {activeFoodModal.caloriesPer100g} kcal / 100g
              </div>
            </div>

            {/* Nutrients and Key Benefits */}
            {(activeFoodModal.mainNutrients || activeFoodModal.keyBenefits) && (
              <div className="p-4 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/10 space-y-2">
                {activeFoodModal.mainNutrients && (
                  <div className="text-xs">
                    <span className="font-black text-[#1A2E1A] uppercase tracking-wider">Principais Nutrientes: </span>
                    <span className="text-[#2D6A4F] font-bold">{activeFoodModal.mainNutrients}</span>
                  </div>
                )}
                {activeFoodModal.keyBenefits && (
                  <div className="text-xs">
                    <span className="font-black text-[#1A2E1A] uppercase tracking-wider">Benefícios para a Saúde: </span>
                    <span className="text-[#1A2E1A]/80 font-medium">{activeFoodModal.keyBenefits}</span>
                  </div>
                )}
              </div>
            )}

            {/* Macronutrients Grid */}
            <div className="grid grid-cols-5 gap-2 p-3.5 bg-[#F4F7F2] rounded-2xl border border-[#1A2E1A]/10 text-center">
              <div>
                <span className="text-[9px] text-[#1A2E1A]/60 block font-black uppercase tracking-wider">Índice Glicêmico</span>
                <span className="text-xs font-black text-[#1A2E1A] uppercase">
                  {activeFoodModal.glycemicIndex}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-[#1A2E1A]/60 block font-black uppercase tracking-wider">Carboidratos</span>
                <span className="text-xs font-black text-[#1A2E1A]">{activeFoodModal.carbsGrams}g</span>
              </div>
              <div>
                <span className="text-[9px] text-[#1A2E1A]/60 block font-black uppercase tracking-wider">Proteínas</span>
                <span className="text-xs font-black text-[#1A2E1A]">{activeFoodModal.proteinGrams}g</span>
              </div>
              <div>
                <span className="text-[9px] text-[#1A2E1A]/60 block font-black uppercase tracking-wider">Fibras</span>
                <span className="text-xs font-black text-[#2D6A4F]">{activeFoodModal.fiberGrams}g</span>
              </div>
              <div>
                <span className="text-[9px] text-[#1A2E1A]/60 block font-black uppercase tracking-wider">Gorduras</span>
                <span className="text-xs font-black text-[#1A2E1A]">{activeFoodModal.fatsGrams ?? 0}g</span>
              </div>
            </div>

            {/* Dra. Ana Clinical Advice Card */}
            <div className="p-5 rounded-2xl bg-[#1A2E1A] text-white space-y-2 shadow-md border border-[#2D6A4F]/40">
              <div className="flex items-center gap-2 text-[#D8F3DC]">
                <Stethoscope className="w-5 h-5" />
                <h4 className="font-black text-sm font-display uppercase tracking-wider">
                  Orientação Clínica da Dra. Ana Cária
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#D8F3DC]/95 leading-relaxed font-medium">
                "{activeFoodModal.draTip}"
              </p>
            </div>

            {/* How to consume */}
            <div className="space-y-2">
              <h4 className="font-black text-sm text-[#1A2E1A] font-display flex items-center gap-2 uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 text-[#2D6A4F]" />
                Como consumir do jeito certo
              </h4>
              <ul className="space-y-1.5">
                {activeFoodModal.howToConsume.map((step, i) => (
                  <li key={i} className="text-xs text-[#1A2E1A]/80 font-medium flex items-start gap-2">
                    <span className="text-[#2D6A4F] font-black">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Healthy Alternatives */}
            {activeFoodModal.healthyAlternatives && activeFoodModal.healthyAlternatives.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-black text-sm text-[#1A2E1A] font-display flex items-center gap-2 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Substitutos Saudáveis Recomendados
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeFoodModal.healthyAlternatives.map((alt, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Q&A with Dra. Ana for this specific food */}
            <div className="pt-4 border-t border-[#1A2E1A]/10 space-y-3">
              <h4 className="font-black text-xs uppercase tracking-wider text-[#2D6A4F]">
                Ficou com dúvida sobre o {activeFoodModal.name}?
              </h4>

              <form onSubmit={handleAskDraAboutFood} className="flex gap-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder={`Ex: "Posso comer ${activeFoodModal.name} à noite com Kizaca?"`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-xs text-[#1A2E1A] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20"
                />
                <button
                  type="submit"
                  disabled={!customQuestion.trim() || isAskingAI}
                  className="px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1A2E1A] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Perguntar</span>
                </button>
              </form>

              {isAskingAI && (
                <div className="p-3 rounded-xl bg-[#D8F3DC] text-xs text-[#1A2E1A] font-bold flex items-center gap-2 animate-pulse border border-[#2D6A4F]/30">
                  <Sparkles className="w-4 h-4 text-[#2D6A4F] animate-spin" />
                  <span>Dra. Ana está a analisar o prato e a formular a orientação...</span>
                </div>
              )}

              {aiAnswer && (
                <div className="p-4 rounded-2xl bg-[#D8F3DC]/50 border border-[#2D6A4F]/30 text-xs text-[#1A2E1A] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-black text-[#2D6A4F] uppercase tracking-wider">
                    <span>Dra. Ana Cária Responde 💚:</span>
                  </div>
                  <p className="leading-relaxed font-medium">{aiAnswer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
