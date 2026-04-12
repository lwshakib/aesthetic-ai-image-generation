'use client'
import Image from "next/image";
import { memo } from "react";
import { PlayCircle, Users, BookOpen, Check, Sparkle } from "lucide-react";
import { Logo } from "@/components/logo";

// Separate memoized component for heavy background to prevent re-renders
const HeroBackground = memo(() => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="w-full h-full bg-background relative transition-colors duration-500">
        {/* Layered CSS glows for a deep, high-end feel */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-500/10 dark:bg-orange-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/20 blur-[100px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-amber-500/5 dark:bg-amber-500/10 blur-[80px] rounded-full"></div>
      </div>
    </div>
  );
});
HeroBackground.displayName = "HeroBackground";

export default function Home() {
  return (
    <div className="selection:bg-foreground selection:text-background flex flex-col min-h-screen text-base relative bg-background text-foreground font-sans antialiased overflow-x-hidden transition-colors duration-500">
      <HeroBackground />

      {/* Grid Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-[-1]" style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "4rem 4rem", maskImage: "radial-gradient(circle at center, black, transparent 80%)", WebkitMaskImage: "radial-gradient(circle at center, black, transparent 80%)", opacity: 0.03 }}></div>

      {/* Navigation — fixed so it stays visible (parent overflow-x-hidden breaks sticky) */}
      <nav className="fixed inset-x-0 top-0 z-50 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 animate-fade-up">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20 lg:px-8">
          <div className="flex gap-2 text-xl text-foreground tracking-tight items-center font-heading font-medium">
            <Logo className="size-9 text-foreground" />
            Aesthetic AI
          </div>
          <div className="hidden md:flex gap-8 text-sm text-muted-foreground items-center">
            <a href="#workflow" className="hover:text-foreground transition-colors">How it works</a>
            <a href="/image-generation" className="hover:text-foreground transition-colors">Gallery</a>
            <a href="/image-generation" className="hover:text-foreground transition-colors">Generate</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>

          <div className="btn-wrapper scale-90 md:scale-100">
            <a href="/image-generation" className="btn !font-medium !text-sm !h-10 !rounded-full !px-8">
              Open app
            </a>
            <div className="dot top left"></div>
            <div className="dot top right"></div>
            <div className="dot bottom right"></div>
            <div className="dot bottom left"></div>
            <div className="line horizontal top"></div>
            <div className="line horizontal bottom"></div>
            <div className="line vertical left"></div>
            <div className="line vertical right"></div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="lg:px-8 lg:pt-28 lg:pb-40 flex flex-col lg:flex-row max-w-7xl mr-auto ml-auto pt-12 pr-6 pb-32 pl-6 items-center relative overflow-hidden">
          <div className="flex-1 lg:text-left z-10 text-center">
            <div className="inline-flex gap-2 animate-fade-up text-xs font-medium text-muted-foreground bg-muted border border-border rounded-full mb-8 py-1.5 px-4 items-center">
              FLUX.1 [schnell] available
              <span className="size-1.5 rounded-full bg-foreground animate-pulse shadow-[0_0_8px_currentColor]" aria-hidden />
            </div>
            
            <h1 className="md:text-6xl lg:text-7xl leading-[1.05] animate-fade-up delay-100 text-4xl font-medium text-foreground tracking-tight font-heading mb-6">
              Turn ideas into images with FLUX
            </h1>
            
            <p className="md:text-xl lg:mx-0 leading-relaxed animate-fade-up delay-200 text-lg text-muted-foreground max-w-2xl mr-auto mb-10 ml-auto translate-x-1">
              Write a prompt, refine it if you want, and generate. Your images are saved in a gallery you can come back to anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 lg:justify-start animate-fade-up delay-300 items-center justify-center mt-10">
              <div className="btn-wrapper">
                <a href="/image-generation" className="btn !font-medium !text-sm !h-12 !rounded-full !px-10">
                  Open image generation
                </a>
                <div className="dot top left"></div>
                <div className="dot top right"></div>
                <div className="dot bottom right"></div>
                <div className="dot bottom left"></div>
                <div className="line horizontal top"></div>
                <div className="line horizontal bottom"></div>
                <div className="line vertical left"></div>
                <div className="line vertical right"></div>
              </div>
              <a
                href="/image-generation"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View the gallery
                <PlayCircle className="size-5" />
              </a>
            </div>
          </div>

          <div className="flex-1 hidden lg:flex animate-fade-up delay-200 w-full min-h-[520px] max-w-lg relative mt-12 lg:mt-0 items-center justify-center perspective-normal transform-style-preserve-3d">
            <div className="relative mx-auto h-[480px] w-full max-w-[22rem]">
              {/* Back right — layout shell + motion wrapper */}
              <div className="pointer-events-none absolute top-8 right-0 z-10 w-64">
                <div className="hero-anim-back-right opacity-[0.42]">
                  <div
                    className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-border shadow-2xl"
                    style={{
                      maskImage:
                        "linear-gradient(0deg, transparent, black 0%, black 100%, transparent)",
                      WebkitMaskImage:
                        "linear-gradient(0deg, transparent, black 0%, black 100%, transparent)",
                    }}
                  >
                    <Image
                      src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4d3f4658-ecfd-47b7-8318-ab5e0f7dba77_800w.webp"
                      alt="Muted reference cover in the hero stack"
                      fill
                      className="object-cover grayscale opacity-70"
                      sizes="256px"
                    />
                    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/15 via-transparent to-black/10" />
                  </div>
                </div>
              </div>

              {/* Back left */}
              <div className="pointer-events-none absolute top-16 left-0 z-[11] w-64">
                <div className="hero-anim-back-left opacity-70">
                  <div
                    className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-border shadow-2xl"
                    style={{
                      maskImage:
                        "linear-gradient(0deg, transparent, black 0%, black 100%, transparent)",
                      WebkitMaskImage:
                        "linear-gradient(0deg, transparent, black 0%, black 100%, transparent)",
                    }}
                  >
                    <Image
                      src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/95719f33-05ac-4a57-b882-0015d0b8af8b_800w.webp"
                      alt="Urban synthesis style cover in the hero stack"
                      fill
                      className="object-cover"
                      sizes="256px"
                    />
                    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="pointer-events-none absolute bottom-5 left-3 right-3 z-20">
                      <p className="mb-1 text-xs text-white/50">Sample style</p>
                      <h3 className="font-heading text-xl font-medium leading-tight tracking-tight text-white">
                        Urban synthesis
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Front — centered without transform on the positioned shell */}
              <div className="absolute left-1/2 top-2 z-20 w-80 max-w-[calc(100%-1rem)] -translate-x-1/2">
                <div className="hero-anim-front">
                  <div
                    className="group relative aspect-[2/3] w-full overflow-hidden rounded-[2rem] border border-border/50 shadow-2xl transition-transform duration-500 ease-out group-hover:scale-[1.04] group-hover:shadow-[0_25px_80px_-12px_rgba(0,0,0,0.45)]"
                    style={{
                      maskImage:
                        "linear-gradient(0deg, transparent, black 0%, black 100%, transparent)",
                      WebkitMaskImage:
                        "linear-gradient(0deg, transparent, black 0%, black 100%, transparent)",
                    }}
                  >
                    <Image
                      src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c43265c1-3d68-44f0-b248-d7969e9fed75_800w.webp"
                      alt="Featured architectural glimpse cover"
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <div className="pointer-events-none absolute top-5 right-5 z-30 rounded-md border border-border bg-background/90 px-3 py-1 text-xs font-medium text-primary">
                      FLUX.1
                    </div>
                    <div className="pointer-events-none absolute bottom-8 left-6 right-6 z-20">
                      <p className="mb-2 text-sm text-white/70">Prompt preview</p>
                      <h3 className="mb-3 font-heading text-3xl font-medium leading-tight tracking-tight text-white">
                        Architectural glimpse
                      </h3>
                      <p className="text-xs text-white/50">Rendered with FLUX.1</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="lg:px-8 max-w-7xl mr-auto mb-32 ml-auto pr-6 pl-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-8 rounded-2xl flex flex-col hover:border-foreground/15 transition-colors">
              <h2 className="text-4xl tracking-tight text-foreground mb-2 font-heading font-medium">~4s</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">Typical time for a FLUX [schnell] image.</p>
            </div>
            <div className="glass-panel p-8 rounded-2xl flex flex-col hover:border-foreground/15 transition-colors">
              <h2 className="text-4xl tracking-tight text-foreground mb-2 font-heading font-medium">Fast</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">Built for quick iteration while you refine prompts.</p>
            </div>
            <div className="glass-panel p-8 rounded-2xl flex flex-col hover:border-foreground/15 transition-colors border-primary/15 bg-primary/[0.03]">
              <p className="text-xs text-muted-foreground mb-2">Prompt help</p>
              <h2 className="text-4xl tracking-tight text-foreground mb-2 font-heading font-medium">Refine</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">Optional step to tighten wording before you generate.</p>
            </div>
            <div className="glass-panel p-8 rounded-2xl flex flex-col hover:border-foreground/15 transition-colors">
              <h2 className="text-4xl tracking-tight text-foreground mb-2 font-heading font-medium">Gallery</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">Your generations stay organized in one place.</p>
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="border-y border-border bg-muted/20 py-24" id="workflow">
          <div className="lg:px-8 max-w-2xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl text-foreground font-heading font-medium tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-14">
              Describe what you want, adjust the prompt if needed, then generate. No fake UI or demo data—this is the flow in the app.
            </p>
            <ol className="space-y-10 list-none pl-0">
              <li className="flex gap-5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground" aria-hidden>
                  1
                </span>
                <div>
                  <h3 className="text-lg font-medium text-foreground font-heading mb-2">Write a prompt</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Open image generation and describe what you want. Add reference images only when you need them.
                  </p>
                </div>
              </li>
              <li className="flex gap-5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground" aria-hidden>
                  2
                </span>
                <div>
                  <h3 className="text-lg font-medium text-foreground font-heading mb-2">Refine (optional)</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tighten your wording with refinement before you generate, so you waste fewer runs on vague prompts.
                  </p>
                </div>
              </li>
              <li className="flex gap-5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground" aria-hidden>
                  3
                </span>
                <div>
                  <h3 className="text-lg font-medium text-foreground font-heading mb-2">Generate and review</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Run the model, then open your gallery to compare results and download what you like.
                  </p>
                </div>
              </li>
            </ol>
            <div className="mt-14">
              <a
                href="/image-generation"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:border-foreground/30 hover:bg-muted/50 transition-colors"
              >
                Try it in the app
              </a>
            </div>
          </div>
        </section>

        {/* Pricing — demo placeholders */}
        <section className="lg:px-8 py-24 max-w-7xl mx-auto px-6 relative z-10" id="pricing">
          <div className="text-center mb-14 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-foreground tracking-tight mb-3 font-heading font-medium">
              Pricing
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Example tiers for the landing page. Connect your real plans and billing when you are ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch w-full max-w-5xl mx-auto">
            <div className="flex flex-col rounded-2xl border border-border bg-card/40 p-8 hover:border-foreground/15 transition-colors">
              <div className="flex items-start gap-4 mb-6">
                <div className="size-11 shrink-0 rounded-xl border border-border bg-muted/50 flex items-center justify-center text-muted-foreground">
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground font-heading">Creator</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Try the product</p>
                </div>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-semibold tracking-tight text-foreground font-heading">$0</span>
                <span className="text-sm text-muted-foreground ml-2">per month</span>
              </div>
              <ul className="space-y-3 mb-10 text-sm text-muted-foreground flex-1">
                <li className="flex gap-2.5 items-start"><Check className="size-4 text-primary shrink-0 mt-0.5" /><span>Limited generations per month</span></li>
                <li className="flex gap-2.5 items-start"><Check className="size-4 text-primary shrink-0 mt-0.5" /><span>Core model access</span></li>
                <li className="flex gap-2.5 items-start"><Check className="size-4 text-primary shrink-0 mt-0.5" /><span>Generation history</span></li>
              </ul>
              <a
                href="/sign-up"
                className="w-full text-center rounded-xl border border-border py-3 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
              >
                Start free
              </a>
            </div>

            <div className="flex flex-col rounded-2xl border-2 border-primary/35 bg-card p-8 shadow-sm ring-1 ring-primary/10">
              <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-md px-2.5 py-1">
                  Recommended
                </span>
              </div>
              <div className="flex items-start gap-4 mb-6 -mt-2">
                <div className="size-11 shrink-0 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                  <Sparkle className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground font-heading">Pro</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">For regular use</p>
                </div>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-semibold tracking-tight text-foreground font-heading">$12</span>
                <span className="text-sm text-muted-foreground ml-2">per month</span>
              </div>
              <ul className="space-y-3 mb-10 text-sm text-muted-foreground flex-1">
                <li className="flex gap-2.5 items-start"><Check className="size-4 text-primary shrink-0 mt-0.5" /><span>Higher or unlimited generations</span></li>
                <li className="flex gap-2.5 items-start"><Check className="size-4 text-primary shrink-0 mt-0.5" /><span>Prompt refinement</span></li>
                <li className="flex gap-2.5 items-start"><Check className="size-4 text-primary shrink-0 mt-0.5" /><span>Full feature access</span></li>
              </ul>
              <a
                href="/billing"
                className="w-full text-center rounded-xl bg-foreground text-background py-3 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Upgrade
              </a>
            </div>

            <div className="flex flex-col rounded-2xl border border-border bg-card/40 p-8 hover:border-foreground/15 transition-colors">
              <div className="flex items-start gap-4 mb-6">
                <div className="size-11 shrink-0 rounded-xl border border-border bg-muted/50 flex items-center justify-center text-foreground">
                  <Users className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground font-heading">Studio</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Teams and agencies</p>
                </div>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-semibold tracking-tight text-foreground font-heading">$29</span>
                <span className="text-sm text-muted-foreground ml-2">per month</span>
              </div>
              <ul className="space-y-3 mb-10 text-sm text-muted-foreground flex-1">
                <li className="flex gap-2.5 items-start"><Check className="size-4 text-foreground shrink-0 mt-0.5" /><span>Everything in Pro</span></li>
                <li className="flex gap-2.5 items-start"><Check className="size-4 text-foreground shrink-0 mt-0.5" /><span>Shared assets (when you add them)</span></li>
                <li className="flex gap-2.5 items-start"><Check className="size-4 text-foreground shrink-0 mt-0.5" /><span>Priority support (optional)</span></li>
              </ul>
              <a
                href="/billing"
                className="w-full text-center rounded-xl border border-border py-3 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
              >
                Contact sales
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border pt-16 pb-12 bg-background">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex gap-2 text-xl text-foreground tracking-tight items-center font-heading font-medium">
              <Logo className="size-7 text-foreground" />
              Aesthetic AI
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Generate images from text with FLUX and keep your work in a simple gallery.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-sm">
              <a href="/sign-in" className="text-muted-foreground hover:text-foreground w-fit transition-colors">
                Sign in
              </a>
              <a href="/sign-up" className="text-muted-foreground hover:text-foreground w-fit transition-colors">
                Create account
              </a>
              <a href="/image-generation" className="text-muted-foreground hover:text-foreground w-fit transition-colors">
                Image generation
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#workflow" className="hover:text-foreground transition-colors">How it works</a></li>
              <li><a href="/image-generation" className="hover:text-foreground transition-colors">Gallery</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Account</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/settings" className="hover:text-foreground transition-colors">Settings</a></li>
              <li><a href="/billing" className="hover:text-foreground transition-colors">Billing</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Aesthetic AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
