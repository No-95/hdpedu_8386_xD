/**
 * PROFILE SYSTEM USAGE EXAMPLES
 * 
 * This file demonstrates how to use the profile system in your application.
 * You can reference this for implementing profile features in other parts of your app.
 */

// ============================================================================
// EXAMPLE 1: Display a user's profile card (in a component)
// ============================================================================

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ProfileCard({ username }: { username: string }) {
  const profile = useQuery(api.profiles.getByUsername, { username });

  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={profile.avatarUrl || undefined} />
          <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold">{profile.displayName}</h3>
          <p className="text-sm text-gray-600">@{profile.username}</p>
          {profile.subjects && (
            <div className="flex gap-1 mt-2">
              {profile.subjects.map((subject) => (
                <Badge key={subject} variant="outline" className="text-xs">
                  {subject}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="text-sm mt-4">{profile.bio}</p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Update profile with file upload (in a form component)
// ============================================================================

import { useMutation } from "convex/react";
import { useRef } from "react";

export function ProfileEditForm() {
  const updateProfile = useMutation(api.profiles.updateProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateWithAvatar = async (
    displayName: string,
    bio: string,
    subjects: string[],
    avatarFile?: File
  ) => {
    try {
      let avatarId = undefined;

      // Upload avatar if provided
      if (avatarFile) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": avatarFile.type },
          body: avatarFile,
        });
        
        if (!response.ok) throw new Error("Avatar upload failed");
        
        const { storageId } = await response.json();
        avatarId = storageId;
      }

      // Update profile
      const updatedProfile = await updateProfile({
        displayName,
        bio,
        subjects,
        avatarId,
      });

      console.log("Profile updated:", updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
      />
      {/* Your form JSX here */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Profile validation helpers
// ============================================================================

/**
 * Validate subjects array format
 */
export function validateSubjects(subjects: unknown): string[] | null {
  if (!Array.isArray(subjects)) {
    return null;
  }

  return subjects.every((s) => typeof s === "string") ? subjects : null;
}

/**
 * Parse comma-separated subjects string into array
 */
export function parseSubjects(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Example: Validate and update profile
 */
export async function validateAndUpdateProfile(
  displayName: string,
  bio: string,
  subjectsInput: string, // comma-separated string
  updateFn: (args: any) => Promise<any>
) {
  // Validate inputs
  if (!displayName || displayName.trim().length === 0) {
    throw new Error("Display name is required");
  }

  // Parse and validate subjects
  const subjects = parseSubjects(subjectsInput);
  if (subjects.length > 10) {
    throw new Error("Maximum 10 subjects allowed");
  }

  // Update profile
  return await updateFn({
    displayName: displayName.trim(),
    bio: bio.trim(),
    subjects,
  });
}

// ============================================================================
// EXAMPLE 4: Create a profile link component
// ============================================================================

import Link from "next/link";

export function ProfileLink({
  username,
  displayName,
  className,
}: {
  username: string;
  displayName: string;
  className?: string;
}) {
  return (
    <Link href={`/u/${username}`} className={className}>
      {displayName}
    </Link>
  );
}

// ============================================================================
// EXAMPLE 5: Search/List profiles by subject
// ============================================================================

/**
 * NOTE: This is a suggested future implementation.
 * You would need to add a Convex query for this.
 * 
 * Suggested Convex query:
 * 
 * export const findBySubject = query({
 *   args: { subject: v.string() },
 *   handler: async (ctx, args) => {
 *     return ctx.db
 *       .query("profiles")
 *       .filter(q => q.eq(q.field("subjects"), args.subject))
 *       .collect();
 *   }
 * });
 */

export interface ProfileWithSubjects {
  username: string;
  displayName: string;
  subjects: string[];
  avatarUrl?: string;
}

// ============================================================================
// EXAMPLE 6: Hook for profile operations
// ============================================================================

import { useState } from "react";

export function useProfileOps() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateProfile = useMutation(api.profiles.updateProfile);

  const updateUserProfile = async (data: {
    displayName?: string;
    bio?: string;
    subjects?: string[];
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateProfile(data);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserProfile,
    loading,
    error,
  };
}

// ============================================================================
// USAGE IN YOUR COMPONENTS
// ============================================================================

/*
// In a navbar or user menu:
import { ProfileLink } from "@/components/profile-link";

export function UserMenu({ username, displayName }) {
  return (
    <ProfileLink 
      username={username} 
      displayName={displayName}
      className="hover:underline"
    />
  );
}

// In a profile listing page:
import { ProfileCard } from "@/components/profile-card";

export function ProfilesList({ usernames }: { usernames: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {usernames.map(username => (
        <ProfileCard key={username} username={username} />
      ))}
    </div>
  );
}

// In an edit form:
import { useProfileOps } from "@/hooks/use-profile";

export function EditProfileForm() {
  const { updateUserProfile, loading, error } = useProfileOps();
  const [subjects, setSubjects] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateUserProfile({
        displayName: e.currentTarget.displayName.value,
        bio: e.currentTarget.bio.value,
        subjects: parseSubjects(subjects),
      });
      alert("Profile updated!");
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="displayName" required />
      <textarea name="bio" />
      <input 
        value={subjects} 
        onChange={(e) => setSubjects(e.target.value)}
        placeholder="React, TypeScript, Node.js"
      />
      <button disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
*/

export {};
