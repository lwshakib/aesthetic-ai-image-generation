"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { User, LogOut, Settings, CreditCard, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export function MainHeader() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

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
    <header className="h-16 border-b border-[#222] bg-[#050505]/50 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
      <Link href="/image-generation" className="flex items-center gap-2 group">
        <Logo className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
        <span className="text-lg font-heading font-medium tracking-tight text-white">
          Aesthetic AI
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 w-9 rounded-full border border-[#222] bg-white/5 overflow-hidden hover:border-white/10 active:scale-95 transition-all outline-none">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "User"} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-500/10">
                  <User className="w-4 h-4 text-[#888]" />
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#111] border-[#222] rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95">
            <div className="px-3 py-2 mb-2">
                <p className="text-[10px] font-mono text-[#555] mb-1">Authenticated as</p>
                <p className="text-sm font-medium text-white truncate">{session?.user?.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-[#222]" />
            <DropdownMenuItem 
               asChild
               className="rounded-xl focus:bg-white/10 focus:text-white cursor-pointer px-3 py-2 text-xs font-mono text-[#888] gap-2 transition-all"
            >
              <Link href="/settings" className="flex items-center gap-2 w-full">
                <Settings className="w-4 h-4" />
                Account settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
               asChild
               className="rounded-xl focus:bg-white/10 focus:text-white cursor-pointer px-3 py-2 text-xs font-mono text-[#888] gap-2 transition-all"
            >
              <Link href="/billing" className="flex items-center gap-2 w-full">
                <CreditCard className="w-4 h-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#222]" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="rounded-xl focus:bg-white/10 focus:text-white cursor-pointer px-3 py-2 text-xs font-mono text-[#888] gap-2 transition-all"
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
