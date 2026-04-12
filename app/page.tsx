'use client'
import Image from "next/image";
import { useState, memo, type CSSProperties } from "react";
import { 
  PlayCircle, 
  Map, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Check, 
  Send, 
  MessageSquare,
  Sparkle,
  Camera
} from "lucide-react";
import { Logo } from "@/components/logo";

// Define the archetypes for the carousel
const archetypes = [
  {
    id: 1,
    title: "Cinematic Noir",
    description: "Deep shadows, high contrast, and a timeless atmospheric feel.",
    image: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/47f49b0d-1be8-4430-a2fc-b609967ba7fc_800w.webp",
  },
  {
    id: 2,
    title: "Vaporwave Dream",
    description: "Neon pastels, retro-futuristic aesthetics, and surreal landscapes.",
    image: "https://images.unsplash.com/photo-1618517647368-c62188f098f3?w=800&q=80",
  },
  {
    id: 3,
    title: "Hyper-Realism",
    description: "Unparalleled detail, lifelike textures, and perfect lighting.",
    image: "https://images.unsplash.com/photo-1601955423613-3fc99af56b9b?w=320&q=80",
  },
  {
    id: 4,
    title: "Cyberpunk Edge",
    description: "Gritty urban detail, industrial neon, and high-tech textures.",
    image: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/3e3e7724-96e1-4f59-8262-3440303dfe33_320w.webp",
  },
  {
    id: 5,
    title: "Oil Masterpiece",
    description: "Classical brushstrokes, rich textures, and museum-grade quality.",
    image: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/ce43f20c-549c-4578-bcb4-490ebbb8f5e7_320w.webp",
  },
];

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
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % archetypes.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + archetypes.length) % archetypes.length);

  return (
    <div className="selection:bg-foreground selection:text-background flex flex-col min-h-screen text-base relative bg-background text-foreground font-sans antialiased overflow-x-hidden transition-colors duration-500">
      <HeroBackground />

      {/* Grid Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-[-1]" style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "4rem 4rem", maskImage: "radial-gradient(circle at center, black, transparent 80%)", WebkitMaskImage: "radial-gradient(circle at center, black, transparent 80%)", opacity: 0.03 }}></div>

      {/* Navigation */}
      <nav className="lg:px-8 flex animate-fade-up w-full h-24 max-w-7xl mr-auto ml-auto pr-6 pl-6 items-center justify-between z-50">
        <div className="flex gap-2 text-xl text-foreground tracking-tight items-center font-heading font-medium">
          <Logo className="size-9 text-foreground" />
          Aesthetic AI
        </div>
        <div className="hidden md:flex gap-8 text-sm text-muted-foreground items-center font-mono">
          <a href="#engine" className="hover:text-foreground transition-colors">Engine</a>
          <a href="/image-generation" className="hover:text-foreground transition-colors">Gallery</a>
          <a href="#models" className="hover:text-foreground transition-colors">Models</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </div>
        
        <div className="btn-wrapper scale-90 md:scale-100">
          <a href="/image-generation" className="btn !font-bold !text-[12px] !tracking-widest !font-mono !h-10 !rounded-full !pr-8 !pl-8">
            Start Generating
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
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="lg:px-8 lg:pt-32 lg:pb-40 flex flex-col lg:flex-row max-w-7xl mr-auto ml-auto pt-24 pr-6 pb-32 pl-6 items-center relative overflow-hidden">
          <div className="flex-1 lg:text-left z-10 text-center">
            <div className="inline-flex gap-2 animate-fade-up uppercase text-[10px] font-medium text-muted-foreground tracking-[0.2em] font-mono bg-muted border-border border rounded-full mb-8 pt-1.5 pr-4 pb-1.5 pl-4 items-center">
              FLUX.1 [schnell] Integration Live
              <span className="size-1.5 rounded-full bg-foreground animate-pulse shadow-[0_0_8px_currentColor]"></span>
            </div>
            
            <h1 className="md:text-6xl lg:text-7xl leading-[1.05] animate-fade-up delay-100 text-4xl font-medium text-foreground tracking-tight font-heading mb-6">
              Synthesize the visual essence of your next masterpiece
            </h1>
            
            <p className="md:text-xl lg:mx-0 leading-relaxed animate-fade-up delay-200 text-lg font-medium text-muted-foreground font-heading max-w-2xl mr-auto mb-10 ml-auto translate-x-1">
              The ultimate aesthetic engine for designers crafting sophisticated, high-fidelity AI imagery. Build complex prompts with advanced refinement and generate via FLUX ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 lg:justify-start animate-fade-up delay-300 items-center justify-center mt-10">
              <div className="btn-wrapper">
                <a href="/image-generation" className="btn !font-bold !text-[12px] !tracking-widest !font-mono !h-12 !rounded-full !pr-10 !pl-10">
                  Start Generating
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
              <span className="flex items-center gap-2 text-sm text-muted-foreground font-mono group cursor-pointer hover:text-foreground transition-colors">
                See it in action
                <PlayCircle className="size-5 group-hover:scale-110 transition-transform" />
              </span>
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
                      <p className="mb-1 font-mono text-[10px] tracking-widest text-[#aaaaaa]">MASTERY</p>
                      <h3 className="font-heading text-xl font-medium leading-tight tracking-tight text-white">
                        Urban Synthesis
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
                    <div className="pointer-events-none absolute top-5 right-5 z-30 rounded-md border border-border bg-background/90 px-3 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
                      FLUX.1 Powered
                    </div>
                    <div className="pointer-events-none absolute bottom-8 left-6 right-6 z-20">
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/70">
                        Aesthetic Prompt
                      </p>
                      <h3 className="mb-3 font-heading text-3xl font-medium leading-tight tracking-tight text-white">
                        Architectural Glimpse
                      </h3>
                      <p className="font-mono text-xs italic text-white/50">Styled with FLUX.1</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="lg:px-8 max-w-7xl mr-auto mb-32 ml-auto pr-6 pl-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-8 rounded-3xl flex flex-col hover:border-foreground/20 hover:-translate-y-1 transition-all group">
              <h2 className="text-4xl tracking-tighter text-foreground mb-2 font-heading font-medium group-hover:scale-105 transition-transform origin-left">4.2s</h2>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">Average generation time powered by FLUX [schnell].</p>
            </div>
            <div className="glass-panel p-8 rounded-3xl flex flex-col hover:border-foreground/20 hover:-translate-y-1 transition-all group">
              <h2 className="text-4xl tracking-tighter text-foreground mb-2 font-heading font-medium group-hover:scale-105 transition-transform origin-left">1.2M+</h2>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">Unique aesthetic masterworks generated daily.</p>
            </div>
            <div className="glass-panel flex flex-col text-foreground rounded-3xl p-8 relative overflow-hidden hover:border-foreground/20 hover:-translate-y-1 transition-all group">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
              <span className="text-[10px] font-bold tracking-widest uppercase mb-2 text-muted-foreground/60 font-mono z-10">Output</span>
              <h2 className="text-4xl tracking-tighter text-foreground mb-2 font-heading font-bold z-10">98%</h2>
              <p className="text-xs text-muted-foreground/80 font-mono font-medium z-10">Quality rating for complex prompt adherence.</p>
            </div>
            <div className="glass-panel p-8 rounded-3xl flex flex-col hover:border-foreground/20 hover:-translate-y-1 transition-all group">
              <h2 className="text-4xl tracking-tighter text-foreground mb-2 font-heading font-medium group-hover:scale-105 transition-transform origin-left">20+</h2>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">Pro-grade style frameworks for diverse aesthetics.</p>
            </div>
          </div>
        </section>

        {/* Narrative Engine UI */}
        <section className="border-y bg-muted/30 border-border py-32 relative overflow-hidden" id="engine">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none will-change-transform"></div>

          <div className="lg:px-8 max-w-6xl mr-auto ml-auto pr-6 pl-6">
            <div className="text-center mb-20 animate-fade-up">
              <span className="text-[10px] font-medium tracking-[0.3em] text-muted-foreground uppercase mb-4 block font-mono">The Core Workflow</span>
              <h2 className="md:text-6xl text-4xl text-foreground tracking-tighter mb-6 font-heading font-medium">The Aesthetic Engine</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-heading leading-relaxed">
                Intelligent prompt refinement for high-fidelity synthesis with the FLUX ecosystem.
              </p>
            </div>

            <div className="glass-panel bg-card/50 rounded-3xl p-1 relative shadow-2xl overflow-hidden">
              <div className="flex bg-muted/50 h-12 border-b border-border px-6 gap-3 items-center">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-border"></div>
                  <div className="size-3 rounded-full bg-border"></div>
                  <div className="size-3 rounded-full bg-border"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background rounded-full px-4 py-1 border border-border text-[10px] text-muted-foreground font-mono tracking-wide">
                    app.storielle.com/engine
                  </div>
                </div>
              </div>

              <div className="md:p-12 p-6 grid grid-cols-1 lg:grid-cols-12 gap-12 bg-card/30 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-0 right-0 size-[400px] bg-orange-500/10 blur-[80px] rounded-full"></div>
                  <div className="absolute bottom-0 left-0 size-[300px] bg-primary/10 blur-[60px] rounded-full"></div>
                </div>

                <div className="lg:col-span-4 space-y-8 z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Map className="size-5 text-foreground" />
                      <h3 className="font-semibold text-lg text-foreground tracking-tight font-heading">Environments</h3>
                    </div>

                    <div className="space-y-3">
                      {["Dystopian Megacity", "Isolated Space Station", "Neo-Victorian London", "Underground Syndicate"].map((env, i) => (
                        <label key={env} className="flex items-center gap-4 p-4 border border-border rounded-2xl cursor-pointer hover:border-foreground/20 hover:bg-foreground/[0.02] transition-all group">
                          <input type="checkbox" className="tech-checkbox" defaultChecked={i === 0 || i === 3} />
                          <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors tracking-wide font-mono uppercase">{env}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="w-full bg-foreground text-background py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
                      Generate Structure
                    </button>
                    <p className="text-center text-[10px] text-muted-foreground/60 mt-4 font-mono uppercase tracking-tighter">Draft 12.4 • image_seed_8122</p>
                  </div>
                </div>

                <div className="lg:col-span-8 flex flex-col z-10">
                  <div className="flex mb-8 gap-3 items-center">
                    <Logo className="size-6 text-foreground" />
                    <h3 className="text-xl font-semibold text-foreground tracking-tight font-heading">Styles & Archetypes</h3>
                  </div>

                  <div className="bg-background/80 w-full h-[520px] border border-border rounded-3xl relative flex items-center justify-center perspective-distant overflow-hidden">
                    <div className="absolute inset-x-6 flex justify-between z-50 top-1/2 -translate-y-1/2 pointer-events-none">
                      <button onClick={prevSlide} className="size-12 rounded-full bg-card/40 border border-border text-foreground flex items-center justify-center backdrop-blur-xl pointer-events-auto hover:bg-foreground hover:text-background transition-all hover:scale-110 shadow-2xl">
                        <ChevronLeft className="size-6" />
                      </button>
                      <button onClick={nextSlide} className="size-12 rounded-full bg-card/40 border border-border text-foreground flex items-center justify-center backdrop-blur-xl pointer-events-auto hover:bg-foreground hover:text-background transition-all hover:scale-110 shadow-2xl">
                        <ChevronRight className="size-6" />
                      </button>
                    </div>

                    <div className="relative w-[280px] h-[400px] transform-style-preserve-3d flex items-center justify-center">
                      {archetypes.map((archetype, index) => {
                        const offset = (index - activeIndex + archetypes.length) % archetypes.length;
                        let transform = "";
                        let opacity = 0;
                        let zIndex = 0;
                        let pointerEvents: CSSProperties["pointerEvents"] = "none";

                        if (offset === 0) {
                          transform = "translateX(0) translateZ(0) rotateY(0) scale(1.05)";
                          opacity = 1;
                          zIndex = 100;
                          pointerEvents = "auto";
                        } else if (offset === 1) {
                          transform = "translateX(160px) translateZ(-160px) rotateY(-15deg) scale(0.85)";
                          opacity = 0.7;
                          zIndex = 90;
                        } else if (offset === 2) {
                          transform = "translateX(320px) translateZ(-320px) rotateY(-30deg) scale(0.75)";
                          opacity = 0.4;
                          zIndex = 80;
                        } else if (offset === archetypes.length - 1) {
                          transform = "translateX(-160px) translateZ(-160px) rotateY(15deg) scale(0.85)";
                          opacity = 0.7;
                          zIndex = 90;
                        } else {
                          transform = "translateX(0) translateZ(-600px) scale(0.5)";
                          opacity = 0;
                          zIndex = 10;
                        }

                        return (
                          <div key={archetype.id} className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group will-change-transform" style={{ transform, opacity, zIndex, pointerEvents }}>
                            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-card shadow-2xl border border-border group-hover:border-foreground/20 transition-all">
                              <Image
                                src={archetype.image}
                                alt={`${archetype.title} aesthetic preview`}
                                fill
                                className="object-cover brightness-[0.6] group-hover:brightness-90 transition-all duration-500 scale-105 group-hover:scale-100"
                                sizes="280px"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                              <div className="absolute bottom-0 inset-x-0 p-8 pt-24 bg-gradient-to-t from-black via-black/80 to-transparent">
                                <h4 className="text-xl font-bold text-white tracking-tight mb-2 font-heading">{archetype.title}</h4>
                                <p className="text-xs text-white/60 leading-relaxed font-mono font-medium line-clamp-2">{archetype.description}</p>
                              </div>
                              {offset === 0 && (
                                <div className="absolute top-6 right-6 size-3 bg-white rounded-full shadow-[0_0_20px_white]"></div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="absolute bottom-10 flex gap-3 z-50">
                      {archetypes.map((_, i) => (
                        <div key={i} onClick={() => setActiveIndex(i)} className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === activeIndex ? "w-8 bg-foreground shadow-[0_0_10px_currentColor]" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="lg:px-8 py-32 max-w-7xl mx-auto px-6 relative z-10" id="pricing">
          <div className="text-center mb-20 animate-fade-up">
            <span className="uppercase block text-[10px] font-bold text-muted-foreground tracking-[0.4em] mb-4 font-mono">Investment</span>
            <h2 className="md:text-5xl text-3xl text-foreground tracking-tight mb-4 font-heading font-medium">Plans for every creator.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-heading font-medium">
              Start prototyping for free, or unlock the full power of the Aesthetic Engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch w-full max-w-6xl mx-auto">
            {/* Creator Plan */}
            <div className="glass-panel flex flex-col p-10 rounded-[2.5rem] border-border hover:border-foreground/20 transition-colors relative group">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl border border-border bg-muted flex items-center justify-center text-muted-foreground">
                  <BookOpen className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl text-foreground font-bold tracking-tight font-heading">The Creator</h3>
                  <p className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-widest font-bold">Entry level</p>
                </div>
              </div>
              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl tracking-tighter text-foreground font-heading font-bold">$0</span>
                  <span className="text-xs text-muted-foreground font-mono uppercase">Images Incl.</span>
                </div>
              </div>
               <ul className="space-y-4 mb-auto text-sm text-muted-foreground font-mono font-medium">
                <li className="flex gap-3 items-center"><Check className="size-4 text-primary" /><span>100 Generations / mo</span></li>
                <li className="flex gap-3 items-center"><Check className="size-4 text-primary" /><span>Base-model access</span></li>
                <li className="flex gap-3 items-center"><Check className="size-4 text-primary" /><span>Standard History</span></li>
              </ul>
              <button className="w-full mt-12 py-4 rounded-2xl border border-border hover:border-foreground/40 transition-all font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">Start Creating</button>
            </div>

            {/* Pro Plan */}
            <div className="relative group rounded-[2.5rem] p-[2px] overflow-hidden shadow-2xl flex flex-col">
              <div className="absolute inset-0 bg-muted z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[12rem] bg-gradient-to-b from-transparent via-primary/30 to-transparent opacity-60 animate-[rotatePlan_10s_linear_infinite]" style={{ transformOrigin: "center center" }}></div>
              </div>
              <div className="flex flex-col flex-1 bg-card rounded-[2.4rem] p-10 relative z-10 border border-border">
                <div className="absolute top-0 right-10 -translate-y-1/2">
                   <span className="text-[10px] font-bold text-white tracking-[0.2em] bg-primary rounded-full py-1.5 px-5 shadow-xl font-mono uppercase">Popular</span>
                </div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="size-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary"><Sparkle className="size-6" /></div>
                  <div>
                    <h3 className="text-xl text-foreground font-bold tracking-tight font-heading">Pro Designer</h3>
                    <p className="text-[10px] text-primary/70 font-mono uppercase tracking-widest font-bold">High-fidelity</p>
                  </div>
                </div>
                <div className="mb-10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl tracking-tighter text-foreground font-heading font-bold">$12</span>
                    <span className="text-xs text-muted-foreground font-mono uppercase">/ month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-auto text-sm text-foreground/80 font-mono font-medium">
                  <li className="flex gap-3 items-center"><Check className="size-4 text-primary" /><span>Unlimited Generations</span></li>
                  <li className="flex gap-3 items-center"><Check className="size-4 text-primary" /><span>Prompt Refinement</span></li>
                  <li className="flex gap-3 items-center"><Check className="size-4 text-primary" /><span>Full Control</span></li>
                </ul>
                <button className="w-full mt-12 py-5 rounded-2xl bg-foreground text-background font-bold text-xs uppercase tracking-widest shadow-xl">Get Full Access</button>
              </div>
            </div>

            {/* Studio Plan */}
            <div className="glass-panel flex flex-col p-10 rounded-[2.5rem] border-border hover:border-foreground/20 transition-colors relative group">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl border border-border bg-muted flex items-center justify-center text-foreground"><Users className="size-6" /></div>
                <div>
                  <h3 className="text-xl text-foreground font-bold tracking-tight font-heading">The Studio</h3>
                  <p className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-widest font-bold">For agencies</p>
                </div>
              </div>
              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl tracking-tighter text-foreground font-heading font-bold">$29</span>
                  <span className="text-xs text-muted-foreground font-mono uppercase">/ month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-auto text-sm text-muted-foreground font-mono font-medium">
                <li className="flex gap-3 items-center"><Check className="size-4 text-foreground" /><span>Everything in Pro</span></li>
                <li className="flex gap-3 items-center"><Check className="size-4 text-foreground" /><span>Team Assets</span></li>
                <li className="flex gap-3 items-center"><Check className="size-4 text-foreground" /><span>Tuned Models</span></li>
              </ul>
              <button className="w-full mt-12 py-4 rounded-2xl border border-border hover:border-foreground/20 transition-all font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">Contact for Teams</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border pt-32 pb-20 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 mb-20">
          <div className="space-y-8">
            <div className="flex gap-2 text-2xl text-foreground tracking-tight items-center font-heading font-medium">
              <Logo className="size-8 text-foreground" />
              Aesthetic AI
            </div>
            <p className="text-sm text-muted-foreground font-heading leading-relaxed max-w-xs">Synthesize your next aesthetic masterpiece with high-fidelity AI models.</p>
            <div className="flex gap-5 text-muted-foreground/60">
              <Send className="size-5 cursor-pointer hover:text-foreground" />
              <MessageSquare className="size-5 cursor-pointer hover:text-foreground" />
              <Camera className="size-5 cursor-pointer hover:text-foreground" />
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold text-foreground uppercase tracking-[0.2em] font-mono">Synthesis Engine</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-mono">
              <li className="hover:text-foreground cursor-pointer">Core Synthesis</li>
              <li className="hover:text-foreground cursor-pointer">Style Library</li>
              <li className="hover:text-foreground cursor-pointer">Prompt Refinement</li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold text-foreground uppercase tracking-[0.2em] font-mono">Platform</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-mono">
              <li className="hover:text-foreground cursor-pointer"><a href="/image-generation">Gallery Explorer</a></li>
              <li className="hover:text-foreground cursor-pointer"><a href="#pricing">Creator Plans</a></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold text-foreground uppercase tracking-[0.2em] font-mono">Ethos</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-mono">
              <li className="hover:text-foreground cursor-pointer">Documentation</li>
              <li className="hover:text-foreground cursor-pointer">AI Ethics Policy</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground/40 text-[10px] font-mono uppercase tracking-[0.3em]">© 2026 Aesthetic AI. All rights reserved.</p>
          <div className="flex gap-8 text-[10px] text-muted-foreground/40 font-mono uppercase tracking-widest">
            <span className="hover:text-foreground cursor-pointer">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
