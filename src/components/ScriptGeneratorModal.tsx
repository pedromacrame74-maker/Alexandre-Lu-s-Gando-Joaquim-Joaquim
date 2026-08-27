import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Video,
  FileText,
  Copy,
  Check,
  Film,
  Camera,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  Tv,
} from "lucide-react";
import { VideoScript } from "../types";

interface ScriptGeneratorModalProps {
  onClose: () => void;
  onApplyScriptToNewVideo?: (script: VideoScript) => void;
}

export const ScriptGeneratorModal: React.FC<ScriptGeneratorModalProps> = ({
  onClose,
  onApplyScriptToNewVideo,
}) => {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Diabetes & Glicose");
  const [duration, setDuration] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null);
  const [copied, setCopied] = useState(false);

  // Teleprompter state
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [fontSize, setFontSize] = useState(28);
  const prompterRef = useRef<HTMLDivElement>(null);

  const presets = [
    { label: "3 Lanches sem pico de glicose", cat: "Diabetes" },
    { label: "Banana engorda ou faz mal pra diabetes?", cat: "Mito ou Verdade" },
    { label: "Como temperar com Sal de Ervas na Hipertensão", cat: "Hipertensão" },
    { label: "Arroz branco resfriado: o segredo do amido", cat: "Emagrecimento" },
    { label: "Lanches práticos para a lancheira das crianças", cat: "Crianças" },
  ];

  const handleGenerate = async (presetTopic?: string, presetCat?: string) => {
    const activeTopic = presetTopic || topic || "Dica de nutrição para glicose e pressão";
    const activeCat = presetCat || category;

    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: activeTopic,
          category: activeCat,
          durationSeconds: duration,
        }),
      });
      const data = await res.json();
      if (data.script) {
        setGeneratedScript(data.script);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Teleprompter smooth scrolling loop
  useEffect(() => {
    let animationFrameId: number;
    const scrollStep = () => {
      if (isScrolling && prompterRef.current) {
        prompterRef.current.scrollTop += scrollSpeed * 0.5;
      }
      if (isScrolling) {
        animationFrameId = requestAnimationFrame(scrollStep);
      }
    };

    if (isScrolling) {
      animationFrameId = requestAnimationFrame(scrollStep);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isScrolling, scrollSpeed]);

  const copyScriptText = () => {
    if (!generatedScript) return;
    const fullText = `🎬 ROTEIRO OFICIAL - DRA. ANA CÁRIA 💚\nTÍTULO: ${generatedScript.title}\n\n[0-3s GANCHO]: ${generatedScript.hook}\n\n[DESENVOLVIMENTO]: ${generatedScript.development}\n\n[CHAMADA PARA AÇÃO]: ${generatedScript.callToAction}\n\nLEGENDA: ${generatedScript.caption}\nHASHTAGS: ${generatedScript.hashtags.join(" ")}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-[#1A2E1A]/10 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A2E1A]/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1A2E1A] font-display tracking-tight">
                Gerador de Roteiros com IA 🎥
              </h2>
              <p className="text-xs text-[#2D6A4F] font-bold">
                Ideias prontas para a Dra. Ana Cária gravar vídeos rápidos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-[#1A2E1A]/40 hover:text-[#1A2E1A] bg-[#F4F7F2]"
          >
            ✕
          </button>
        </div>

        {/* Input parameters */}
        <div className="space-y-4">
          {/* Presets */}
          <div>
            <label className="block text-xs font-black text-[#1A2E1A] uppercase tracking-wider mb-2">
              Sugestões Rápidas de Temas em Alta:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setTopic(p.label);
                    setCategory(p.cat);
                    handleGenerate(p.label, p.cat);
                  }}
                  className="px-3.5 py-1.5 rounded-2xl bg-[#F4F7F2] hover:bg-[#D8F3DC]/60 border border-[#1A2E1A]/10 text-xs font-bold text-[#1A2E1A] transition-colors text-left"
                >
                  ⚡ {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom topic */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
                Tema do Vídeo
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Como comer doce sem subir a glicose..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-xs text-[#1A2E1A] focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
                Duração
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-xs font-bold text-[#1A2E1A]"
              >
                <option value={20}>20s (Mito/Verdade)</option>
                <option value={30}>30s (Dica do Dia)</option>
                <option value={45}>45s (Receita Rápida)</option>
                <option value={60}>60s (Aprofundado)</option>
              </select>
            </div>
          </div>

          {/* Action Generate Button */}
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-[#2D6A4F] hover:bg-[#1A2E1A] disabled:opacity-50 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#2D6A4F]/20 transition-all hover:scale-101"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Criando roteiro com inteligência clínica...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Gerar Roteiro Completo com IA</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Script Card */}
        {generatedScript && (
          <div className="bg-[#1A2E1A] text-white p-6 rounded-3xl space-y-4 shadow-xl border border-[#2D6A4F]/40">
            <div className="flex items-center justify-between border-b border-[#2D6A4F]/40 pb-3">
              <div>
                <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                  Roteiro Aprovado
                </span>
                <h3 className="text-base font-black text-white font-display">
                  {generatedScript.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyScriptText}
                  className="px-3.5 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors text-[#D8F3DC]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#52B788]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copiado!" : "Copiar"}</span>
                </button>

                <button
                  onClick={() => setIsTeleprompterOpen(true)}
                  className="px-3.5 py-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Teleprompter 🎬</span>
                </button>
              </div>
            </div>

            {/* Hook */}
            <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-xs space-y-1">
              <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                🔥 Gancho Inicial (0 a 3 segundos):
              </span>
              <p className="font-bold text-white leading-relaxed">
                "{generatedScript.hook}"
              </p>
            </div>

            {/* Development */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
              <span className="text-[10px] uppercase font-black text-[#52B788] tracking-wider">
                💡 Fala & Conteúdo Principal (15 a 20s):
              </span>
              <p className="text-[#D8F3DC]/90 leading-relaxed font-medium">
                {generatedScript.development}
              </p>
            </div>

            {/* Visual cues */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-black text-[#D8F3DC]/70 tracking-wider">
                Direção de Gravação & Câmera:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                {generatedScript.visualCues.map((cue, idx) => (
                  <div key={idx} className="p-2.5 rounded-2xl bg-black/30 border border-white/10 font-medium">
                    {cue}
                  </div>
                ))}
              </div>
            </div>

            {/* Call to action */}
            <div className="p-3.5 rounded-2xl bg-teal-900/40 border border-teal-500/30 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 block">
                🎯 Chamada Final (CTA):
              </span>
              <p className="text-white font-medium italic">"{generatedScript.callToAction}"</p>
            </div>

            {/* Turn into App Video */}
            {onApplyScriptToNewVideo && (
              <button
                onClick={() => {
                  onApplyScriptToNewVideo(generatedScript);
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-[#2D6A4F] hover:bg-[#52B788] hover:text-[#1A2E1A] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Film className="w-4 h-4" />
                <span>Transformar Roteiro em Novo Vídeo no Feed</span>
              </button>
            )}
          </div>
        )}

        {/* Teleprompter Full Overlay Modal */}
        {isTeleprompterOpen && generatedScript && (
          <div className="fixed inset-0 bg-[#0d170d] z-50 flex flex-col p-6 text-white animate-fadeIn">
            {/* Prompter Controls Header */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-black text-sm font-mono tracking-wider">MODO GRAVAÇÃO / TELEPROMPTER</span>
              </div>

              {/* Speed & Font Size */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold">Velocidade:</span>
                  {[1, 2, 3, 4].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setScrollSpeed(spd)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                        scrollSpeed === spd ? "bg-[#52B788] text-black" : "bg-white/20 text-white"
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold">Tamanho:</span>
                  <button
                    onClick={() => setFontSize(Math.max(20, fontSize - 4))}
                    className="px-2.5 py-1 bg-white/20 rounded-xl font-black"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize(Math.min(48, fontSize + 4))}
                    className="px-2.5 py-1 bg-white/20 rounded-xl font-black"
                  >
                    A+
                  </button>
                </div>

                <button
                  onClick={() => setIsTeleprompterOpen(false)}
                  className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-2xl text-xs font-black uppercase tracking-wider"
                >
                  Sair ✕
                </button>
              </div>
            </div>

            {/* Scrollable Prompter Area */}
            <div
              ref={prompterRef}
              className="flex-1 overflow-y-auto py-12 px-8 max-w-4xl mx-auto w-full text-center space-y-12 select-none scrollbar-none"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
            >
              <div className="opacity-40 text-sm tracking-widest uppercase font-mono">
                — OLHE DIRETAMENTE PARA A LENTE DA CÂMERA —
              </div>

              <div className="text-amber-300 font-black drop-shadow-md">
                "{generatedScript.hook}"
              </div>

              <div className="text-white font-semibold">
                {generatedScript.development}
              </div>

              <div className="text-[#52B788] font-black">
                "{generatedScript.callToAction}"
              </div>

              <div className="opacity-40 text-sm tracking-widest uppercase font-mono pb-24">
                — FIM DO VÍDEO (SORRISO FINAL E ACOLHEDOR 💚) —
              </div>
            </div>

            {/* Bottom floating control bar */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/20">
              <button
                onClick={() => {
                  if (prompterRef.current) prompterRef.current.scrollTop = 0;
                  setIsScrolling(false);
                }}
                className="p-3.5 bg-white/20 hover:bg-white/30 rounded-2xl"
                title="Recomeçar do Topo"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsScrolling(!isScrolling)}
                className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl ${
                  isScrolling
                    ? "bg-rose-500 text-white shadow-rose-500/30"
                    : "bg-[#52B788] text-black shadow-[#52B788]/30"
                }`}
              >
                {isScrolling ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pausar Leitura</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Iniciar Rolagem Automática</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
