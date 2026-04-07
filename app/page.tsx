'use client'
import { useState, memo } from "react";
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
      <div className="w-full h-full bg-[#050505] relative">
        {/* Layered CSS glows for a deep, high-end feel */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-amber-500/5 blur-[80px] rounded-full"></div>
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
    <div className="selection:bg-white selection:text-black flex flex-col min-h-screen text-base relative bg-[#050505] text-white font-sans antialiased overflow-x-hidden">
   

      <HeroBackground />

      {/* Grid Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-[-1]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "4rem 4rem", maskImage: "radial-gradient(circle at center, black, transparent 80%)", WebkitMaskImage: "radial-gradient(circle at center, black, transparent 80%)" }}></div>

      {/* Navigation */}
      <nav className="lg:px-8 flex animate-fade-up w-full h-24 max-w-7xl mr-auto ml-auto pr-6 pl-6 items-center justify-between z-50">
        <div className="flex gap-2 text-xl text-white tracking-tight items-center font-heading font-medium">
          <Logo className="md:w-9 md:h-9 w-8 h-8 text-white" />
          Aesthetic AI
        </div>
        <div className="hidden md:flex gap-8 text-sm text-[#888888] items-center font-mono">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Publishing</a>
          <a href="#" className="hover:text-white transition-colors">Wattpad Sync</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        
        <a href="#engine" className="inline-flex scale-90 md:scale-100 transition-all hover:scale-105 active:scale-95 group">
          <button type="button" className="inline-flex text-[12px] font-bold text-black tracking-widest font-mono h-10 rounded-full pr-8 pl-8 relative items-center justify-center bg-white shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)] transition-all">
            Start Your Blueprint
          </button>
        </a>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="lg:px-8 lg:pt-32 lg:pb-40 flex flex-col lg:flex-row max-w-7xl mr-auto ml-auto pt-24 pr-6 pb-32 pl-6 items-center relative overflow-hidden">
          <div className="flex-1 lg:text-left z-10 text-center">
            <div className="inline-flex gap-2 animate-fade-up uppercase text-[10px] font-medium text-[#888888] tracking-[0.2em] font-mono bg-[#111111] border-[#222222] border rounded-full mb-8 pt-1.5 pr-4 pb-1.5 pl-4 items-center">
              Wattpad Integration Live
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]"></span>
            </div>
            
            <h1 className="md:text-6xl lg:text-7xl leading-[1.05] animate-fade-up delay-100 text-4xl font-medium text-white tracking-tight font-heading mb-6">
              Create the architecture of your next masterwork
            </h1>
            
            <p className="md:text-xl lg:mx-0 leading-relaxed animate-fade-up delay-200 text-lg font-medium text-[#888888] font-heading max-w-2xl mr-auto mb-10 ml-auto translate-x-1">
              The ultimate aesthetic engine for designers crafting sophisticated, high-fidelity AI imagery. Build complex prompts, weave intricate styles, and generate directly.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 lg:justify-start animate-fade-up delay-300 items-center justify-center">
              <a href="#engine" className="inline-flex transition-all hover:scale-105 active:scale-95 group">
                <button type="button" className="inline-flex text-[12px] font-bold text-black tracking-widest font-mono h-12 rounded-full pr-10 pl-10 relative items-center justify-center bg-white shadow-[0_15px_40px_rgba(255,255,255,0.15)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.25)] transition-all">
                  Start Your Blueprint
                </button>
              </a>
              <span className="flex items-center gap-2 text-sm text-[#555555] font-mono group cursor-pointer hover:text-white transition-colors">
                See it in action
                <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </span>
            </div>
          </div>

          <div className="flex-1 hidden lg:block animate-fade-up delay-200 w-full h-[600px] max-w-lg relative perspective-normal transform-style-preserve-3d mt-12 lg:mt-0">
            {/* Back right cover */}
            <div className="aspect-[2/3] overflow-hidden book-float-2 opacity-40 w-64 z-10 border-[#333333] border rounded-2xl absolute top-10 right-4 shadow-2xl" style={{ maskImage: "linear-gradient(0deg, transparent, black 0%, black 100%, transparent)", WebkitMaskImage: "linear-gradient(0deg, transparent, black 0%, black 100%, transparent)" }}>
              <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4d3f4658-ecfd-47b7-8318-ab5e0f7dba77_800w.webp" alt="Cover background" className="w-full h-full object-cover grayscale opacity-50" />
              <div className="z-10 bg-gradient-to-t from-black/10 via-black/0 to-black/10 absolute inset-0 translate-x-1"></div>
            </div>
            {/* Back left cover */}
            <div className="aspect-[2/3] overflow-hidden book-float-1 opacity-60 w-64 border-[#333333] border rounded-2xl absolute top-20 left-0 shadow-2xl" style={{ maskImage: "linear-gradient(0deg, transparent, black 0%, black 100%, transparent)", WebkitMaskImage: "linear-gradient(0deg, transparent, black 0%, black 100%, transparent)" }}>
              <div className="bg-gradient-to-t from-black via-black/40 to-transparent z-10 absolute inset-0"></div>
              <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/95719f33-05ac-4a57-b882-0015d0b8af8b_800w.webp" alt="Cover background" className="w-full h-full object-cover" />
              <div className="absolute bottom-6 left-4 right-4 z-20">
                <p className="text-[10px] tracking-widest text-[#aaaaaa] mb-1 font-mono">THRILLER</p>
                <h3 className="text-xl tracking-tight text-white leading-tight font-heading font-medium">The Velvet Shadow</h3>
              </div>
            </div>
            {/* Main front cover */}
            <div className="-translate-x-1/2 aspect-[2/3] overflow-hidden z-20 transition-transform duration-500 hover:scale-105 w-80 border-[#444444] border rounded-[2rem] absolute top-0 left-1/2 shadow-[0_20px_80px_rgba(0,0,0,1)]" style={{ maskImage: "linear-gradient(0deg, transparent, black 0%, black 100%, transparent)", WebkitMaskImage: "linear-gradient(0deg, transparent, black 0%, black 100%, transparent)" }}>
              <div className="z-10 bg-gradient-to-t from-[#080808] via-black/20 to-transparent absolute inset-0"></div>
              <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c43265c1-3d68-44f0-b248-d7969e9fed75_800w.webp" alt="Cover background" className="w-full h-full object-cover" />
              <div className="text-[0.65rem] uppercase font-semibold text-amber-600 tracking-wider font-mono bg-white/90 z-30 rounded-md py-1 px-3 absolute top-6 right-6">
                Wattpad Hit
              </div>
              <div className="absolute bottom-10 left-8 right-8 z-20">
                <p className="text-[10px] tracking-widest text-white/70 mb-2 uppercase font-mono">Sci-Fi Romance</p>
                <h3 className="text-3xl tracking-tight text-white leading-tight mb-3 font-heading font-medium">Echoes of Neon</h3>
                <p className="text-xs text-white/50 font-mono italic">By A. K. Writer</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="lg:px-8 max-w-7xl mr-auto mb-32 ml-auto pr-6 pl-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-8 rounded-3xl flex flex-col hover:border-[#444444] transition-all group">
              <h2 className="text-4xl tracking-tighter text-white mb-2 font-heading font-medium group-hover:scale-105 transition-transform origin-left">2.5M</h2>
              <p className="text-xs text-[#888888] font-mono leading-relaxed">Chapters published to Wattpad via our sync engine.</p>
            </div>
            <div className="glass-panel p-8 rounded-3xl flex flex-col hover:border-[#444444] transition-all group">
              <h2 className="text-4xl tracking-tighter text-white mb-2 font-heading font-medium group-hover:scale-105 transition-transform origin-left">120k+</h2>
              <p className="text-xs text-[#888888] font-mono leading-relaxed">Active writers crafting daily masterpieces.</p>
            </div>
            <div className="glass-panel flex flex-col text-black bg-white border-white rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1739349926071-a4ef4ad781f7?w=800&q=80)] bg-cover bg-center opacity-10 group-hover:scale-110 transition-transform duration-700"></div>
              <span className="text-[10px] font-bold tracking-widest uppercase mb-2 opacity-50 font-mono z-10">Success</span>
              <h2 className="text-4xl tracking-tighter mb-2 font-heading font-bold z-10">84%</h2>
              <p className="text-xs opacity-70 font-mono font-medium z-10">Higher reader retention rates compared to standard drafts.</p>
            </div>
            <div className="glass-panel p-8 rounded-3xl flex flex-col hover:border-[#444444] transition-all group">
              <h2 className="text-4xl tracking-tighter text-white mb-2 font-heading font-medium group-hover:scale-105 transition-transform origin-left">15+</h2>
              <p className="text-xs text-[#888888] font-mono leading-relaxed">Pro-grade genre frameworks for complex narratives.</p>
            </div>
          </div>
        </section>

        {/* Narrative Engine UI */}
        <section className="border-y bg-[#0a0a0a] border-[#222222] py-32 relative overflow-hidden" id="engine">
          {/* Subtle glow behind section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none will-change-transform"></div>

          <div className="lg:px-8 max-w-6xl mr-auto ml-auto pr-6 pl-6">
            <div className="text-center mb-20 animate-fade-up">
              <span className="text-[10px] font-medium tracking-[0.3em] text-[#888888] uppercase mb-4 block font-mono">The Core Workflow</span>
              <h2 className="md:text-6xl text-4xl text-white tracking-tighter mb-6 font-heading font-medium">The Aesthetic Engine</h2>
              <p className="text-lg text-[#888888] max-w-2xl mx-auto font-heading leading-relaxed">
                Select high-level parameters to generate structural foundations for your next visual masterpiece.
              </p>
            </div>

            {/* Main UI Dashboard Container */}
            <div className="glass-panel bg-[#111] rounded-3xl p-1 relative shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Dashboard header mock */}
              <div className="flex bg-[#181818] h-12 border-b border-[#222] px-6 gap-3 items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-[#050505] rounded-full px-4 py-1 border border-[#222] text-[10px] text-[#555] font-mono tracking-wide">
                    app.storielle.com/engine
                  </div>
                </div>
              </div>

              <div className="md:p-12 p-6 grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#0a0a0a] relative overflow-hidden">
                {/* Decorative background for dashboard */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[80px] rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 blur-[60px] rounded-full"></div>
                </div>

                {/* Left Column: Settings */}
                <div className="lg:col-span-4 space-y-8 z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Map className="w-5 h-5 text-white" />
                      <h3 className="font-semibold text-lg text-white tracking-tight font-heading">Environments</h3>
                    </div>

                    <div className="space-y-3">
                      {["Dystopian Megacity", "Isolated Space Station", "Neo-Victorian London", "Underground Syndicate"].map((env, i) => (
                        <label key={env} className="flex items-center gap-4 p-4 border border-[#222] rounded-2xl cursor-pointer hover:border-white/20 hover:bg-white/[0.02] transition-all group">
                          <input type="checkbox" className="tech-checkbox" defaultChecked={i === 0 || i === 3} />
                          <span className="text-xs font-semibold text-[#888888] group-hover:text-white transition-colors tracking-wide font-mono uppercase">{env}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="w-full bg-white text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                      Generate Structure
                    </button>
                    <p className="text-center text-[10px] text-[#555] mt-4 font-mono uppercase tracking-tighter">Draft 12.4 • narrative_seed_8122</p>
                  </div>
                </div>

                {/* Middle Column: Archetypes Grid */}
                <div className="lg:col-span-8 flex flex-col z-10">
                  <div className="flex mb-8 gap-3 items-center">
                    <Logo className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-semibold text-white tracking-tight font-heading">Styles & Archetypes</h3>
                  </div>

                  <div className="bg-[#050505]/80 w-full h-[520px] border border-[#222] rounded-3xl relative flex items-center justify-center perspective-distant overflow-hidden">
                    
                    {/* Navigation Buttons */}
                    <div className="absolute inset-x-6 flex justify-between z-50 top-1/2 -translate-y-1/2 pointer-events-none">
                      <button 
                        onClick={prevSlide}
                        className="w-12 h-12 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center backdrop-blur-xl pointer-events-auto hover:bg-white hover:text-black transition-all hover:scale-110 shadow-2xl"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={nextSlide}
                        className="w-12 h-12 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center backdrop-blur-xl pointer-events-auto hover:bg-white hover:text-black transition-all hover:scale-110 shadow-2xl"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Deck Carousel */}
                    <div className="relative w-[280px] h-[400px] transform-style-preserve-3d flex items-center justify-center">
                      {archetypes.map((archetype, index) => {
                        // Calculate offset from current active index
                        const offset = (index - activeIndex + archetypes.length) % archetypes.length;
                        
                        // Positioning logic for "deck" stack
                        // 0 is front, 1 is right, 2 is far right, length-1 is behind-left
                        let transform = "";
                        let opacity = 0;
                        let zIndex = 0;
                        let pointerEvents = "none";

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
                          <div 
                            key={archetype.id}
                            className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group will-change-transform"
                            style={{ transform, opacity, zIndex, pointerEvents: pointerEvents as any }}
                          >
                            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[#111] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-[#222] group-hover:border-[#444] transition-all">
                              <img src={archetype.image} className="w-full h-full object-cover brightness-[0.6] group-hover:brightness-90 transition-all duration-500 scale-105 group-hover:scale-100" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                              <div className="absolute bottom-0 inset-x-0 p-8 pt-24 bg-gradient-to-t from-black via-black/80 to-transparent">
                                <h4 className="text-xl font-bold text-white tracking-tight mb-2 font-heading">{archetype.title}</h4>
                                <p className="text-xs text-white/60 leading-relaxed font-mono font-medium line-clamp-2">{archetype.description}</p>
                              </div>
                              {offset === 0 && (
                                <div className="absolute top-6 right-6 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_white]"></div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-10 flex gap-3 z-50">
                      {archetypes.map((_, i) => (
                        <div 
                          key={i}
                          onClick={() => setActiveIndex(i)}
                          className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                            i === activeIndex 
                              ? "w-8 bg-white shadow-[0_0_10px_white]" 
                              : "w-1.5 bg-white/20 hover:bg-white/40"
                          }`}
                        />
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
            <span className="uppercase block text-[10px] font-bold text-[#888888] tracking-[0.4em] mb-4 font-mono">Investment</span>
            <h2 className="md:text-5xl text-3xl text-white tracking-tight mb-4 font-heading font-medium">Plans for every writer.</h2>
            <p className="text-lg text-[#888888] max-w-2xl mx-auto font-heading font-medium">
              Start prototyping for free, or unlock the full power of the Narrative Engine to master your genre.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch w-full max-w-6xl mx-auto">
            {/* Sketchbook Plan */}
            <div className="glass-panel flex flex-col p-10 rounded-[2.5rem] border-[#222] hover:border-[#333] transition-colors relative group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl border border-[#222] bg-[#111] flex items-center justify-center text-[#888]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl text-white font-bold tracking-tight font-heading">The Sketchbook</h3>
                  <p className="text-[10px] text-[#555] font-mono uppercase tracking-widest font-bold">Essential tools</p>
                </div>
              </div>
              
              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl tracking-tighter text-white font-heading font-bold">$0</span>
                  <span className="text-xs text-[#888] font-mono uppercase">forever</span>
                </div>
              </div>

               <ul className="space-y-4 mb-auto text-sm text-[#888] font-mono font-medium">
                <li className="flex gap-3 items-center">
                  <Check className="w-4 h-4 text-white" />
                  <span>1 Active project limit</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Check className="w-4 h-4 text-white" />
                  <span>Basic world-building tools</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Check className="w-4 h-4 text-white" />
                  <span>Standard community access</span>
                </li>
              </ul>

              <button className="w-full mt-12 py-4 rounded-2xl border border-white/10 hover:border-white/40 transition-all font-bold text-xs uppercase tracking-widest text-[#888] hover:text-white group-hover:bg-white/[0.02]">
                Start Creating
              </button>
            </div>

            {/* Architect Plan */}
            <div className="relative group rounded-[2.5rem] p-[2px] overflow-hidden shadow-[0_0_80px_rgba(147,51,234,0.15)] flex flex-col">
              <div className="absolute inset-0 bg-[#222] z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[12rem] bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-60 animate-[rotatePlan_10s_linear_infinite]" style={{ transformOrigin: "center center" }}></div>
              </div>

              <div className="flex flex-col flex-1 bg-[#0a0a0a] rounded-[2.4rem] p-10 relative z-10 border-white/[0.02] border-inset">
                <div className="absolute top-0 right-10 -translate-y-1/2">
                  <span className="text-[10px] font-bold text-white tracking-[0.2em] bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full py-1.5 px-5 shadow-[0_10px_20px_rgba(147,51,234,0.3)] font-mono uppercase">Popular</span>
                </div>

                 <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sparkle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl text-white font-bold tracking-tight font-heading">The Architect</h3>
                    <p className="text-[10px] text-purple-400/70 font-mono uppercase tracking-widest font-bold">For pro designers</p>
                  </div>
                </div>
                
                <div className="mb-10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl tracking-tighter text-white font-heading font-bold">$12</span>
                    <span className="text-xs text-[#888] font-mono uppercase">/ month</span>
                  </div>
                  <p className="text-[10px] text-[#555] mt-2 font-mono uppercase font-bold">$144 billed annually</p>
                </div>

                 <ul className="space-y-4 mb-auto text-sm text-[#ddd] font-mono font-medium">
                  <li className="flex gap-3 items-center">
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                    <span>Unlimited active projects</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                    <span>Advanced narrative plot trees</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                    <span>Direct Wattpad Sync & Export</span>
                  </li>
                </ul>

                <button className="w-full mt-12 py-5 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Get Full Access
                </button>
              </div>
            </div>

            {/* Collective Plan */}
             <div className="glass-panel flex flex-col p-10 rounded-[2.5rem] border-[#222] hover:border-[#333] transition-colors relative group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl border border-[#222] bg-[#111] flex items-center justify-center text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl text-white font-bold tracking-tight font-heading">The Collective</h3>
                  <p className="text-[10px] text-[#555] font-mono uppercase tracking-widest font-bold">For writing rooms</p>
                </div>
              </div>
              
              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl tracking-tighter text-white font-heading font-bold">$29</span>
                  <span className="text-xs text-[#888] font-mono uppercase">/ month</span>
                </div>
              </div>

               <ul className="space-y-4 mb-auto text-sm text-[#888] font-mono font-medium">
                <li className="flex gap-3 items-center">
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-white">Everything in Architect</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Check className="w-4 h-4 text-white" />
                  <span>Co-writing collaboration hub</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Check className="w-4 h-4 text-white" />
                  <span>Custom genre AI models</span>
                </li>
              </ul>

              <button className="w-full mt-12 py-4 rounded-2xl border border-[#333] hover:border-[#555] transition-all font-bold text-xs uppercase tracking-widest text-[#888] hover:text-white">
                Contact for Teams
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#222] py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex gap-2 text-xl text-white tracking-tight items-center font-heading font-medium">
            <Logo className="w-7 h-7 text-white" />
            Aesthetic AI
          </div>
          <p className="text-[#555] text-[10px] font-mono uppercase tracking-widest">
            © 2026 Aesthetic AI Labs. All rights reserved.
          </p>
          <div className="flex gap-6 text-[#888]">
            <Send className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            <MessageSquare className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            <Camera className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
