"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await authClient.resetPassword(
        {
          newPassword: password,
          token: token,
        },
        {
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to reset password.");
          },
          onSuccess: () => {
            toast.success("Password reset successfully. You can now sign in.");
            router.push("/sign-in");
          },
        }
      );
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-4">
            <KeyRound className="w-8 h-8" />
        </div>
        <p className="text-sm text-muted-foreground font-mono leading-relaxed">
          The reset password token is missing or has expired. Please request a new link.
        </p>
        <Button 
          variant="outline"
          onClick={() => router.push("/forgot-password")}
          className="w-full border-border hover:bg-accent/50 h-12 rounded-xl text-xs font-mono uppercase tracking-widest text-muted-foreground"
        >
          Request New Link
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-xs font-mono text-muted-foreground">
          New password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-secondary/50 border-border focus:border-primary/20 transition-all rounded-xl h-12"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-xs font-mono text-muted-foreground">
          Confirm password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="bg-secondary/50 border-border focus:border-primary/20 transition-all rounded-xl h-12"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl font-bold text-xs tracking-widest shadow-xl transition-all"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard 
      title="Reset Password" 
      description="Enter your new password below."
    >
      <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
