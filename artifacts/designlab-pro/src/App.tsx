import React, { useEffect, useState, useCallback } from "react";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import ToastContainer from "@/components/Toast";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";
import ExportModal from "@/components/ExportModal";
import { toast } from "@/utils/toastStore";
import { useDesignStore } from "@/store/useDesignStore";

import ColorsTool from "./pages/ColorsTool";
import LibrariesTool from "./pages/LibrariesTool";
import TypographyTool from "./pages/TypographyTool";
import SpacingTool from "./pages/SpacingTool";
import ShadowsTool from "./pages/ShadowsTool";
import AnimationsTool from "./pages/AnimationsTool";
import BackgroundsTool from "./pages/BackgroundsTool";
import AuthTool from "./pages/AuthTool";
import CodeEditorTool from "./pages/CodeEditorTool";
import CanvasTool from "./pages/CanvasTool";
import BordersTool from "./pages/BordersTool";
import GradientsTool from "./pages/GradientsTool";
import TokensTool from "./pages/TokensTool";
import GridTool from "./pages/GridTool";
import ContrastTool from "./pages/ContrastTool";
import EffectsTool from "./pages/EffectsTool";
import AboutTool from "./pages/AboutTool";
import MinimalTool from "./pages/MinimalTool";

const queryClient = new QueryClient();

const TOOL_PATHS = [
  '/minimal', '/colors', '/libraries', '/typography', '/spacing', '/shadows',
  '/animations', '/backgrounds', '/effects', '/borders', '/gradients',
  '/tokens', '/grid', '/contrast', '/auth', '/editor', '/canvas', '/about',
];

function AppContent() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [, navigate] = useLocation();
  const { toggleTheme } = useDesignStore();

  const surpriseMe = useCallback(() => {
    const randomColors = ['#6366f1','#ec4899','#14b8a6','#f97316','#8b5cf6','#22c55e','#ef4444','#3b82f6'];
    const pick = () => randomColors[Math.floor(Math.random() * randomColors.length)];
    const store = useDesignStore.getState();
    store.setColorRole('primary', pick());
    toast.success('🎲 New design generated!');
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true';

      // Always handle Escape
      if (e.key === 'Escape') {
        setShowShortcuts(false);
        setShowExport(false);
        return;
      }

      if (!isInput && !e.ctrlKey && !e.metaKey) {
        if (e.key === '?') { setShowShortcuts(s => !s); return; }
        if (e.key === 'T' || e.key === 't') { toggleTheme(); return; }
        if (e.key === 'E' || e.key === 'e') { setShowExport(s => !s); return; }
        if (e.key === 'R' || e.key === 'r') { surpriseMe(); return; }

        // Number keys → switch tabs
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= 9) {
          navigate(TOOL_PATHS[num - 1]);
          return;
        }
        if (e.key === '0' && !e.shiftKey) { navigate(TOOL_PATHS[9]); return; }
        if (e.key === '0' && e.shiftKey) { navigate(TOOL_PATHS[10]); return; }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        toast.info('Undo');
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        toast.info('Redo');
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleTheme, surpriseMe, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg)' }}>
      <Navbar
        onOpenExport={() => setShowExport(true)}
        onOpenShortcuts={() => setShowShortcuts(true)}
        onSurpriseMe={surpriseMe}
      />

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Switch>
          <Route path="/" component={() => <Redirect to="/minimal" />} />
          <Route path="/minimal" component={MinimalTool} />
          <Route path="/colors" component={ColorsTool} />
          <Route path="/libraries" component={LibrariesTool} />
          <Route path="/typography" component={TypographyTool} />
          <Route path="/spacing" component={SpacingTool} />
          <Route path="/shadows" component={ShadowsTool} />
          <Route path="/animations" component={AnimationsTool} />
          <Route path="/backgrounds" component={BackgroundsTool} />
          <Route path="/effects" component={EffectsTool} />
          <Route path="/borders" component={BordersTool} />
          <Route path="/gradients" component={GradientsTool} />
          <Route path="/tokens" component={TokensTool} />
          <Route path="/grid" component={GridTool} />
          <Route path="/contrast" component={ContrastTool} />
          <Route path="/auth" component={AuthTool} />
          <Route path="/editor" component={CodeEditorTool} />
          <Route path="/canvas" component={CanvasTool} />
          <Route path="/about" component={AboutTool} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <ToastContainer />
      <KeyboardShortcutsModal open={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <ExportModal open={showExport} onClose={() => setShowExport(false)} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppContent />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
