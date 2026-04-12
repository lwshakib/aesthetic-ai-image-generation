"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { ProfileImageUpload } from "@/components/profile-image-upload";
import { 
  ShieldCheck, 
  Smartphone, 
  Monitor,
  Laptop,
  Mail,
  Trash2,
  CheckCircle2,
  Loader2,
  Globe,
  Link as LinkIcon,
  Unlink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface SessionData {
  token: string;
  userAgent?: string | null;
  updatedAt: Date;
  ipAddress?: string | null;
}

interface AccountData {
  id: string;
  providerId: string;
}

/**
 * Account Settings Page
 * Synchronized with the provided AccountPage logic for dynamic data handling.
 */
export default function SettingsPage() {
  const { data: session, refetch, isPending: isSessionPending } = authClient.useSession();
  
  // Profile Update State
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [userName, setUserName] = useState("");

  // Dynamic Data State
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  // Initialize name from session
  useEffect(() => {
    if (session?.user?.name) {
      setUserName(session.user.name);
    }
  }, [session]);

  // Fetch real data from Better Auth
  const fetchData = async () => {
    try {
      const [sessRes, accRes] = await Promise.all([
        authClient.listSessions(),
        authClient.listAccounts()
      ]);

      if (sessRes.data) setSessions(sessRes.data as SessionData[]);
      if (accRes.data) setAccounts(accRes.data as AccountData[]);
    } catch (err) {
      console.error("Failed to fetch account data:", err);
    } finally {
      setIsLoadingSessions(false);
      setIsLoadingAccounts(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const handleUpdateName = async () => {
    if (!userName.trim()) return;
    setIsUpdatingName(true);
    try {
      await authClient.updateUser({
        name: userName,
      });
      toast.success("Profile updated successfully");
      await refetch();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleRevokeSession = async (token: string) => {
    try {
      await authClient.revokeSession({ token });
      setSessions((prev) => prev.filter((s) => s.token !== token));
      toast.success("Session terminated");
    } catch {
      toast.error("Failed to revoke session");
    }
  };

  const handleLinkSocial = async (providerId: 'google') => {
    try {
      await authClient.linkSocial({
        provider: providerId,
        callbackURL: window.location.href,
      });
    } catch {
      toast.error(`Failed to link ${providerId} account`);
    }
  };

  const handleUnlinkAccount = async (providerId: string) => {
    try {
      const { error } = await authClient.unlinkAccount({
        providerId,
      });

      if (error) {
        toast.error(error.message || `Failed to unlink ${providerId}`);
        return;
      }

      toast.success(`${providerId} account unlinked`);
      setAccounts((prev) => prev.filter((acc) => acc.providerId !== providerId));
    } catch {
      toast.error(`Error unlinking ${providerId}`);
    }
  };

  if (isSessionPending) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (!session) return null;

  const isGoogleLinked = accounts.some((acc) => acc.providerId === "google");

  return (
    <div className="flex flex-1 flex-col bg-background overflow-y-auto scrollbar-hide">
      <main className="flex-1 p-6 md:p-8 lg:p-12">
        <div className="mx-auto max-w-6xl w-full">
          {/* Page Heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Settings</h1>
            <p className="text-muted-foreground text-lg">
              Manage your personal information, connected accounts, and security.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT COLUMN: Profile Spotlight */}
            <div className="lg:sticky lg:top-24 space-y-6 lg:col-span-1">
              <Card className="overflow-hidden border shadow-lg bg-card ring-1 ring-border/50">
                <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
                  <ProfileImageUpload onSuccess={() => refetch()} />
                  
                  <div className="mt-6 space-y-2 w-full px-4 overflow-hidden">
                    <h2 className="text-2xl font-bold truncate" title={session.user.name || ""}>
                      {session.user.name}
                    </h2>
                    <p className="text-sm text-muted-foreground truncate" title={session.user.email || ""}>
                      {session.user.email}
                    </p>
                    <div className="pt-4 flex justify-center">
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground ring-1 ring-inset ring-border">
                        <ShieldCheck className="mr-1.5 size-3" />
                        Active Account
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 border-dashed">
                <CardContent className="p-4 text-xs text-muted-foreground leading-relaxed">
                  Your profile information is shared across Aesthetic AI services to help provide a consistent experience.
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: Configuration */}
            <div className="lg:col-span-2 space-y-8 min-w-0">
              {/* DISPLAY NAME */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Display Name</CardTitle>
                  <CardDescription>
                    This is how you will appear to others in collaborate mode.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your name"
                      className="max-w-md"
                    />
                  </div>
                  <div className="space-y-2 opacity-70">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 text-sm font-medium bg-muted p-2 rounded-md border max-w-md overflow-hidden">
                      <Mail className="size-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{session.user.email}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t py-4">
                  <Button
                    onClick={handleUpdateName}
                    disabled={isUpdatingName || userName === session.user.name}
                  >
                    {isUpdatingName ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 size-4" />
                    )}
                    Update Name
                  </Button>
                </CardFooter>
              </Card>

              {/* CONNECTED ACCOUNTS */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>
                    Social accounts used to sign in to Aesthetic AI.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingAccounts ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-all group">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="p-2.5 rounded-lg bg-secondary ring-1 ring-border group-hover:scale-105 transition-transform shrink-0">
                            <Globe className="size-5" />
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-semibold truncate">Google</p>
                            <p className="text-xs text-muted-foreground truncate">Social Authentication</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {isGoogleLinked ? (
                            <>
                              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-tight text-muted-foreground bg-muted px-2 py-1 rounded">
                                Connected
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs gap-1.5 text-destructive hover:bg-destructive/10"
                                onClick={() => handleUnlinkAccount('google')}
                              >
                                <Unlink className="size-3" />
                                Disconnect
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-8 text-xs gap-1.5"
                              onClick={() => handleLinkSocial('google')}
                            >
                              <LinkIcon className="size-3" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20 opacity-80">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-lg bg-background ring-1 ring-border shrink-0">
                            <Mail className="size-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Email & Password</p>
                            <p className="text-xs text-muted-foreground">Standard Credentials</p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-tight text-muted-foreground bg-muted px-2 py-1 rounded shrink-0">
                          Primary
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ACTIVE SESSIONS */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>
                    Devices currently logged in to your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                  {isLoadingSessions ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sessions.map((sess) => (
                        <div
                          key={sess.token}
                          className="flex items-center justify-between gap-4 p-3 rounded-xl border bg-card hover:shadow-sm transition-all min-w-0"
                        >
                          <div className="flex items-center gap-3 overflow-hidden min-w-0">
                            <div className="p-2 bg-muted rounded-lg shrink-0">
                              {sess.userAgent?.includes("Mobi") ? (
                                <Smartphone className="size-4 text-muted-foreground" />
                              ) : sess.userAgent?.includes("Mac") || sess.userAgent?.includes("Win") ? (
                                <Monitor className="size-4 text-muted-foreground" />
                              ) : (
                                <Laptop className="size-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="truncate min-w-0">
                              <p className="text-sm font-semibold truncate flex items-center gap-2">
                                {sess.userAgent?.split(')')[0].split('(')[1] || 'Desktop Browse'}
                                {sess.token === session.session.token && (
                                  <span className="shrink-0 text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full font-bold tracking-tight border">
                                    Current
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                Last used: {new Date(sess.updatedAt).toLocaleDateString()} at {new Date(sess.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>

                          {sess.token !== session.session.token && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 shrink-0 size-8"
                              onClick={() => handleRevokeSession(sess.token)}
                              title="Revoke session"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
