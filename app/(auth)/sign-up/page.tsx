"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Mail, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authClient.signUp.email(
        {
          email,
          password,
          name,
          callbackURL: "/sign-in",
        },
        {
          onError: (ctx) => {
            toast.error(ctx.error.message || "Registration failed");
          },
          onSuccess: () => {
            toast.success("Account created successfully!");
            setIsEmailSent(true);
          },
        }
      );
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/image-generation",
      });
    } catch (error) {
      toast.error("Failed to sign in with Google.");
      setIsGoogleLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <AuthCard 
        title="Check Your Inbox" 
        description="We've sent a verification link to your email address."
      >
        <div className="flex flex-col items-center text-center space-y-6 pt-4">
          <div className="w-16 h-16 rounded-full bg-accent/50 border border-border flex items-center justify-center text-foreground mb-2">
            <Mail className="w-8 h-8" />
          </div>
          
          <p className="text-sm text-muted-foreground font-mono leading-relaxed">
            An email with verification instructions has been sent to <span className="text-foreground font-medium">{email}</span>. 
            <br /><br />
            Please verify your email to activate your account. You won't be able to sign in until this step is complete.
          </p>

          <div className="flex flex-col w-full gap-4 pt-4">
            <Button 
              asChild
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl font-bold text-xs shadow-xl transition-all"
            >
              <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                Go to Gmail
              </a>
            </Button>
            
            <Button 
              variant="outline"
              asChild
              className="w-full border-border hover:bg-accent/50 hover:border-border h-12 rounded-xl text-xs font-mono text-muted-foreground transition-all"
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
      title="Create Account" 
      description="Enter your details to create a new account."
    >
      <form onSubmit={handleSignUp} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-mono text-muted-foreground">
            Full name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-secondary/50 border-border focus:border-primary/20 transition-all rounded-xl h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-mono text-muted-foreground">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-secondary/50 border-border focus:border-primary/20 transition-all rounded-xl h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-mono text-muted-foreground">
            Password
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
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl font-bold text-xs tracking-widest shadow-xl transition-all"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[10px]">
          <span className="bg-card px-4 text-muted-foreground font-mono">Or continue with</span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        disabled={isGoogleLoading}
        onClick={handleGoogleSignIn}
        className="w-full border-border hover:bg-accent hover:text-accent-foreground h-12 rounded-xl text-xs font-mono text-muted-foreground transition-all"
      >
        {isGoogleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.29.81-.55z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </div>
        )}
      </Button>

      <div className="mt-10 text-center">
        <p className="text-xs text-muted-foreground font-mono leading-relaxed">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-foreground hover:underline transition-all"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
