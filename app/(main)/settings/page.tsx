"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { ProfileImageUpload } from "@/components/profile-image-upload";
import { 
  listUserSessions, 
  revokeUserSession, 
  listConnectedAccounts,
  updateProfile 
} from "@/app/actions/user.actions";
import { 
  Settings, 
  ShieldCheck, 
  Link2, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Globe,
  Trash2,
  CheckCircle2,
  Fingerprint,
  LogOut,
  User as UserIcon,
  Mail,
  Calendar,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

/**
 * Aesthetic AI Account Settings Dashboard.
 * 
 * Features:
 * - Profile Identity management (Avatar + Name)
 * - Security & Session tracking (View and revoke active devices)
 * - Connected Accounts (OAuth linkage monitoring)
 */
export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const [sessions, setSessions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [name, setName] = useState(session?.user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchSettingsData = async () => {
    try {
      const [s, a] = await Promise.all([
        listUserSessions(),
        listConnectedAccounts()
      ]);
      setSessions(s);
      setAccounts(a);
    } catch (e) {
      console.error("[Settings] Data synchronization failed", e);
    }
  };

  useEffect(() => {
    fetchSettingsData();
  }, []);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    setIsUpdating(true);
    try {
      await updateProfile({ name });
      toast.success("Profile cache updated.");
    } catch (e) {
      toast.error("Cloud synchronization failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRevokeSession = async (id: string) => {
    try {
      await revokeUserSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      toast.success("Remote session terminated.");
    } catch (e) {
      toast.error("Failed to revoke session permissions.");
    }
  };

  const getDeviceIcon = (ua?: string) => {
    if (!ua) return <Monitor className="w-4 h-4" />;
    const lower = ua.toLowerCase();
    if (lower.includes("mobile") || lower.includes("android") || lower.includes("iphone")) return <Smartphone className="w-4 h-4" />;
    if (lower.includes("tablet") || lower.includes("ipad")) return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide bg-background relative selection:bg-accent/30">
        {/* Environmental Depth */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none opacity-40" />
        <div className="absolute bottom-10 left-10 w-[30%] h-[30%] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none opacity-40" />

        <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20 space-y-16 animate-fade-up">
            {/* Page Title & Context */}
            <div className="space-y-2">
                <div className="flex items-center gap-3 text-foreground">
                    <div className="p-2 rounded-xl bg-accent/5 border border-accent/10">
                        <Settings className="w-5 h-5 text-accent" />
                    </div>
                    <h1 className="text-3xl font-heading font-medium tracking-tight">Account Configuration</h1>
                </div>
                <p className="text-sm text-muted-foreground/60 max-w-lg font-mono tracking-tight">
                    Manage your visual identity, secure your active sessions, and configure your authentication preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Column One: Identity */}
                <div className="lg:col-span-1 space-y-8">
                    <section className="glass-panel rounded-3xl p-8 space-y-8 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Fingerprint className="w-24 h-24" />
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest px-1">
                                <UserIcon className="w-3 h-3 text-accent" />
                                Visual Identity
                            </div>
                            <ProfileImageUpload />
                        </div>

                        <Separator className="bg-border/40" />

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1">Alias</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-10 bg-secondary/10 border-border/50 rounded-xl focus:ring-accent/10 text-sm font-medium"
                                        placeholder="Enter your name"
                                    />
                                    <Button 
                                        onClick={handleUpdateName}
                                        disabled={isUpdating || name === session?.user?.name}
                                        className="h-10 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all font-bold"
                                    >
                                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sync"}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1">Primary Endpoint</Label>
                                <div className="h-10 px-4 bg-muted/20 border border-border/20 rounded-xl flex items-center justify-between group/email overflow-hidden">
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono truncate">
                                        <Mail className="w-3 h-3" />
                                        {session?.user?.email}
                                    </div>
                                    <Badge variant="outline" className="h-4 px-1 text-[7px] uppercase tracking-widest bg-green-500/10 text-green-400 border-green-500/20 rounded-sm">
                                        Active
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="glass-panel rounded-3xl p-6 space-y-4">
                         <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest px-2">
                             <Calendar className="w-3 h-3 text-accent" />
                             Timeline
                         </div>
                         <div className="p-4 rounded-2xl bg-secondary/10 border border-border/10 flex items-center justify-between">
                             <div className="space-y-0.5">
                                 <p className="text-xs font-bold font-heading">Standard Allocation</p>
                                 <p className="text-[9px] text-muted-foreground/60 font-mono uppercase tracking-tighter">
                                     Initialized {session?.user?.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : 'N/A'}
                                 </p>
                             </div>
                             <CheckCircle2 className="w-5 h-5 text-green-500/40" />
                         </div>
                    </section>
                </div>

                {/* Column Two: Protection & Connectivity */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Security Sessions */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                             <div className="p-2 rounded-xl bg-accent/5">
                                 <ShieldCheck className="w-4 h-4 text-accent" />
                             </div>
                             <div className="space-y-0.5">
                                <h2 className="text-sm font-bold font-heading">Security Sessions</h2>
                                <p className="text-[10px] text-muted-foreground/50 font-mono tracking-tight uppercase">Authorized environments currently active</p>
                             </div>
                        </div>

                        <div className="grid gap-3">
                            {sessions.map((s) => (
                                <div key={s.id} className="glass-panel group hover:bg-muted/30 transition-all rounded-2xl p-4 flex items-center justify-between border-border/40 overflow-hidden relative">
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="p-3 rounded-xl bg-background/50 border border-border/50 group-hover:bg-background transition-colors">
                                            {getDeviceIcon(s.userAgent)}
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-bold font-heading truncate max-w-[200px]">
                                                    {s.userAgent?.split(')')[0].split('(')[1] || 'Standard Interface'}
                                                </p>
                                                {s.id === session?.session?.id && (
                                                    <Badge className="h-4 px-1.5 text-[7px] uppercase bg-foreground text-background font-bold tracking-[0.2em] border-none rounded-sm">Current</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <p className="text-[9px] text-muted-foreground font-mono flex items-center gap-1">
                                                    <Globe className="w-2.5 h-2.5" />
                                                    {s.ipAddress || 'Loopback'}
                                                </p>
                                                <span className="w-1 h-1 rounded-full bg-border/40" />
                                                <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-tighter">
                                                    Verified {new Date(s.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {s.id !== session?.session?.id && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleRevokeSession(s.id)}
                                            className="h-8 w-8 p-0 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 relative z-10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Authentication Nodes */}
                    <section className="space-y-6">
                         <div className="flex items-center gap-3 px-2">
                             <div className="p-2 rounded-xl bg-accent/5">
                                 <Link2 className="w-4 h-4 text-accent" />
                             </div>
                             <div className="space-y-0.5">
                                <h2 className="text-sm font-bold font-heading">Authentication Nodes</h2>
                                <p className="text-[10px] text-muted-foreground/50 font-mono tracking-tight uppercase">External protocols linked to this identity</p>
                             </div>
                        </div>

                        <div className="grid gap-3">
                            {['google'].map((provider) => {
                                const isConnected = accounts.some(a => a.providerId === provider);
                                return (
                                    <div key={provider} className="glass-panel rounded-2xl p-4 flex items-center justify-between border-border/40">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-background/50 border border-border/50">
                                                {provider === 'google' && (
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-bold font-heading uppercase tracking-widest">{provider}</p>
                                                <p className="text-[9px] text-muted-foreground/60 font-mono italic">
                                                    {isConnected ? 'Linked and validated' : 'Connection dormant'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <Badge variant="outline" className={cn(
                                            "h-5 px-3 text-[8px] uppercase font-bold tracking-[0.2em] border-none rounded-full transition-all",
                                            isConnected ? "bg-accent/10 text-accent" : "bg-muted/50 text-muted-foreground/40"
                                        )}>
                                            {isConnected ? 'Active' : 'Dormant'}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Exit Strategy */}
                    <div className="pt-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <Button 
                            variant="outline" 
                            onClick={async () => {
                                await authClient.signOut();
                                window.location.href = "/sign-in";
                            }}
                            className="w-full h-12 rounded-2xl border-red-500/10 hover:border-red-500/30 hover:bg-red-500/5 text-red-500 text-[10px] uppercase font-bold tracking-[0.25em] group transition-all"
                        >
                            <LogOut className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                            Terminate Authorizations
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
