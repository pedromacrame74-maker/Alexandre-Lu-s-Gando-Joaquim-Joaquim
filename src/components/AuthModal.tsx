import React, { useState } from "react";
import {
  LogIn,
  Mail,
  Lock,
  UserCheck,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { UserProfile } from "../types";
import { INITIAL_DOCTOR_PROFILE, INITIAL_PATIENT_PROFILE } from "../data/mockData";

interface AuthModalProps {
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  currentUser,
  onSelectUser,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const userHandle = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") || "paciente";
    const loggedUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0] || "Paciente",
      username: userHandle,
      email,
      role: email.toLowerCase().includes("ana") || email.toLowerCase().includes("dra") ? "doctor" : "patient",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      bio: "Paciente focado em reeducação alimentar e equilíbrio glicêmico.",
      specialtyOrGoal: "Foco: Reeducação Alimentar & Saúde",
      healthConditions: ["Prevenção & Saúde Geral"],
      dietaryPreferences: ["Comida de Verdade"],
      joinedDate: "Membro Recente",
      savedVideoIds: ["v1", "v2"],
      savedFoodIds: ["f1", "f2"],
      offlineVideoIds: ["v1"],
    };

    onSelectUser(loggedUser);
    setIsLoginSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleQuickSelect = (user: UserProfile) => {
    onSelectUser(user);
    setIsLoginSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#1A2E1A]/15 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#1A2E1A] flex items-center justify-center text-[#D8F3DC] font-black text-xl font-display mx-auto shadow-lg shadow-[#1A2E1A]/20 border border-[#2D6A4F]/40">
            AC
          </div>
          <h2 className="text-2xl font-black text-[#1A2E1A] font-display tracking-tight">
            Acessar o App Dra. Ana Cária
          </h2>
          <p className="text-xs text-[#1A2E1A]/70 font-medium">
            Entre na sua conta para salvar dicas, favoritos e acompanhar pratos
          </p>
        </div>

        {/* Quick Profile Switching Switcher Box */}
        <div className="p-4 bg-[#F4F7F2] rounded-2xl border border-[#1A2E1A]/10 space-y-2.5">
          <span className="text-[11px] font-black text-[#1A2E1A] uppercase tracking-wider block">
            ⚡ Acesso Rápido de Teste:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickSelect(INITIAL_DOCTOR_PROFILE)}
              className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                currentUser.role === "doctor"
                  ? "bg-[#1A2E1A] text-white border-[#1A2E1A] shadow-sm"
                  : "bg-white text-[#1A2E1A] border-[#1A2E1A]/10 hover:bg-[#D8F3DC]/40"
              }`}
            >
              <div className="flex items-center gap-1.5 font-black text-xs font-display">
                <Stethoscope className="w-4 h-4 text-[#52B788]" />
                <span>Dra. Ana Cária</span>
              </div>
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Perfil Nutricionista</span>
            </button>

            <button
              onClick={() => handleQuickSelect(INITIAL_PATIENT_PROFILE)}
              className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                currentUser.role === "patient"
                  ? "bg-[#1A2E1A] text-white border-[#1A2E1A] shadow-sm"
                  : "bg-white text-[#1A2E1A] border-[#1A2E1A]/10 hover:bg-[#D8F3DC]/40"
              }`}
            >
              <div className="flex items-center gap-1.5 font-black text-xs font-display">
                <UserCheck className="w-4 h-4 text-[#52B788]" />
                <span>Maria Silva</span>
              </div>
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Perfil Paciente</span>
            </button>
          </div>
        </div>

        {/* Social Logins: Google, Apple */}
        <div className="space-y-2.5">
          <button
            onClick={() => handleQuickSelect(INITIAL_PATIENT_PROFILE)}
            className="w-full py-3 px-4 rounded-2xl border border-[#1A2E1A]/15 bg-white hover:bg-[#F4F7F2] text-[#1A2E1A] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>

          <button
            onClick={() => handleQuickSelect(INITIAL_PATIENT_PROFILE)}
            className="w-full py-3 px-4 rounded-2xl border border-[#1A2E1A] bg-[#1A2E1A] text-white hover:bg-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.64 1.35-.56.65-1.06 1.71-.93 2.73 1.01.08 2.02-.51 2.64-1.23z" />
            </svg>
            <span>Continuar com Apple</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#1A2E1A]/40 font-bold uppercase tracking-wider">
          <div className="flex-1 h-px bg-[#1A2E1A]/10" />
          <span>ou com seu E-mail</span>
          <div className="flex-1 h-px bg-[#1A2E1A]/10" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1A2E1A]/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-black text-[#1A2E1A] uppercase tracking-wider mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1A2E1A]/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F4F7F2] border border-[#1A2E1A]/15 text-[#1A2E1A] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#2D6A4F] hover:bg-[#1A2E1A] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#2D6A4F]/20 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar com E-mail</span>
          </button>
        </form>

        {isLoginSuccess && (
          <div className="p-3.5 bg-[#D8F3DC] border border-[#2D6A4F]/40 rounded-2xl text-[#1A2E1A] text-xs font-black flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
            <span>Login efetuado com sucesso!</span>
          </div>
        )}
      </div>
    </div>
  );
};
