"use client";

import { useUser } from "@stackframe/stack";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountPage() {
  const user = useUser();
  const [imageError, setImageError] = useState(false);

  console.log("Account Page - User Debug:", {
    user: user,
    hasUser: !!user,
    profileImageUrl: user?.profileImageUrl,
    displayName: user?.displayName
  });

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <p>Please sign in to access your account settings.</p>
      </div>
    );
  }

  // Use proxy for external URLs, direct path for local placeholder
  const avatarSrc = user.profileImageUrl 
    ? `/api/proxy/image?url=${encodeURIComponent(user.profileImageUrl)}`
    : "/placeholder-user.jpg";

  console.log("Account Page - Avatar src:", avatarSrc);

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="space-y-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                {!imageError ? (
                  <img
                    src={avatarSrc}
                    alt={user.displayName || "User Avatar"}
                    className="w-20 h-20 rounded-full object-cover border-2 border-border"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold border-2 border-border">
                    {user.displayName?.[0]?.toUpperCase() || user.primaryEmail?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">Profile Image</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your own image as your avatar
                </p>
              </div>
            </div>

            {/* User Name */}
            <div className="space-y-2">
              <Label htmlFor="username">User name</Label>
              <div className="flex items-center justify-between">
                <Input
                  id="username"
                  value={user.displayName || ""}
                  readOnly
                  className="flex-1 mr-2"
                />
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This is a display name and is not used for authentication
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.primaryEmail || ""}
                readOnly
                className="bg-muted"
              />
            </div>

            {/* Sign Out Button */}
            <div className="pt-4">
              <Button
                variant="destructive"
                onClick={() => user.signOut()}
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
