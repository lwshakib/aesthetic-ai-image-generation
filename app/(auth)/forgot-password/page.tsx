"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authClient.requestPasswordReset({
          email,
          redirectTo: "/reset-password",
        },
        {
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to send reset link");
          },
          onSuccess: () => {
            toast.success("Reset link sent!");
            setIsEmailSent(true);
          },
        }
      );
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <AuthCard 
        title="Email Sent" 
        description="Check your inbox for the reset link."
      >
        <div className="flex flex-col items-center text-center space-y-6 pt-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-2">
            <Mail className="w-8 h-8" />
          </div>
          
          <p className="text-sm text-[#888] font-mono leading-relaxed">
            We've sent a password reset link to <span className="text-white font-medium">{email}</span>. 
            <br /><br />
            If you don't see it in your inbox, please check your spam folder.
          </p>

          <div className="flex flex-col w-full gap-4 pt-4">
            <Button 
              asChild
              className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-xl font-bold text-xs shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all"
            >
              <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                Go to Gmail
              </a>
            </Button>
            
            <Button 
              variant="outline"
              asChild
              className="w-full border-[#222] hover:bg-white/[0.02] hover:border-[#333] h-12 rounded-xl text-xs font-mono text-[#888] transition-all"
            >
              <Link href="/sign-in">
                Back to Login
              </Link>
            </Button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      title="Forgot Password" 
      description="Enter your email to receive a password reset link."
    >
      <form onSubmit={handleForgotPassword} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-mono text-[#888]">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#050505]/50 border-[#222] focus:border-white/20 transition-all rounded-xl h-12"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-xl font-bold text-xs tracking-widest shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send reset link"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-xs text-[#555] font-mono leading-relaxed">
          Remembered your password?{" "}
          <Link
            href="/sign-in"
            className="text-white hover:underline transition-all"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
