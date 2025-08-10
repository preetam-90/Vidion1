"use client";

import { useUser } from "@stackframe/stack";
<<<<<<< HEAD
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/user-avatar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function AccountSettingsPage() {
  const user = useUser();
  const { toast } = useToast();

  if (!user) {
    return <div>Loading...</div>;
  }

  // Profile state
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Account deletion state
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      await user.update({
        displayName: displayName,
        profileImageUrl: profileImageUrl || null,
      });
      toast({
        title: "Success",
        description: "Profile updated successfully!",
=======
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import UserAvatar from "@/components/user-avatar";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function AccountSettingsPage() {
  const user = useUser({ or: "redirect" });
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) {
    redirect("/sign-in");
    return null;
  }

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      await user.update({
        displayName: displayName.trim() || undefined,
        profileImageUrl: profileImageUrl.trim() || undefined,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
>>>>>>> b03667e (Restore default Stack Auth account settings page and improve avatar handling)
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
<<<<<<< HEAD
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await user.updatePassword({
        oldPassword,
        newPassword,
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "Success",
        description: "Password updated successfully!",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "Failed to update password. Please check your current password.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast({
        title: "Error",
        description: "Please type 'DELETE' to confirm account deletion",
        variant: "destructive",
      });
=======
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
    setIsUpdating(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
>>>>>>> b03667e (Restore default Stack Auth account settings page and improve avatar handling)
      return;
    }

    setIsDeleting(true);
    try {
      await user.delete();
<<<<<<< HEAD
=======
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
      });
>>>>>>> b03667e (Restore default Stack Auth account settings page and improve avatar handling)
      // User will be automatically redirected after deletion
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
<<<<<<< HEAD
        description: "Failed to delete account",
=======
        description: "Failed to delete account. Please try again.",
>>>>>>> b03667e (Restore default Stack Auth account settings page and improve avatar handling)
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      {/* Profile Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your account details and profile picture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Avatar Section */}
          <div className="flex items-center space-x-4">
            <UserAvatar size="xl" />
            <div>
              <h3 className="text-lg font-medium">{user.displayName || "Unnamed User"}</h3>
              <p className="text-sm text-muted-foreground">{user.primaryEmail}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Profile Image: {user.profileImageUrl ? "Available from OAuth provider" : "Not set"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Profile Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
              />
            </div>

            <div>
              <Label htmlFor="profileImageUrl">Profile Image URL (Optional)</Label>
              <Input
                id="profileImageUrl"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to use OAuth provider image
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleUpdateProfile}
<<<<<<< HEAD
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? "Updating..." : "Update Profile"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => user.signOut()}
            >
              Sign Out
=======
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Profile"}
>>>>>>> b03667e (Restore default Stack Auth account settings page and improve avatar handling)
            </Button>
          </div>
        </CardContent>
      </Card>

<<<<<<< HEAD
      {/* Password Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Update your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="oldPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="oldPassword"
                type={showPasswords ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <Button 
            onClick={handleUpdatePassword}
            disabled={isUpdatingPassword || !oldPassword || !newPassword || !confirmPassword}
          >
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </Button>
=======
      {/* Account Security */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Verification</p>
              <p className="text-sm text-muted-foreground">
                {user.primaryEmailVerified ? "Your email is verified" : "Your email is not verified"}
              </p>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${user.primaryEmailVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="ml-2 text-sm">
                {user.primaryEmailVerified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Password Protection</p>
              <p className="text-sm text-muted-foreground">
                {user.hasPassword ? "Password is set" : "No password set"}
              </p>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${user.hasPassword ? 'bg-green-500' : 'bg-gray-500'}`} />
              <span className="ml-2 text-sm">
                {user.hasPassword ? "Protected" : "Not Set"}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                {user.otpAuthEnabled ? "2FA is enabled" : "2FA is disabled"}
              </p>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${user.otpAuthEnabled ? 'bg-green-500' : 'bg-gray-500'}`} />
              <span className="ml-2 text-sm">
                {user.otpAuthEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
>>>>>>> b03667e (Restore default Stack Auth account settings page and improve avatar handling)
        </CardContent>
      </Card>

      {/* Danger Zone */}
<<<<<<< HEAD
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle size={20} />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="deleteConfirm" className="text-red-600">
              Type "DELETE" to confirm account deletion
            </Label>
            <Input
              id="deleteConfirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              className="border-red-200"
            />
          </div>

          <Button 
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting || deleteConfirmText !== "DELETE"}
          >
            {isDeleting ? "Deleting Account..." : "Delete Account"}
          </Button>

          <p className="text-xs text-muted-foreground">
            This action cannot be undone. This will permanently delete your account and remove all associated data.
          </p>
=======
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
>>>>>>> b03667e (Restore default Stack Auth account settings page and improve avatar handling)
        </CardContent>
      </Card>
    </div>
  );
}
