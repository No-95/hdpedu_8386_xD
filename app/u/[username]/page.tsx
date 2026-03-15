"use client";

import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Edit2, Briefcase, BookOpen, Award } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useUser();
  const [editOpen, setEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    subjects: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [selectedBackground, setSelectedBackground] = useState<string>("");

  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateBackgroundImage = useMutation((api as any).users.updateBackgroundImage);
  const username = (params?.username as string) || "";

  // Only query the profile when we have a valid username
  // Skip the query entirely until we're ready to avoid premature "not found" states
  const profile = useQuery(
    api.profiles.getByUsername,
    username ? { username } : "skip"
  );
  const currentProfile = useQuery(api.profiles.getCurrentUserProfile, {});
  const availableBackgrounds = useQuery(
    (api as any).backgrounds.getAvailableBackgrounds,
    isAuthenticated ? {} : "skip"
  ) as string[] | undefined;
  
  // Determine if we're in a loading state
  // Show loading spinner while auth is loading or profile query is pending
  const isLoading = authLoading || profile === undefined;
  const updateProfileMutation = useMutation(api.profiles.updateProfile);

  const isOwnProfile =
    isAuthenticated &&
    currentProfile &&
    profile &&
    currentProfile.userId === profile.userId;

  // Initialize form data with profile data whenever profile changes
  // This ensures the form always reflects the latest database state
  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        subjects: (profile.subjects || []).join(", "),
      });
      setAvatarPreview(profile.avatarUrl || undefined);
      setSelectedBackground((profile as any).backgroundImage || "");
      // Only clear avatar file if dialog is being opened fresh
      if (editOpen) {
        setAvatarFile(null);
      }
    }
  }, [profile]);

  // Clear avatar file when dialog opens/closes
  useEffect(() => {
    if (editOpen) {
      setAvatarFile(null);
      setSelectedBackground(((profile as any)?.backgroundImage as string) || "");
    }
  }, [editOpen, profile]);

  const handleUpdateProfile = async () => {
    if (!profile) {
      console.error('update called but profile missing');
      toast.error('Cannot save: profile not loaded');
      return;
    }
    
    // Validate displayName is not empty
    if (!formData.displayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }

    setIsSaving(true);
    console.log('=== PROFILE UPDATE START ===');
    console.log('Form Data:', formData);
    console.log('Avatar File:', avatarFile);
    console.log('Current Profile:', profile);
    
    try {
      const subjectsArray = formData.subjects
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      let avatarId: string | undefined;
      if (avatarFile) {
        try {
          console.log("Starting avatar upload...");
          const uploadUrl = await generateUploadUrl();
          console.log("Got upload url:", uploadUrl);
          
          const resp = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": avatarFile.type },
            body: avatarFile,
          });
          
          console.log("Upload response status:", resp.status);
          if (!resp.ok) throw new Error("Avatar upload failed: " + resp.status);
          
          const json = await resp.json();
          console.log("Upload JSON response:", json);
          avatarId = json.storageId;
        } catch (e) {
          console.error("Avatar upload error, proceeding without avatar", e);
          // do not block the profile update
        }
      }

      console.log("Calling updateProfileMutation with:", {
        displayName: formData.displayName.trim(),
        bio: formData.bio.trim(),
        subjects: subjectsArray,
        avatarId,
      });

      // Await the mutation to ensure it completes before proceeding
      const result = await updateProfileMutation({
        displayName: formData.displayName.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        subjects: subjectsArray.length > 0 ? subjectsArray : undefined,
        avatarId: avatarId ? (avatarId as any) : undefined,
      });

      if (
        selectedBackground &&
        selectedBackground !== (((profile as any)?.backgroundImage as string | undefined) || "")
      ) {
        await updateBackgroundImage({ backgroundImage: selectedBackground });
      }
      
      console.log("Mutation result received:", result);

      if (!result) {
        throw new Error("Mutation returned no result");
      }

      console.log("Profile update successful!");
      
      // Show success toast message to confirm database acknowledged the change
      toast.success("Profile Updated");
      
      // Immediately close dialog and reset form
      setEditOpen(false);
      setFormData({ displayName: "", bio: "", subjects: "" });
      setAvatarFile(null);
      setAvatarPreview(undefined);
      setSelectedBackground("");
      
      // Force Next.js to clear server-side cache and show latest data
      router.refresh();
      
      console.log("=== PROFILE UPDATE COMPLETE ===");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      console.error("Error details:", {
        message: error?.message,
        stack: error?.stack,
        fullError: error,
      });
      toast.error("Failed to update profile: " + (error?.message || JSON.stringify(error)));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Profile</h2>
          <p className="text-slate-400">Please wait...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Not Found</h1>
          <p className="text-slate-400 mb-6">The profile does not exist.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Cover Banner */}
      <div className="h-48 relative overflow-hidden">
        {(profile as any).backgroundImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${(profile as any).backgroundImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Profile Header */}
      <div className="relative px-4 sm:px-6 lg:px-8 -mt-20 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <Avatar className="h-40 w-40 ring-4 ring-slate-800 border-4 border-white shadow-2xl flex-shrink-0">
              <AvatarImage src={profile?.avatarUrl || undefined} alt={profile.displayName} />
              <AvatarFallback className="text-5xl bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                {profile.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{profile.displayName}</h1>
              <p className="text-lg text-indigo-300 mb-4">@{profile.username}</p>
              {profile.role && (
                <Badge className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
                  <Briefcase className="w-3 h-3 mr-2" />
                  {profile.role}
                </Badge>
              )}
            </div>

            {isOwnProfile && (
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white whitespace-nowrap">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader className="border-b border-slate-700 pb-4">
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      Edit Your Professional Profile
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 mt-1">
                      Customize your profile and showcase your professional presence
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-6 px-4">
                    {/* Avatar Upload Section */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-xl p-6 border border-slate-600/50 backdrop-blur">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-28 w-28 ring-4 ring-indigo-500/30 border-2 border-indigo-400">
                            {avatarPreview ? (
                              <AvatarImage src={avatarPreview ?? undefined} alt="Avatar preview" />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-2xl font-bold text-white">
                                {profile.displayName[0] || "?"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 shadow-lg">
                            <Edit2 className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <Label htmlFor="avatar" className="text-sm font-semibold text-slate-200 block mb-3">
                            Profile Photo
                          </Label>
                          <p className="text-xs text-slate-500 mb-3">JPG, PNG or GIF (Max 5MB)</p>
                          <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setAvatarFile(file);
                              if (file) {
                                setAvatarPreview(URL.createObjectURL(file));
                              } else {
                                setAvatarPreview(profile.avatarUrl || undefined);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => document.getElementById("avatar")?.click()}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full"
                          >
                            Choose Photo
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields Section */}
                    <div className="space-y-4">
                      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                        <Label htmlFor="displayName" className="text-sm font-semibold text-slate-100 block mb-2">
                          Display Name
                        </Label>
                        <Input
                          id="displayName"
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                          placeholder="Enter your full name"
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/50"
                        />
                      </div>

                      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                        <Label htmlFor="bio" className="text-sm font-semibold text-slate-100 block mb-2">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Write a brief bio about yourself and your professional background..."
                          rows={3}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/50 resize-none"
                        />
                      </div>

                      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                        <Label htmlFor="subjects" className="text-sm font-semibold text-slate-100 block mb-2">
                          Interests & Skills
                        </Label>
                        <Textarea
                          id="subjects"
                          value={formData.subjects}
                          onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                          placeholder="e.g., Web Development, Korean Language, Business Strategy (comma-separated)"
                          rows={2}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/50 resize-none"
                        />
                        <p className="text-xs text-slate-500 mt-2">Separate multiple interests with commas</p>
                      </div>

                      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                        <Label className="text-sm font-semibold text-slate-100 block mb-3">
                          Profile Background
                        </Label>
                        <p className="text-xs text-slate-400 mb-3">
                          Select a background image for your profile cover.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {(availableBackgrounds || []).map((bgPath) => {
                            const active = selectedBackground === bgPath;
                            return (
                              <button
                                key={bgPath}
                                type="button"
                                onClick={() => setSelectedBackground(bgPath)}
                                className={`relative overflow-hidden rounded-lg border-2 transition-all h-20 bg-slate-700 ${
                                  active
                                    ? "border-indigo-400 ring-2 ring-indigo-400/60"
                                    : "border-slate-600 hover:border-indigo-300"
                                }`}
                                title={bgPath}
                              >
                                <div
                                  className="absolute inset-0 bg-cover bg-center"
                                  style={{ backgroundImage: `url(${bgPath})` }}
                                />
                                <div className={`absolute inset-0 ${active ? "bg-indigo-900/20" : "bg-black/25"}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-slate-700 pt-4 flex gap-3">
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={isSaving}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-all"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditOpen(false)}
                      disabled={isSaving}
                      className="bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-600 text-slate-200 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-700/50 backdrop-blur rounded-lg p-4 text-center border border-slate-600/50">
            <p className="text-3xl font-bold text-white">5</p>
            <p className="text-sm text-slate-400 mt-1">Projects</p>
          </div>
          <div className="bg-slate-700/50 backdrop-blur rounded-lg p-4 text-center border border-slate-600/50">
            <p className="text-3xl font-bold text-white">124</p>
            <p className="text-sm text-slate-400 mt-1">Followers</p>
          </div>
          <div className="bg-slate-700/50 backdrop-blur rounded-lg p-4 text-center border border-slate-600/50">
            <p className="text-3xl font-bold text-white">8</p>
            <p className="text-sm text-slate-400 mt-1">Achievements</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <Card className="border-slate-700 bg-slate-800/50 shadow-lg backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">{profile.bio || "No bio provided yet."}</p>
              </CardContent>
            </Card>

            {profile.subjects && profile.subjects.length > 0 && (
              <Card className="border-slate-700 bg-slate-800/50 shadow-lg backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Award className="w-5 h-5 text-indigo-400" />
                    Interests & Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.subjects.map((subject: string, idx: number) => (
                      <motion.div key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                        <Badge className="bg-indigo-600/80 text-indigo-100 border-indigo-500/50">{subject}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            <Card className="border-slate-700 bg-slate-800/50 shadow-lg backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  Student Projects
                </CardTitle>
                <CardDescription className="text-slate-400">Showcasing academic work and portfolio projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="rounded-lg border-2 border-dashed border-slate-600 bg-slate-700/30 p-12 text-center hover:border-indigo-400 transition-all">
                      <div className="p-3 rounded-full bg-indigo-600/20 mb-3 inline-block">
                        <Briefcase className="h-6 w-6 text-indigo-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-300">Project {i}</p>
                      <p className="text-xs text-slate-500 mt-1">Coming soon</p>
                    </motion.div>
                  ))}
                </div>

                {isOwnProfile && (
                  <div className="mt-6 p-4 bg-indigo-600/10 rounded-lg text-center border border-indigo-600/20">
                    <p className="text-sm text-indigo-300">💡 Edit your profile to add projects and showcase your work!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 shadow-lg backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Activity & Achievements</CardTitle>
                <CardDescription className="text-slate-400">Recent milestones and accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-3 pb-4 border-b border-slate-600 last:border-b-0">
                      <div className="p-2 rounded-full bg-indigo-600/20">
                        <Award className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">Achievement {i}</p>
                        <p className="text-sm text-slate-500">Coming soon</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {isOwnProfile && (
                  <div className="mt-4 p-3 bg-indigo-600/10 rounded text-center border border-indigo-600/20">
                    <p className="text-xs text-indigo-300">Achievements will appear as you complete courses and projects</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
