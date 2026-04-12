import React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import Link from "next/link";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showLogo?: boolean;
}

export function AuthCard({ children, title, description, showLogo = true }: AuthCardProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Background elements consistent with landing page */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0" 
        style={{ 
          backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", 
          backgroundSize: "4rem 4rem", 
          maskImage: "radial-gradient(circle at center, black, transparent 80%)", 
          WebkitMaskImage: "radial-gradient(circle at center, black, transparent 80%)",
          opacity: 0.03
        }}
      ></div>

      <div className="w-full max-w-md z-10 animate-fade-up">
        {showLogo && (
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 group">
               <Logo className="w-10 h-10 text-foreground group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        )}
        
        <div className="glass-panel bg-card/50 border-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-medium text-foreground tracking-tight mb-2">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                {description}
              </p>
            )}
          </div>
          
          {children}
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-[10px] text-muted-foreground font-mono tracking-wide">
                © 2026 Aesthetic AI Labs
            </p>
        </div>
      </div>
    </div>
  );
}
