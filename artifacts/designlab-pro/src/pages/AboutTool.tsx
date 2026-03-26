import React from "react";
import { 
  Info, ShieldCheck, Zap, Globe, HardDrive, 
  Code2, Palette, Library, Sparkles, Layout, 
  Cpu, Layers, Smartphone, Github, ExternalLink,
  Type, Scaling, Box, Image as ImageIcon, Wand2, Radius, LayoutGrid, Braces,
  User, GraduationCap, Wrench, MapPin, Calendar, Briefcase, Mail, Heart
} from "lucide-react";

export default function AboutTool() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-12 max-w-6xl mx-auto h-full scroll-smooth">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-12 relative animate-in fade-in duration-1000">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[120px] rounded-full -z-10" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-display font-bold text-sm mb-4 border border-primary/20">
          <Sparkles size={16} />
          <span>v2.0.0 Stable Release</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight">
          DesignLab <span className="text-primary italic">Pro</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
          The World's Most Complete <span className="text-foreground">Offline-First</span> Universal Design System Playground.
        </p>
        
        <div className="flex justify-center gap-4 pt-8">
           <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-40" />
        </div>
      </section>

      {/* Philosophy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-8 space-y-4 hover:border-primary/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <HardDrive size={28} />
          </div>
          <h3 className="text-2xl font-display font-bold">100% Offline-First</h3>
          <p className="text-muted-foreground leading-relaxed">
            Zero fetch() calls. Zero remote tracking. Everything runs locally in your browser, ensuring absolute privacy and instant execution.
          </p>
        </div>
        
        <div className="glass-panel p-8 space-y-4 hover:border-primary/50 transition-all group relative overflow-hidden border-primary/20">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors" />
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-2xl font-display font-bold">Zero-Library UI</h3>
          <p className="text-muted-foreground leading-relaxed">
            Built without generic UI kits. Every slider, color picker, and layout engine is custom-engineered for precision design control.
          </p>
        </div>

        <div className="glass-panel p-8 space-y-4 hover:border-primary/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Zap size={28} />
          </div>
          <h3 className="text-2xl font-display font-bold">Native Speed</h3>
          <p className="text-muted-foreground leading-relaxed">
            Optimized for 60FPS. CSS-driven animations, pure SVG rendering, and zero WebGL overhead for the smoothest design experience.
          </p>
        </div>
      </div>

      {/* Feature Showcase */}
      <section className="space-y-10 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-bold">The Design Toolbox</h2>
            <p className="text-muted-foreground">Comprehensive modules for every design decision.</p>
          </div>
          <div className="h-px flex-1 bg-border hidden md:block mx-8 opacity-50" />
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-secondary text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stable</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary">Pro Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Advanced Color Math", desc: "Hex, RGB, HSL, HSV, OKLCH, and CMYK interpolation with WCAG 2.1 contrast testing.", icon: Palette, color: "text-indigo-500" },
            { title: "UI Library Studio", desc: "Interactive showcase for Tailwind, Radix, MUI, and Mantine with live token mapping.", icon: Library, color: "text-blue-500" },
            { title: "Typography Lab", desc: "Variable font axis controls, fluid type scales, and OpenType feature visualizers.", icon: Type, color: "text-pink-500" },
            { title: "Animation Engine", desc: "60+ high-performance CSS keyframe templates with spring physics and bezier control.", icon: Sparkles, color: "text-amber-500" },
            { title: "Spacing Systems", desc: "Fibonacci, Golden Ratio, and 8pt grid generators for mathematically perfect layouts.", icon: Scaling, color: "text-emerald-500" },
            { title: "Shadow & Depth", desc: "Natural 8-layer elevation builder with real-time environment lighting simulation.", icon: Box, color: "text-purple-500" },
            { title: "Background Studio", desc: "80+ animated patterns, Aurora shifts, and frosted glass/glassmorphism engine.", icon: ImageIcon, color: "text-cyan-500" },
            { title: "Pro Code Editor", desc: "High-fidelity syntax highlighting with real-time project export and ZIP bundling.", icon: Code2, color: "text-orange-500" },
          ].map((feature, i) => (
            <div key={i} className="group p-6 rounded-3xl border border-border bg-surface hover:bg-surface2 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
              <div className={`mb-4 w-10 h-10 rounded-xl bg-secondary flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform`}>
                <feature.icon size={20} />
              </div>
              <h4 className="font-display font-bold text-base mb-2">{feature.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Developer Section */}
      <section className="space-y-10 py-12 border-t border-border/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-bold">Meet the Architect</h2>
            <p className="text-muted-foreground">The creative force behind DesignLab Pro.</p>
          </div>
          <div className="h-px flex-1 bg-border hidden md:block mx-8 opacity-50" />
          <div className="flex -space-x-4">
             <div className="w-14 h-14 rounded-full border-4 border-background bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-display font-bold text-xl shadow-xl z-10 transition-transform hover:scale-110">
               AS
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Bio Card */}
          <div className="lg:col-span-5 glass-panel p-8 space-y-8 relative overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 pointer-events-none">
              <User size={240} />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-3xl font-display font-extrabold tracking-tight">Abir Hasan Siam</h3>
                <p className="text-primary font-bold text-sm uppercase tracking-widest">Full-Stack Designer & Developer</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "Detail-oriented and curious, I enjoy experimenting with cross-platform solutions to keep projects clean, optimized, and professional."
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <MapPin size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Location</p>
                  <p className="text-sm font-medium">Gazipur, Dhaka, Bangladesh</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Calendar size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Origin & Bio</p>
                  <p className="text-sm font-medium">Tangail / 17 Nov 2002 (Age 22)</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Email</p>
                  <a href="mailto:abir2afridi@gmail.com" className="text-sm font-medium hover:text-primary transition-colors">abir2afridi@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 mt-auto">
              <a href="https://github.com/abir2afridi" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-secondary hover:bg-border transition-all text-xs font-bold uppercase tracking-widest">
                <Github size={16} /> GitHub
              </a>
              <a href="https://abir2afridi.vercel.app/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary text-white hover:shadow-lg hover:shadow-primary/25 transition-all text-xs font-bold uppercase tracking-widest outline-none ring-offset-2 focus:ring-2 ring-primary">
                <Globe size={16} /> Portfolio
              </a>
            </div>
          </div>

          {/* Education & Skills */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Education Column */}
              <div className="glass-panel p-8 space-y-6">
                <div className="flex items-center gap-2 text-primary">
                  <GraduationCap size={20} />
                  <h4 className="font-display font-bold text-lg">Academic Path</h4>
                </div>
                <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-border">
                  <div className="relative pl-8 group">
                    <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-surface border-2 border-primary z-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm font-bold leading-none">BSc in Computer Science</p>
                    <p className="text-xs text-muted-foreground mt-1">Independent University of Bangladesh</p>
                    <p className="text-[10px] font-bold text-primary uppercase mt-1">2021 - Present</p>
                  </div>
                  <div className="relative pl-8 group">
                    <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-surface border-2 border-border z-10 flex items-center justify-center group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-bold leading-none">HSC (Secondary Certificate)</p>
                    <p className="text-xs text-muted-foreground mt-1">Misir Ali Khan Memorial College</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase mt-1">2019 - 2020</p>
                  </div>
                  <div className="relative pl-8 group">
                    <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-surface border-2 border-border z-10 flex items-center justify-center group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-bold leading-none">SSC</p>
                    <p className="text-xs text-muted-foreground mt-1">Professor MEH Arif Secondary School</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase mt-1">2017 - 2018</p>
                  </div>
                </div>
              </div>

              {/* Notable Practices Column */}
              <div className="glass-panel p-8 space-y-6">
                <div className="flex items-center gap-2 text-accent">
                  <Zap size={20} />
                  <h4 className="font-display font-bold text-lg">Manifesto</h4>
                </div>
                <div className="space-y-4">
                  {[
                    "Maintains clean Flutter project structures",
                    "Strong focus on first-time app launch experience",
                    "Prefers step-by-step technical clarity",
                    "Considers multi-OS compatibility in development"
                  ].map((practice, i) => (
                    <div key={i} className="flex gap-3 items-start group">
                      <div className="w-5 h-5 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform mt-0.5">
                        <ShieldCheck size={12} />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{practice}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="glass-panel p-8 space-y-6 bg-surface2/30 flex-1">
              <div className="flex items-center gap-2 text-primary">
                <Wrench size={20} />
                <h4 className="font-display font-bold text-lg">Technical Stack</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "React.js", category: "Web" },
                  { name: "Dart", category: "Mobile" },
                  { name: "Flutter", category: "Mobile" },
                  { name: "Python", category: "Logic" },
                  { name: "HTML/CSS", category: "UI" },
                  { name: "JavaScript", category: "General" },
                  { name: "Android APK", category: "Native" },
                  { name: "Linux", category: "OS" },
                  { name: "Terminal", category: "Tools" },
                  { name: "Git", category: "VCS" },
                  { name: "GitHub", category: "VCS" },
                  { name: "Cmake", category: "Tools" },
                  { name: "VMs", category: "Tools" },
                  { name: "UI/UX", category: "Design" },
                  { name: "AI Tools", category: "Interests" }
                ].map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all text-[11px] font-semibold cursor-default group">
                    <div className={`w-1 h-1 rounded-full group-hover:scale-125 transition-transform ${i % 2 === 0 ? 'bg-primary' : 'bg-accent'}`} />
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="text-center py-20 space-y-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 blur-[150px] -z-10" />
        
        <div className="space-y-3 px-4">
          <h2 className="text-4xl font-display font-bold tracking-tight">Crafted with <Heart className="inline animate-pulse text-red-500 mx-1" size={32} /> in Bangladesh.</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            DesignLab Pro is a testament to the power of clean code and precise design. Bridge the gap between concept and production today.
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 px-8 py-4 rounded-[2rem] bg-foreground text-background font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-foreground/10 active:scale-95">
              <Github size={18} /> View Source
            </button>
            <button className="flex items-center gap-2 px-8 py-4 rounded-[2rem] bg-secondary font-bold text-sm hover:scale-105 transition-all border border-border hover:bg-border active:scale-95">
              <ExternalLink size={18} /> Documentation
            </button>
          </div>
          <div className="text-[10px] text-muted-foreground flex flex-wrap justify-center gap-6 uppercase font-bold tracking-[0.2em] opacity-60">
             <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-default"><ShieldCheck size={12} /> Open Source MIT</span>
             <span className="w-1.5 h-1.5 rounded-full bg-border hidden sm:block" />
             <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-default"><Zap size={12} /> Pure Performance</span>
             <span className="w-1.5 h-1.5 rounded-full bg-border hidden sm:block" />
             <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-default"><Globe size={12} /> Global Support</span>
          </div>
        </div>
      </section>
      
      <div className="pb-24" />
    </div>
  );
}
