import React, { useState } from "react";
import { Navbar, NavTabType } from "./components/Navbar";
import { VideoFeed } from "./components/VideoFeed";
import { FoodLibrary } from "./components/FoodLibrary";
import { MealReviewModal } from "./components/MealReviewModal";
import { ScriptGeneratorModal } from "./components/ScriptGeneratorModal";
import { VideoUploadModal } from "./components/VideoUploadModal";
import { DoctorProfile } from "./components/DoctorProfile";
import { PatientProfile } from "./components/PatientProfile";
import { CommunityForum } from "./components/CommunityForum";
import { AuthModal } from "./components/AuthModal";
import {
  INITIAL_DOCTOR_PROFILE,
  INITIAL_PATIENT_PROFILE,
  INITIAL_VIDEOS,
  INITIAL_FOOD_ITEMS,
  INITIAL_MEAL_REVIEWS,
  INITIAL_FORUM_POSTS,
} from "./data/mockData";
import {
  VideoItem,
  FoodItem,
  MealPlateReview,
  UserProfile,
  VideoScript,
  ForumPost,
  ForumReply,
} from "./types";
import { Smartphone, Monitor } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>("feed");

  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_PATIENT_PROFILE);
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [foods, setFoods] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [mealReviews, setMealReviews] = useState<MealPlateReview[]>(INITIAL_MEAL_REVIEWS);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);

  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Like video handler
  const handleToggleLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isLiked = !v.isLiked;
          return {
            ...v,
            isLiked,
            likesCount: isLiked ? v.likesCount + 1 : Math.max(0, v.likesCount - 1),
          };
        }
        return v;
      })
    );
  };

  // Save video to profile bookmarks
  const handleToggleSaveVideo = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, isSaved: !v.isSaved } : v))
    );

    setCurrentUser((prev) => {
      const exists = prev.savedVideoIds.includes(videoId);
      return {
        ...prev,
        savedVideoIds: exists
          ? prev.savedVideoIds.filter((id) => id !== videoId)
          : [...prev.savedVideoIds, videoId],
      };
    });
  };

  // Download for offline toggle
  const handleToggleOffline = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId ? { ...v, isOfflineDownloaded: !v.isOfflineDownloaded } : v
      )
    );

    setCurrentUser((prev) => {
      const exists = prev.offlineVideoIds.includes(videoId);
      return {
        ...prev,
        offlineVideoIds: exists
          ? prev.offlineVideoIds.filter((id) => id !== videoId)
          : [...prev.offlineVideoIds, videoId],
      };
    });
  };

  // Add comment to video
  const handleAddComment = (videoId: string, commentText: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isDra = currentUser.role === "doctor" || commentText.startsWith("Dra. Ana");
          const newComment = {
            id: `cmt-${Date.now()}`,
            authorName: isDra ? "Dra. Ana Cária" : currentUser.name,
            authorAvatar: isDra ? INITIAL_DOCTOR_PROFILE.avatar : currentUser.avatar,
            text: commentText.replace(/^Dra\. Ana Cária 💚:\s*/, ""),
            createdAt: "Agora mesmo",
            likesCount: 1,
            isDraReply: isDra,
          };
          return {
            ...v,
            comments: [...v.comments, newComment],
          };
        }
        return v;
      })
    );
  };

  // Save food to favorites
  const handleToggleSaveFood = (foodId: string) => {
    setCurrentUser((prev) => {
      const exists = prev.savedFoodIds.includes(foodId);
      return {
        ...prev,
        savedFoodIds: exists
          ? prev.savedFoodIds.filter((id) => id !== foodId)
          : [...prev.savedFoodIds, foodId],
      };
    });
  };

  // Publish new video
  const handlePublishVideo = (newVideo: VideoItem) => {
    setVideos((prev) => [newVideo, ...prev]);
    setActiveTab("feed");
  };

  // Apply generated script to a new video in feed
  const handleApplyScriptToNewVideo = (script: VideoScript) => {
    const newVideo: VideoItem = {
      id: `vid-${Date.now()}`,
      title: script.title,
      description: script.caption,
      durationSeconds: 30,
      category: "dica_do_dia",
      categoryLabel: "Dica do Dia",
      author: {
        name: "Dra. Ana Cária",
        title: "Nutricionista Clínica",
        avatar: INITIAL_DOCTOR_PROFILE.avatar,
        verified: true,
      },
      thumbnailUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80",
      videoType: "animated_canvas",
      bgGradient: "from-emerald-950 via-teal-900 to-slate-950",
      themeColor: "emerald",
      visualScene: {
        title: script.title,
        subtitle: "Dica Rápida da Dra. Ana Cária",
        iconName: "Zap",
        steps: [
          { time: 0, text: script.hook, highlight: true },
          { time: 10, text: script.development, highlight: false },
          { time: 24, text: script.callToAction, highlight: true },
        ],
        badge: "Vídeo Gerado com IA",
      },
      likesCount: 1,
      isLiked: true,
      viewsCount: 1,
      transcript: `${script.hook} ${script.development} ${script.callToAction}`,
      caption: script.caption,
      hashtags: script.hashtags,
      comments: [],
      publishedAt: "Agora mesmo",
    };

    setVideos((prev) => [newVideo, ...prev]);
    setActiveTab("feed");
  };

  // Add meal plate review
  const handleAddReview = (newReview: MealPlateReview) => {
    setMealReviews((prev) => [newReview, ...prev]);
  };

  // Update user profile (username, avatar, bio, conditions, dietary preferences)
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Switch between doctor and patient role
  const handleSwitchProfile = () => {
    if (currentUser.role === "doctor") {
      setCurrentUser(INITIAL_PATIENT_PROFILE);
    } else {
      setCurrentUser(INITIAL_DOCTOR_PROFILE);
    }
  };

  // Forum Handlers
  const handleAddForumPost = (newPost: ForumPost) => {
    setForumPosts((prev) => [newPost, ...prev]);
  };

  const handleAddForumReply = (postId: string, reply: ForumReply) => {
    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const hasDoc = post.hasDoctorReply || reply.isOfficialDoctorReply;
          return {
            ...post,
            hasDoctorReply: hasDoc,
            replies: [...post.replies, reply],
          };
        }
        return post;
      })
    );
  };

  const handleToggleLikeForumPost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );
  };

  const handleToggleLikeForumReply = (postId: string, replyId: string) => {
    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: post.replies.map((reply) => {
              if (reply.id === replyId) {
                const isLiked = !reply.isLiked;
                return {
                  ...reply,
                  isLiked,
                  likesCount: isLiked ? reply.likesCount + 1 : Math.max(0, reply.likesCount - 1),
                };
              }
              return reply;
            }),
          };
        }
        return post;
      })
    );
  };

  const handleTogglePinPost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, isPinned: !post.isPinned } : post))
    );
  };

  const handleToggleLockPost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, isLocked: !post.isLocked } : post))
    );
  };

  const handleDeleteForumPost = (postId: string) => {
    setForumPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const handleDeleteForumReply = (postId: string, replyId: string) => {
    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const remainingReplies = post.replies.filter((r) => r.id !== replyId);
          const stillHasDoc = remainingReplies.some((r) => r.isOfficialDoctorReply);
          return {
            ...post,
            hasDoctorReply: stillHasDoc,
            replies: remainingReplies,
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F7F2] text-[#1A2E1A] flex flex-col font-sans selection:bg-[#D8F3DC] selection:text-[#1A2E1A]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        onSwitchProfile={handleSwitchProfile}
      />

      {/* Main Content Area (supports Responsive or Mobile Phone Frame Preview Mode) */}
      <main className="flex-1 pb-20 md:pb-10">
        {isMobileFrame ? (
          /* Mobile Device Frame Container Simulation */
          <div className="py-6 px-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-3 text-xs text-[#1A2E1A]/70 font-bold uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-[#2D6A4F]" />
              <span>Simulação: Visualização em Tela de Smartphone</span>
              <button
                onClick={() => setIsMobileFrame(false)}
                className="underline text-[#2D6A4F] hover:text-[#1A2E1A] ml-2 font-extrabold"
              >
                Voltar para Tela Cheia
              </button>
            </div>

            <div className="w-full max-w-sm sm:max-w-md h-[820px] bg-[#F4F7F2] rounded-[44px] shadow-2xl border-[10px] border-[#1A2E1A] overflow-hidden flex flex-col relative ring-1 ring-black/10">
              {/* Notch */}
              <div className="w-36 h-5 bg-[#1A2E1A] rounded-b-2xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1A2E1A]/80 mr-2" />
                <span className="w-2 h-2 rounded-full bg-[#2D6A4F]" />
              </div>

              {/* Scrollable Screen Body */}
              <div className="flex-1 overflow-y-auto pt-6 scrollbar-none">
                {activeTab === "feed" && (
                  <VideoFeed
                    videos={videos}
                    onToggleLike={handleToggleLike}
                    onToggleSave={handleToggleSaveVideo}
                    onToggleOffline={handleToggleOffline}
                    onAddComment={handleAddComment}
                    onOpenUpload={() => setIsUploadModalOpen(true)}
                    onOpenScriptGenerator={() => setIsScriptModalOpen(true)}
                  />
                )}

                {activeTab === "library" && (
                  <FoodLibrary
                    foods={foods}
                    savedFoodIds={currentUser.savedFoodIds}
                    onToggleSaveFood={handleToggleSaveFood}
                  />
                )}

                {activeTab === "forum" && (
                  <CommunityForum
                    posts={forumPosts}
                    currentUser={currentUser}
                    onAddPost={handleAddForumPost}
                    onAddReply={handleAddForumReply}
                    onToggleLikePost={handleToggleLikeForumPost}
                    onToggleLikeReply={handleToggleLikeForumReply}
                    onTogglePinPost={handleTogglePinPost}
                    onToggleLockPost={handleToggleLockPost}
                    onDeletePost={handleDeleteForumPost}
                    onDeleteReply={handleDeleteForumReply}
                  />
                )}

                {activeTab === "meal_review" && (
                  <MealReviewModal
                    reviews={mealReviews}
                    onAddReview={handleAddReview}
                    currentUser={currentUser}
                  />
                )}

                {activeTab === "scripts" && (
                  <div className="p-4">
                    <ScriptGeneratorModal
                      onClose={() => setActiveTab("feed")}
                      onApplyScriptToNewVideo={handleApplyScriptToNewVideo}
                    />
                  </div>
                )}

                {activeTab === "profile" && (
                  currentUser.role === "doctor" ? (
                    <DoctorProfile
                      currentUser={currentUser}
                      videos={videos}
                      foods={foods}
                      onOpenUpload={() => setIsUploadModalOpen(true)}
                      onOpenScriptGenerator={() => setIsScriptModalOpen(true)}
                      onSelectVideo={() => setActiveTab("feed")}
                    />
                  ) : (
                    <PatientProfile
                      currentUser={currentUser}
                      onUpdateProfile={handleUpdateProfile}
                      videos={videos}
                      foods={foods}
                      mealReviews={mealReviews}
                      forumPosts={forumPosts}
                      onSelectVideo={() => setActiveTab("feed")}
                      onSelectForumPost={() => setActiveTab("forum")}
                      onToggleSaveVideo={handleToggleSaveVideo}
                      onToggleSaveFood={handleToggleSaveFood}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Normal Responsive Layout */
          <div>
            {activeTab === "feed" && (
              <VideoFeed
                videos={videos}
                onToggleLike={handleToggleLike}
                onToggleSave={handleToggleSaveVideo}
                onToggleOffline={handleToggleOffline}
                onAddComment={handleAddComment}
                onOpenUpload={() => setIsUploadModalOpen(true)}
                onOpenScriptGenerator={() => setIsScriptModalOpen(true)}
              />
            )}

            {activeTab === "library" && (
              <FoodLibrary
                foods={foods}
                savedFoodIds={currentUser.savedFoodIds}
                onToggleSaveFood={handleToggleSaveFood}
              />
            )}

            {activeTab === "forum" && (
              <CommunityForum
                posts={forumPosts}
                currentUser={currentUser}
                onAddPost={handleAddForumPost}
                onAddReply={handleAddForumReply}
                onToggleLikePost={handleToggleLikeForumPost}
                onToggleLikeReply={handleToggleLikeForumReply}
                onTogglePinPost={handleTogglePinPost}
                onToggleLockPost={handleToggleLockPost}
                onDeletePost={handleDeleteForumPost}
                onDeleteReply={handleDeleteForumReply}
              />
            )}

            {activeTab === "meal_review" && (
              <MealReviewModal
                reviews={mealReviews}
                onAddReview={handleAddReview}
                currentUser={currentUser}
              />
            )}

            {activeTab === "scripts" && (
              <div className="max-w-4xl mx-auto px-4 py-6">
                <ScriptGeneratorModal
                  onClose={() => setActiveTab("feed")}
                  onApplyScriptToNewVideo={handleApplyScriptToNewVideo}
                />
              </div>
            )}

            {activeTab === "profile" && (
              currentUser.role === "doctor" ? (
                <DoctorProfile
                  currentUser={currentUser}
                  videos={videos}
                  foods={foods}
                  onOpenUpload={() => setIsUploadModalOpen(true)}
                  onOpenScriptGenerator={() => setIsScriptModalOpen(true)}
                  onSelectVideo={() => setActiveTab("feed")}
                />
              ) : (
                <PatientProfile
                  currentUser={currentUser}
                  onUpdateProfile={handleUpdateProfile}
                  videos={videos}
                  foods={foods}
                  mealReviews={mealReviews}
                  forumPosts={forumPosts}
                  onSelectVideo={() => setActiveTab("feed")}
                  onSelectForumPost={() => setActiveTab("forum")}
                  onToggleSaveVideo={handleToggleSaveVideo}
                  onToggleSaveFood={handleToggleSaveFood}
                />
              )
            )}
          </div>
        )}
      </main>

      {/* Floating Upload Modal */}
      {isUploadModalOpen && (
        <VideoUploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onPublishVideo={handlePublishVideo}
          currentUser={currentUser}
        />
      )}

      {/* Floating Script Generator Modal */}
      {isScriptModalOpen && (
        <ScriptGeneratorModal
          onClose={() => setIsScriptModalOpen(false)}
          onApplyScriptToNewVideo={handleApplyScriptToNewVideo}
        />
      )}

      {/* Floating Authentication & Profile Switcher Modal */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={currentUser}
          onSelectUser={(user) => setCurrentUser(user)}
        />
      )}
    </div>
  );
}

