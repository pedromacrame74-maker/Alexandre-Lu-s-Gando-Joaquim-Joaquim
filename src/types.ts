export type CategoryType =
  | "todos"
  | "dica_do_dia"
  | "diabetes"
  | "hipertensao"
  | "emagrecimento"
  | "mito_ou_verdade"
  | "receitas_rapidas"
  | "criancas"
  | "respostas";

export type FoodStatus = "pode" | "moderacao" | "evitar";
export type GlycemicIndex = "baixo" | "medio" | "alto";

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
  likesCount: number;
  isDraReply?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  category: CategoryType;
  categoryLabel: string;
  author: {
    name: string;
    title: string;
    avatar: string;
    verified: boolean;
  };
  thumbnailUrl: string;
  videoType: "animated_canvas" | "embed_sample" | "user_upload";
  bgGradient: string;
  themeColor: string;
  visualScene: {
    title: string;
    subtitle: string;
    iconName: string;
    steps: { time: number; text: string; highlight?: boolean }[];
    badge: string;
  };
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isOfflineDownloaded?: boolean;
  viewsCount: number;
  transcript: string;
  caption: string;
  hashtags: string[];
  comments: Comment[];
  publishedAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  scientificName?: string;
  category: "carboidratos" | "frutas" | "proteinas" | "vegetais" | "gorduras" | "bebidas" | "doces_lanches" | "pratos_tipicos";
  status: FoodStatus;
  glycemicIndex: GlycemicIndex;
  glycemicValue?: number;
  sodiumMg: number;
  caloriesPer100g: number;
  fiberGrams: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams?: number;
  mainNutrients?: string[];
  keyBenefits?: string[];
  isAngolanOrigin?: boolean;
  originRegion?: string;
  summaryReason: string;
  draTip: string;
  howToConsume: string[];
  healthyAlternatives?: string[];
  badgeColor: string;
  imageUrl: string;
  recommendedFor: {
    diabetes: "ótimo" | "atenção" | "evitar";
    hipertensao: "ótimo" | "atenção" | "evitar";
    emagrecimento: "ótimo" | "atenção" | "evitar";
    ganho_muscular?: "ótimo" | "atenção" | "evitar";
    criancas?: "ótimo" | "atenção" | "evitar";
    idosos?: "ótimo" | "atenção" | "evitar";
    desporto?: "ótimo" | "atenção" | "evitar";
    renal?: "ótimo" | "atenção" | "evitar";
  };
}

export interface MealPlateReview {
  id: string;
  patientName: string;
  patientAvatar?: string;
  createdAt: string;
  mealType: "Café da Manhã" | "Almoço" | "Lanche da Tarde" | "Jantar" | "Ceia";
  mealDescription: string;
  photoUrl?: string;
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  glycemicImpact: string;
  sodiumImpact: string;
  draTip: string;
}

export interface VideoScript {
  title: string;
  hook: string;
  development: string;
  callToAction: string;
  caption: string;
  hashtags: string[];
  visualCues: string[];
}

export type ForumCategory =
  | "todos"
  | "diabetes"
  | "hipertensao"
  | "emagrecimento"
  | "duvidas_pratos"
  | "receitas"
  | "exames_suplementos"
  | "avisos";

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: "doctor" | "patient";
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  isOfficialDoctorReply?: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: ForumCategory;
  categoryLabel: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: "doctor" | "patient";
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  hasDoctorReply?: boolean;
  tags: string[];
  replies: ForumReply[];
  viewsCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "doctor" | "patient";
  avatar: string;
  bio?: string;
  specialtyOrGoal: string;
  healthConditions?: string[];
  dietaryPreferences?: string[];
  joinedDate?: string;
  savedVideoIds: string[];
  savedFoodIds: string[];
  offlineVideoIds: string[];
}

