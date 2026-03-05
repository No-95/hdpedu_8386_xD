"use client";

import { useState } from "react";
import { useUser } from "@/lib/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Save, X } from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileCustomizer() {
  const { user, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user.name || "");
  
  // NEW: Store the actual File object for the upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Keep previewUrl just for the UI display
  const [previewUrl, setPreviewUrl] = useState(user.avatarUrl || "");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a local temporary URL for the preview (doesn't cause lag)
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      alert("Display name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      // PASS THE ACTUAL FILE: The context will handle the storage upload
      await updateProfile({
        displayName,
        avatarFile: selectedFile || undefined, 
      });
      setIsEditing(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user.name || "");
    setPreviewUrl(user.avatarUrl || "");
    setSelectedFile(null);
    setIsEditing(false);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white/20">
                {previewUrl ? (
                  <AvatarImage src={previewUrl || undefined} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-[#A62A26] text-white font-bold">
                    {getInitials(user.name || "User")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-lg font-semibold text-white">{user.name}</p>
                <p className="text-sm text-white/60">Click edit to customize</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#A62A26] hover:bg-[#8a2420] text-white px-4 py-2 rounded-md transition-colors"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Avatar
                </label>
                <Avatar className="h-20 w-20 border-2 border-white/20">
                  {previewUrl ? (
                    <AvatarImage src={previewUrl || undefined} alt="preview" />
                  ) : (
                    <AvatarFallback className="bg-[#A62A26] text-white font-bold">
                      {getInitials(displayName || "User")}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 cursor-pointer transition-colors text-white text-sm font-medium">
                  <Upload className="h-4 w-4" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                {previewUrl && (
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl("");
                    }}
                    className="mt-2 text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Display Name
              </label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#A62A26]"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-[#A62A26] hover:bg-[#8a2420] text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isLoading}
                variant="outline"
                className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
