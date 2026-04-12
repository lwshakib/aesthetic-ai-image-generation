"use client";

import React, { useEffect, useState } from "react";
import { getCredits } from "@/app/actions/user.actions";
import { Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DAILY_CREDIT_LIMIT } from "@/lib/constants";

/**
 * A premium usage indicator for the user's daily credit limit.
 * Fetches data via server actions and displays a sleek progress bar.
 */
export function UsageText({ className }: { className?: string }) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCredits = async () => {
    try {
      const val = await getCredits();
      setCredits(val);
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
    
    // Listen for custom events to refresh credits (e.g., after a generation)
    window.addEventListener("refresh-credits", fetchCredits);
    return () => window.removeEventListener("refresh-credits", fetchCredits);
  }, []);

  if (loading) {
    return (
      <div className={cn("flex items-center gap-2 text-[10px] text-muted-foreground/60 font-mono italic animate-pulse", className)}>
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Verifying credentials...</span>
      </div>
    );
  }

  const maxCredits = DAILY_CREDIT_LIMIT;
  const percentage = credits !== null ? (credits / maxCredits) * 100 : 0;
  const isLow = credits !== null && credits <= 1;

  return (
    <div className={cn("space-y-3 group", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-foreground/70 tracking-[0.15em] uppercase">
          <div className={cn(
            "p-1 rounded-md transition-all duration-500",
            credits && credits > 0 
              ? "bg-orange-500/10 text-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.1)]" 
              : "bg-muted text-muted-foreground"
          )}>
            <Zap className={cn("w-2.5 h-2.5", credits && credits > 0 && "fill-orange-400")} />
          </div>
          System Capacity
        </div>
        <div className="flex items-baseline gap-1">
          <span className={cn(
            "text-xs font-mono font-bold",
            isLow ? "text-orange-400" : "text-foreground"
          )}>
            {credits}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/50">/ {maxCredits}</span>
        </div>
      </div>
      
      <div className="relative h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden border border-white/5">
        {/* Glow effect */}
        <div 
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-out opacity-20 blur-sm",
            credits === 0 ? "bg-transparent" : "bg-orange-500"
          )}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Main Bar */}
        <div 
          className={cn(
            "relative h-full transition-all duration-1000 ease-out rounded-full",
            credits === 0 
              ? "bg-muted" 
              : "bg-gradient-to-r from-orange-600 via-orange-400 to-orange-300"
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        </div>
      </div>
      
      <div className="flex justify-between items-center text-[9px] font-medium tracking-wide">
        <p className="text-muted-foreground/60 italic">
          {credits === 0 
            ? "Daily allocation exhausted." 
            : `Available iterations: ${credits}`}
        </p>
        <span className="text-[8px] font-mono text-muted-foreground/40 uppercase">Reset 24h</span>
      </div>
    </div>
  );
}
