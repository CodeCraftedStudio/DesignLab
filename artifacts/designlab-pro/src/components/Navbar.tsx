import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Palette, Library, Type, Scaling, Box,
  Sparkles, Image as ImageIcon, Lock, Code2, Component,
  Moon, Sun, Monitor, Tablet, Smartphone, Download, Keyboard,
  Radius, Layers, Braces, LayoutGrid, ShieldCheck, Wand2, Shuffle, Info, Minimize2
} from "lucide-react";
import { useDesignStore } from "@/store/useDesignStore";

const TABS = [
  { path: "/minimal", icon: Minimize2, label: "Minimal" },
  { path: "/colors", icon: Palette, label: "Colors" },
  { path: "/libraries", icon: Library, label: "UI Libs" },
  { path: "/typography", icon: Type, label: "Type" },
  { path: "/spacing", icon: Scaling, label: "Space" },
  { path: "/shadows", icon: Box, label: "Shadows" },
  { path: "/animations", icon: Sparkles, label: "Anim" },
  { path: "/backgrounds", icon: ImageIcon, label: "Bg" },
  { path: "/effects", icon: Wand2, label: "Effects" },
  { path: "/borders", icon: Radius, label: "Borders" },
  { path: "/gradients", icon: Layers, label: "Gradients" },
  { path: "/tokens", icon: Braces, label: "Tokens" },
  { path: "/grid", icon: LayoutGrid, label: "Grid" },
  { path: "/contrast", icon: ShieldCheck, label: "Contrast" },
  { path: "/auth", icon: Lock, label: "Auth" },
  { path: "/editor", icon: Code2, label: "Code" },
  { path: "/canvas", icon: Component, label: "Canvas" },
  { path: "/about", icon: Info, label: "About" },
];

interface NavbarProps {
  onOpenExport: () => void;
  onOpenShortcuts: () => void;
  onSurpriseMe: () => void;
}

export default function Navbar({ onOpenExport, onOpenShortcuts, onSurpriseMe }: NavbarProps) {
  const [location] = useLocation();
  const { theme, toggleTheme, device, setDevice } = useDesignStore();

  useEffect(() => {
    // Dynamically load dotlottie-player script
    const scriptId = 'dotlottie-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
      script.type = "module";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <header className="h-14 glass-panel flex items-center justify-between px-3 md:px-4 sticky top-0 z-50">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
          {/* @ts-ignore */}
          <dotlottie-player
            src="https://lottie.host/5b4347fd-0831-41f9-8c50-fd2a562985c1/SkFUo0BkOn.lottie"
            autoplay
            loop
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="font-display font-bold text-lg hidden md:block">DesignLab</span>
          <span className="hidden md:block" style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 800 }}>Pro</span>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar mx-2 sm:mx-6 flex-1 min-w-0 mask-fade-edges">
        {TABS.map((tab) => {
          const isActive = location === tab.path;
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs whitespace-nowrap transition-all duration-200 shrink-0 ${isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
            >
              <tab.icon size={isActive ? 14 : 12} />
              <span className={`font-semibold ${isActive ? 'block' : 'hidden lg:block'}`}>{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <div className="hidden md:flex bg-secondary rounded-lg p-1">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-md transition-colors ${device === 'desktop' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Desktop"
          >
            <Monitor size={14} />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-md transition-colors ${device === 'tablet' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Tablet"
          >
            <Tablet size={14} />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-md transition-colors ${device === 'mobile' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Mobile"
          >
            <Smartphone size={14} />
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          title="Toggle Theme (T)"
        >
          {theme === 'dark' ? <Sun size={14} className="sm:w-[16px] sm:h-[16px]" /> : <Moon size={14} className="sm:w-[16px] sm:h-[16px]" />}
        </button>

        <button
          onClick={onSurpriseMe}
          className="p-1.5 sm:p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          title="Surprise Me (R)"
        >
          <Shuffle size={14} className="sm:w-[16px] sm:h-[16px]" />
        </button>

        <button
          onClick={onOpenShortcuts}
          className="hidden sm:flex p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard size={16} />
        </button>

        <button
          onClick={onOpenExport}
          className="p-1.5 sm:p-2 rounded-lg text-accent hover:bg-accent hover:text-white transition-colors"
          title="Export Tokens (E)"
          style={{ backgroundColor: 'var(--accent-soft)' }}
        >
          <Download size={14} className="sm:w-[16px] sm:h-[16px]" />
        </button>
      </div>
    </header>
  );
}
