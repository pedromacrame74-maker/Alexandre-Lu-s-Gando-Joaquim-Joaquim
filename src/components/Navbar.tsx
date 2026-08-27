import React from "react";
import {
  Video,
  BookOpen,
  UtensilsCrossed,
  Sparkles,
  User,
  Heart,
  Smartphone,
  Monitor,
  PlusCircle,
  Stethoscope,
  LogIn,
  MessageSquare,
} from "lucide-react";
import { UserProfile } from "../types";

export type NavTabType = "feed" | "library" | "meal_review" | "forum" | "scripts" | "profile";

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  currentUser: UserProfile;
  onOpenUpload: () => void;
  onOpenAuth: () => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  onSwitchProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenUpload,
  onOpenAuth,
  isMobileFrame,
  setIsMobileFrame,
  onSwitchProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F4F7F2]/90 backdrop-blur-lg border-b border-[#1A2E1A]/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div
            id="brand-logo-btn"
            onClick={() => setActiveTab("feed")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#1A2E1A] flex items-center justify-center text-white shadow-md shadow-[#1A2E1A]/20 group-hover:scale-105 transition-transform border border-[#2D6A4F]/30">
              <span className="font-black text-xl font-display tracking-tight text-[#D8F3DC]">AC</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-[#1A2E1A] font-display">
                  Dra. Ana Cária
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D8F3DC] text-[#1A2E1A] border border-[#2D6A4F]/30">
                  CRN-3 💚
                </span>
              </div>
              <p className="text-[11px] text-[#2D6A4F] font-bold uppercase tracking-wider -mt-0.5">
                Nutrição Clínica & Saúde
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1A2E1A]/5 p-1.5 rounded-2xl border border-[#1A2E1A]/10">
            <button
              id="nav-feed-btn"
              onClick={() => setActiveTab("feed")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "feed"
                  ? "bg-[#1A2E1A] text-white shadow-sm"
                  : "text-[#1A2E1A]/80 hover:text-[#1A2E1A] hover:bg-white/60"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Vídeos & Dicas</span>
            </button>

            <button
              id="nav-library-btn"
              onClick={() => setActiveTab("library")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "library"
                  ? "bg-[#1A2E1A] text-white shadow-sm"
                  : "text-[#1A2E1A]/80 hover:text-[#1A2E1A] hover:bg-white/60"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Pode ou Não Pode</span>
            </button>

            <button
              id="nav-forum-btn"
              onClick={() => setActiveTab("forum")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "forum"
                  ? "bg-[#1A2E1A] text-white shadow-sm"
                  : "text-[#1A2E1A]/80 hover:text-[#1A2E1A] hover:bg-white/60"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#2D6A4F]" />
              <span>Comunidade & Fórum</span>
            </button>

            <button
              id="nav-meal-btn"
              onClick={() => setActiveTab("meal_review")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "meal_review"
                  ? "bg-[#1A2E1A] text-white shadow-sm"
                  : "text-[#1A2E1A]/80 hover:text-[#1A2E1A] hover:bg-white/60"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Avaliar Prato</span>
            </button>

            {currentUser.role === "doctor" && (
              <button
                id="nav-scripts-btn"
                onClick={() => setActiveTab("scripts")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === "scripts"
                    ? "bg-[#1A2E1A] text-white shadow-sm"
                    : "text-[#1A2E1A]/80 hover:text-[#1A2E1A] hover:bg-white/60"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Roteiros IA</span>
              </button>
            )}

            <button
              id="nav-profile-btn"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "profile"
                  ? "bg-[#1A2E1A] text-white shadow-sm"
                  : "text-[#1A2E1A]/80 hover:text-[#1A2E1A] hover:bg-white/60"
              }`}
            >
              <User className="w-4 h-4" />
              <span>{currentUser.role === "doctor" ? "Consultório" : "Meu Perfil"}</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Viewport Frame Mode Toggle (Mobile / Full view) */}
            <button
              id="toggle-view-mode-btn"
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              title={isMobileFrame ? "Mudar para Visualização Expandida" : "Mudar para Visualização Mobile App"}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#1A2E1A]/15 text-[#1A2E1A] bg-white/80 hover:bg-white text-xs font-extrabold transition-colors shadow-xs"
            >
              {isMobileFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>Tela Cheia</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>Modo Celular</span>
                </>
              )}
            </button>

            {/* Post Video / Avaliar Button */}
            <button
              id="header-post-btn"
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1A2E1A] text-white text-xs sm:text-xs font-black uppercase tracking-wider shadow-md shadow-[#2D6A4F]/20 transition-all hover:scale-102 active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-[#D8F3DC]" />
              <span className="hidden sm:inline">
                {currentUser.role === "doctor" ? "Novo Vídeo" : "Postar Prato"}
              </span>
              <span className="sm:hidden">Postar</span>
            </button>

            {/* Profile Switcher Pill */}
            <div className="flex items-center gap-2 pl-1 border-l border-[#1A2E1A]/15">
              <button
                id="switch-profile-btn"
                onClick={onSwitchProfile}
                title={`Alternar Usuário (Atual: ${currentUser.name})`}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-white hover:bg-[#D8F3DC]/50 border border-[#1A2E1A]/15 text-[#1A2E1A] transition-all text-xs font-bold shadow-xs"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-2 ring-[#2D6A4F]"
                />
                <div className="hidden xl:block text-left">
                  <p className="font-extrabold leading-tight line-clamp-1">{currentUser.name}</p>
                  <p className="text-[10px] text-[#2D6A4F] font-black uppercase tracking-wider">
                    {currentUser.role === "doctor" ? "Dra. (Nutri)" : "Paciente"} • Trocar
                  </p>
                </div>
              </button>

              <button
                id="open-auth-modal-btn"
                onClick={onOpenAuth}
                className="p-2 rounded-xl text-[#1A2E1A] hover:bg-white border border-transparent hover:border-[#1A2E1A]/10 transition-colors"
                title="Opções de Conta & Login"
              >
                <LogIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F4F7F2]/95 backdrop-blur-md border-t border-[#1A2E1A]/10 px-2 py-2 flex items-center justify-around shadow-xl">
        <button
          id="mobile-nav-feed"
          onClick={() => setActiveTab("feed")}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-black uppercase tracking-wider transition-colors ${
            activeTab === "feed" ? "text-[#2D6A4F]" : "text-[#1A2E1A]/60"
          }`}
        >
          <Video className="w-5 h-5" />
          <span>Vídeos</span>
        </button>

        <button
          id="mobile-nav-library"
          onClick={() => setActiveTab("library")}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-black uppercase tracking-wider transition-colors ${
            activeTab === "library" ? "text-[#2D6A4F]" : "text-[#1A2E1A]/60"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Alimentos</span>
        </button>

        <button
          id="mobile-nav-forum"
          onClick={() => setActiveTab("forum")}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-black uppercase tracking-wider transition-colors ${
            activeTab === "forum" ? "text-[#2D6A4F]" : "text-[#1A2E1A]/60"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Fórum</span>
        </button>

        <button
          id="mobile-nav-meal"
          onClick={() => setActiveTab("meal_review")}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-black uppercase tracking-wider transition-colors ${
            activeTab === "meal_review" ? "text-[#2D6A4F]" : "text-[#1A2E1A]/60"
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span>Prato</span>
        </button>

        <button
          id="mobile-nav-profile"
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-black uppercase tracking-wider transition-colors ${
            activeTab === "profile" ? "text-[#2D6A4F]" : "text-[#1A2E1A]/60"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Perfil</span>
        </button>
      </div>
    </header>
  );
};

