"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Logo } from "./logo";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LogOut, Settings, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { ModeToggle } from "./mode-toggle";
import { UserAvatar } from "./user-avatar";

export function MainHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  
  const isSettingsPage = pathname === "/settings";

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully.");
            router.push("/sign-in");
          },
        }
      });
    } catch (error) {
      toast.error("Failed to sign out.");
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {isSettingsPage ? (
          <Link 
            href="/image-generation" 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Imagination</span>
          </Link>
        ) : (
          <Link href="/image-generation" className="flex items-center gap-2 group">
            <Logo className="w-8 h-8 text-foreground group-hover:scale-110 transition-transform" />
            <span className="text-lg font-heading font-medium tracking-tight text-foreground">
              Aesthetic AI
            </span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative h-9 w-9 rounded-full border border-border bg-muted/50 overflow-hidden hover:border-accent/30 active:scale-95 transition-all outline-none group/avatar">
              <UserAvatar 
                image={session?.user?.image} 
                name={session?.user?.name} 
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border-border rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95">
            <div className="px-3 py-2 mb-2">
                <p className="text-[10px] font-mono text-muted-foreground mb-1">Authenticated as</p>
                <p className="text-sm font-medium text-foreground truncate">{session?.user?.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
               asChild
               className="rounded-xl focus:bg-accent/10 focus:text-accent-foreground cursor-pointer px-3 py-2 text-xs font-mono text-muted-foreground gap-2 transition-all"
            >
              <Link href="/settings" className="flex items-center gap-2 w-full">
                <Settings className="w-4 h-4" />
                Account settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
               asChild
               className="rounded-xl focus:bg-accent/10 focus:text-accent-foreground cursor-pointer px-3 py-2 text-xs font-mono text-muted-foreground gap-2 transition-all"
            >
              <Link href="/billing" className="flex items-center gap-2 w-full">
                <CreditCard className="w-4 h-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="rounded-xl focus:bg-accent/10 focus:text-accent-foreground cursor-pointer px-3 py-2 text-xs font-mono text-muted-foreground gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
