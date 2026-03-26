import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Component, Layers, MousePointer2, Type, Square, Download, Move, Trash2, LayoutTemplate, Briefcase, ShoppingCart, BarChart3, Sun, Moon, Link, PanelLeft, Plus, ArrowRight } from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';
import { toast } from '@/utils/toastStore';

interface CanvasElement {
  id: number;
  type: 'rect' | 'text' | 'button' | 'header' | 'shop-card' | 'business-stat' | 'graph' | 'sidebar-item';
  x: number;
  y: number;
  w: number;
  h: number;
  bg?: string;
  color?: string;
  text?: string;
  radius?: number;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  graphValue?: number;
  uiLibrary?: string;
  lockedPos?: boolean;
  opacity?: number;
  borderWidth?: number;
  borderColor?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const HOME_TEMPLATE: CanvasElement[] = [
  { id: 1, type: 'header', x: 0, y: 0, w: 1024, h: 60, bg: '#ffffff', color: '#09090b', text: 'BrandStudio', radius: 0, lockedPos: true },
  /* Hero Section */
  { id: 2, type: 'text', x: 262, y: 150, w: 500, h: 60, text: 'Elevate Your Design Workflow', color: '#09090b', fontSize: 42, fontWeight: 'bold' },
  { id: 3, type: 'text', x: 262, y: 220, w: 500, h: 60, text: 'The most powerful interface builder for modern designers and developers alike.', color: '#71717a', fontSize: 18 },
  { id: 4, type: 'button', x: 440, y: 320, w: 140, h: 48, bg: '#6366f1', color: '#ffffff', text: 'Start Building', radius: 10, fontSize: 16, fontWeight: 'bold' },
  /* Sub-features */
  { id: 5, type: 'rect', x: 100, y: 450, w: 250, h: 180, bg: '#f8fafc', radius: 12 },
  { id: 6, type: 'text', x: 120, y: 470, w: 210, h: 30, text: 'Templates', color: '#0f172a', fontSize: 18, fontWeight: 'bold' },
  { id: 7, type: 'text', x: 120, y: 505, w: 210, h: 60, text: 'Dozens of pre-built layouts for any use case imaginable.', color: '#475569', fontSize: 14 },
  
  { id: 8, type: 'rect', x: 387, y: 450, w: 250, h: 180, bg: '#f8fafc', radius: 12 },
  { id: 9, type: 'text', x: 407, y: 470, w: 210, h: 30, text: 'Component Library', color: '#0f172a', fontSize: 18, fontWeight: 'bold' },
  { id: 10, type: 'text', x: 407, y: 505, w: 210, h: 60, text: 'Thousands of UI elements ready for your next project.', color: '#475569', fontSize: 14 },

  { id: 11, type: 'rect', x: 674, y: 450, w: 250, h: 180, bg: '#f8fafc', radius: 12 },
  { id: 12, type: 'text', x: 694, y: 470, w: 210, h: 30, text: 'Realtime Sync', color: '#0f172a', fontSize: 18, fontWeight: 'bold' },
  { id: 13, type: 'text', x: 694, y: 505, w: 210, h: 60, text: 'Collaborate with your team instantly across the globe.', color: '#475569', fontSize: 14 }
];

const LOGIN_TEMPLATE: CanvasElement[] = [
  { id: 1, type: 'rect', x: 312, y: 150, w: 400, h: 420, bg: '#ffffff', radius: 20 },
  { id: 2, type: 'text', x: 442, y: 195, w: 140, h: 40, text: 'Sign In', color: '#0f172a', fontSize: 32, fontWeight: 'bold' },
  { id: 3, type: 'text', x: 352, y: 260, w: 100, h: 20, text: 'Email Address', color: '#64748b', fontSize: 14, fontWeight: '500' },
  { id: 4, type: 'rect', x: 352, y: 290, w: 320, h: 44, bg: '#f1f5f9', radius: 8 },
  { id: 5, type: 'text', x: 352, y: 355, w: 100, h: 20, text: 'Password', color: '#64748b', fontSize: 14, fontWeight: '500' },
  { id: 6, type: 'rect', x: 352, y: 385, w: 320, h: 44, bg: '#f1f5f9', radius: 8 },
  { id: 7, type: 'button', x: 352, y: 470, w: 320, h: 48, bg: '#6366f1', color: '#ffffff', text: 'Login to Account', radius: 8, fontSize: 15, fontWeight: 'bold' },
  { id: 8, type: 'text', x: 352, y: 530, w: 320, h: 20, text: "Don't have an account? Sign up", color: '#94a3b8', fontSize: 12, fontWeight: 'normal' }
];

const DASHBOARD_TEMPLATE: CanvasElement[] = [
  { id: 1, type: 'header', x: 0, y: 0, w: 1024, h: 64, bg: '#ffffff', color: '#0f172a', text: 'Admin Console', radius: 0, lockedPos: true },
  { id: 2, type: 'rect', x: 0, y: 64, w: 240, h: 1200, bg: '#f9fafb', radius: 0, lockedPos: true },
  { id: 3, type: 'text', x: 24, y: 88, w: 150, h: 30, text: 'GENERAL', color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
  { id: 7, type: 'sidebar-item', x: 12, y: 120, w: 216, h: 44, bg: '#eff6ff', color: '#2563eb', text: 'Home', radius: 10, fontWeight: 'bold' },
  { id: 8, type: 'sidebar-item', x: 12, y: 172, w: 216, h: 44, color: '#64748b', text: 'Analytics', radius: 10 },
  { id: 9, type: 'sidebar-item', x: 12, y: 224, w: 216, h: 44, color: '#64748b', text: 'Settings', radius: 10 },
  { id: 10, type: 'sidebar-item', x: 12, y: 276, w: 216, h: 44, color: '#64748b', text: 'Orders', radius: 10 },
  { id: 11, type: 'sidebar-item', x: 12, y: 328, w: 216, h: 44, color: '#64748b', text: 'Customers', radius: 10 },
  
  /* Main Content Area */
  { id: 20, type: 'text', x: 280, y: 100, w: 400, h: 44, text: 'Dashboard Overview', color: '#0f172a', fontSize: 32, fontWeight: 'bold' },
  { id: 21, type: 'business-stat', x: 280, y: 170, w: 230, h: 120, bg: '#ffffff', color: '#0f172a', text: 'Monthly Revenue', graphValue: 128450, radius: 16 },
  { id: 22, type: 'business-stat', x: 530, y: 170, w: 230, h: 120, bg: '#ffffff', color: '#0f172a', text: 'New Customers', graphValue: 452, radius: 16 },
  { id: 23, type: 'business-stat', x: 780, y: 170, w: 210, h: 120, bg: '#ffffff', color: '#0f172a', text: 'Orders', graphValue: 12, radius: 16 },
  { id: 24, type: 'graph', x: 280, y: 320, w: 480, h: 320, bg: '#ffffff', color: '#6366f1', text: 'Growth Potential', graphValue: 92, radius: 20 },
  
  /* Recent Activity Panel */
  { id: 30, type: 'rect', x: 780, y: 320, w: 210, h: 320, bg: '#ffffff', radius: 16 },
  { id: 31, type: 'text', x: 800, y: 340, w: 170, h: 24, text: 'Recent Activity', color: '#0f172a', fontSize: 14, fontWeight: 'bold' },
  { id: 32, type: 'text', x: 800, y: 375, w: 170, h: 20, text: 'User John logged in', color: '#64748b', fontSize: 12 },
  { id: 33, type: 'text', x: 800, y: 405, w: 170, h: 20, text: 'Update v2.4 success', color: '#64748b', fontSize: 12 },
  { id: 34, type: 'text', x: 800, y: 435, w: 170, h: 20, text: 'New sale - $450', color: '#64748b', fontSize: 12 }
];

const SHOP_TEMPLATE: CanvasElement[] = [
  { id: 1, type: 'header', x: 0, y: 0, w: 1024, h: 72, bg: '#ffffff', color: '#0f172a', text: 'Luxe Wear', radius: 0, lockedPos: true },
  { id: 2, type: 'text', x: 40, y: 110, w: 400, h: 40, text: 'New Arrivals', color: '#0f172a', fontSize: 32, fontWeight: 'bold' },
  { id: 3, type: 'shop-card', x: 40, y: 180, w: 300, h: 420, bg: '#ffffff', text: 'Essential Cotton Tee', graphValue: 45, color: '#0f172a', radius: 16 },
  { id: 4, type: 'shop-card', x: 360, y: 180, w: 300, h: 420, bg: '#ffffff', text: 'Denim Jacket XL', graphValue: 89, color: '#0f172a', radius: 16 },
  { id: 5, type: 'shop-card', x: 680, y: 180, w: 304, h: 420, bg: '#ffffff', text: 'Leather Boots', graphValue: 120, color: '#0f172a', radius: 16 }
];

const FEATURES_TEMPLATE: CanvasElement[] = [
  { id: 1, type: 'header', x: 0, y: 0, w: 1024, h: 64, bg: '#ffffff', color: '#0f172a', text: 'Platform Features', radius: 0, lockedPos: true },
  { id: 2, type: 'text', x: 200, y: 130, w: 624, h: 50, text: 'Everything You Need To Scale', color: '#0f172a', fontSize: 42, fontWeight: 'bold' },
  { id: 3, type: 'text', x: 262, y: 195, w: 500, h: 30, text: 'Built with elite precision for the most demanding digital products.', color: '#64748b', fontSize: 16 },
  
  { id: 4, type: 'rect', x: 100, y: 280, w: 400, h: 280, bg: '#f8fafc', radius: 20 },
  { id: 5, type: 'text', x: 130, y: 310, w: 340, h: 40, text: 'Advanced Analytics', color: '#0f172a', fontSize: 24, fontWeight: 'bold' },
  { id: 6, type: 'text', x: 130, y: 360, w: 340, h: 90, text: 'Track every single user interaction and metric with high-fidelity resolution. Real-time data processing at scale.', color: '#475569', fontSize: 16 },
  
  { id: 7, type: 'rect', x: 524, y: 280, w: 400, h: 280, bg: '#f8fafc', radius: 20 },
  { id: 8, type: 'text', x: 554, y: 310, w: 340, h: 40, text: 'Secure Infrastructure', color: '#0f172a', fontSize: 24, fontWeight: 'bold' },
  { id: 9, type: 'text', x: 554, y: 360, w: 340, h: 90, text: 'Military grade encryption and decentralized storage for absolute peace of mind and performance reliability.', color: '#475569', fontSize: 16 }
];

const UI_LIBRARIES = ['MUI', 'Ant Design', 'Chakra UI', 'Tailwind', 'Bootstrap'];

export default function CanvasTool() {
  const { theme, toggleTheme } = useDesignStore();
  const [pages, setPages] = useState<{id: string, name: string, elements: CanvasElement[]}[]>([{ id: 'default', name: 'Dashboard', elements: DASHBOARD_TEMPLATE }]);
  const [activePageId, setActivePageId] = useState('default');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const elements = activePage.elements;

  const setElements = (newElements: CanvasElement[]) => {
    setPages(prevPages => prevPages.map(p => 
      p.id === activePage.id ? { ...p, elements: newElements } : p
    ));
  };
  const [isDragging, setIsDragging] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  
  // Real dynamic canvas dimension state
  const [canvasW, setCanvasW] = useState(1024);
  const [canvasH, setCanvasH] = useState(1200);
  
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0, elW: 0, elH: 0 });

  const selectedElement = elements.find(e => e.id === selectedId);

  const loadTemplate = (name: 'home' | 'login' | 'dashboard' | 'shop' | 'features') => {
    const templates = { home: HOME_TEMPLATE, login: LOGIN_TEMPLATE, dashboard: DASHBOARD_TEMPLATE, shop: SHOP_TEMPLATE, features: FEATURES_TEMPLATE };
    
    // Check if page exists or needs fallback handling
    // We simply overwrite the currently active page layout to keep it simple, OR create a new page
    setElements(JSON.parse(JSON.stringify(templates[name]))); 
    setPages(prev => prev.map(p => p.id === activePage.id ? { ...p, name: name.charAt(0).toUpperCase() + name.slice(1) } : p));
    setSelectedId(null);
    toast.success(`${name.charAt(0).toUpperCase() + name.slice(1)} template loaded`);
  };

  const navigateToPage = (targetName: string) => {
    const existingPage = pages.find(p => p.name.toLowerCase() === targetName.toLowerCase());
    if (existingPage) {
      setActivePageId(existingPage.id);
      setSelectedId(null);
    } else {
      const newPageId = Date.now().toString();
      // Keep structural dashboard layout elements to provide continuous navigation
      const layoutElements = elements.filter(e => e.lockedPos || e.type === 'sidebar-item' || e.type === 'header').map(e => {
        if (e.type === 'sidebar-item') {
          const isActive = e.text?.toLowerCase() === targetName.toLowerCase();
          return {
            ...e,
            bg: isActive ? '#eff6ff' : 'transparent',
            color: isActive ? '#2563eb' : '#64748b',
            fontWeight: isActive ? 'bold' : 'normal'
          };
        }
        return e;
      });

      const titleElement: CanvasElement = { 
        id: Date.now(), 
        type: 'text', 
        x: (layoutElements.find(e => e.type === 'rect')?.w || 240) + 40, 
        y: 100, 
        w: 500, 
        h: 60, 
        text: targetName, 
        color: '#0f172a', 
        fontSize: 32, 
        fontWeight: 'bold' 
      };
      
      setPages(prev => [...prev, { id: newPageId, name: targetName, elements: [...layoutElements, titleElement] }]);
      setActivePageId(newPageId);
      setSelectedId(null);
      toast.success(`Created & navigated to new ${targetName} page!`);
    }
  };

  const addElement = (type: CanvasElement['type']) => {
    const newId = Math.max(0, ...elements.map(e => e.id)) + 1;
    const newEl: CanvasElement = { id: newId, type, x: 100, y: 100, w: 200, h: 100, uiLibrary: 'Tailwind' };
    
    if (type === 'rect') { newEl.bg = '#f4f4f5'; newEl.radius = 8; newEl.w = 200; newEl.h = 200; }
    if (type === 'text') { newEl.text = 'Double click to edit'; newEl.color = '#000'; newEl.fontSize = 16; newEl.h = 40; }
    if (type === 'button') { newEl.bg = '#6366f1'; newEl.color = '#fff'; newEl.text = 'Button'; newEl.radius = 6; newEl.fontWeight = '500'; newEl.w = 120; newEl.h = 44; }
    if (type === 'header') { newEl.bg = '#ffffff'; newEl.w = 800; newEl.h = 60; newEl.text = 'Header'; newEl.radius = 0; }
    if (type === 'shop-card') { newEl.bg = '#ffffff'; newEl.w = 250; newEl.h = 350; newEl.text = 'Product Name'; newEl.graphValue = 99; newEl.radius = 12; }
    if (type === 'business-stat') { newEl.bg = '#ffffff'; newEl.w = 220; newEl.h = 100; newEl.text = 'Statistic'; newEl.graphValue = 5000; newEl.color = '#10b981'; newEl.radius = 12; }
    if (type === 'graph') { newEl.bg = '#ffffff'; newEl.w = 400; newEl.h = 250; newEl.text = 'Chart Title'; newEl.graphValue = 75; newEl.color = '#6366f1'; newEl.radius = 12; }
    if (type === 'sidebar-item') { newEl.w = 180; newEl.h = 40; newEl.text = 'New Feature'; newEl.color = '#3f3f46'; newEl.radius = 6; newEl.fontWeight = '500'; }
    
    setElements([...elements, newEl]);
    setSelectedId(newId);
  };

  const updateSelected = (updates: Partial<CanvasElement>) => {
    if (!selectedId) return;
    setElements(elements.map(e => e.id === selectedId ? { ...e, ...updates } : e));
  };

  const removeSelected = () => {
    if (!selectedId) return;
    const elToDelete = elements.find(e => e.id === selectedId);
    
    setElements(elements.filter(e => e.id !== selectedId));
    setSelectedId(null);

    if (elToDelete?.type === 'sidebar-item' && elToDelete.text) {
      setPages(prevPages => {
        const remainingPages = prevPages.filter(p => p.name !== elToDelete.text);
        if (remainingPages.length === 0) return prevPages; // Should never happen unless only 1 page left anyway
        
        if (activePageId && !remainingPages.find(p => p.id === activePageId)) {
          setTimeout(() => setActivePageId(remainingPages[0].id), 0);
        }
        return remainingPages;
      });
    }
  };

  // Canvas Mouse Events
  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDragging(true);
    const el = elements.find(el => el.id === id)!;
    dragStart.current = { x: e.clientX, y: e.clientY, elX: el.x, elY: el.y, elW: el.w, elH: el.h };
  };

  const handleResizeMouseDown = (e: React.MouseEvent, id: number, handle: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setResizeHandle(handle);
    const el = elements.find(el => el.id === id)!;
    dragStart.current = { x: e.clientX, y: e.clientY, elX: el.x, elY: el.y, elW: el.w, elH: el.h };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedId) return;
    const el = elements.find(e => e.id === selectedId)!;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    if (resizeHandle) {
      let { elX: newX, elY: newY, elW: newW, elH: newH } = dragStart.current;
      
      if (resizeHandle.includes('r')) newW += dx;
      if (resizeHandle.includes('l')) { 
        if (!el.lockedPos) { newW -= dx; newX += dx; }
      }
      if (resizeHandle.includes('b')) newH += dy;
      if (resizeHandle.includes('t')) { 
        if (!el.lockedPos) { newH -= dy; newY += dy; }
      }

      if (newW < 20) { if(resizeHandle.includes('l') && !el.lockedPos) newX -= (20 - newW); newW = 20; }
      if (newH < 20) { if(resizeHandle.includes('t') && !el.lockedPos) newY -= (20 - newH); newH = 20; }

      // Sync sidebar-items width to locked sidebar rect
      let nextElements = elements.map(e => e.id === selectedId ? { ...e, x: newX, y: newY, w: newW, h: newH } : e);
      if (el.lockedPos && el.type === 'rect') {
        nextElements = nextElements.map(e => e.type === 'sidebar-item' ? { ...e, w: Math.max(20, newW - 20) } : e);
      }
      
      // Globally sync all sidebar-item heights and freeze width
      if (el.type === 'sidebar-item') {
        nextElements = nextElements.map(e => {
          if (e.id === selectedId) return { ...e, w: dragStart.current.elW }; // freeze W for target
          if (e.type === 'sidebar-item') return { ...e, h: newH }; // apply new H to all
          return e;
        });
      }

      setElements(nextElements);
    } else if (isDragging) {
      if (el.lockedPos) return; // Prevent movement when locked
      
      const snap = 10;
      const newX = Math.round((dragStart.current.elX + dx) / snap) * snap;
      const newY = Math.round((dragStart.current.elY + dy) / snap) * snap;
      updateSelected({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setResizeHandle(null);
  };

  const renderElementContent = (el: CanvasElement) => {
    // Determine internal class or style overrides based on selected uiLibrary (cosmetic simulation)
    const isMUI = el.uiLibrary === 'MUI';
    
    if (el.type === 'header') {
      return (
        <div className="w-full h-full flex items-center justify-between px-6 border-b border-black/10 overflow-hidden" 
             style={{ background: el.bg, color: el.color }}>
          <span style={{ fontWeight: el.fontWeight || 'bold', fontSize: el.fontSize || 20, fontStyle: el.fontStyle }}>{el.text || 'Logo'}</span>
          <div className="flex gap-4 items-center">
            <span className="text-sm opacity-70">Home</span>
            <span className="text-sm opacity-70">About</span>
            <button onClick={(e) => { e.stopPropagation(); toggleTheme(); }} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center cursor-pointer hover:bg-black/10 transition">
              {theme === 'dark' ? <Moon size={14} color={el.color}/> : <Sun size={14} color={el.color}/>}
            </button>
          </div>
        </div>
      );
    }
    if (el.type === 'shop-card') {
      return (
        <div className="w-full h-full flex flex-col p-4 shadow-sm" style={{ background: el.bg, color: el.color }}>
          <div className="w-full flex-1 bg-black/5 rounded-md mb-4 flex items-center justify-center overflow-hidden relative">
            <ShoppingCart size={32} className="opacity-20" />
            {isMUI && <div className="absolute inset-0 bg-primary/5"></div>}
          </div>
          <h4 style={{ fontWeight: el.fontWeight || 'bold', fontSize: el.fontSize || 16, fontStyle: el.fontStyle }}>{el.text}</h4>
          <div className="flex justify-between items-center mt-2">
            <span style={{ fontWeight: 'bold' }}>${el.graphValue}</span>
            <div className={`px-3 py-1 bg-primary text-primary-foreground text-xs font-medium cursor-pointer ${isMUI ? 'rounded' : 'rounded-full'}`}>Buy</div>
          </div>
        </div>
      );
    }
    if (el.type === 'business-stat') {
      return (
        <div className="w-full h-full flex flex-col p-5 justify-between shadow-sm" style={{ background: el.bg, color: el.color }}>
          <span className="text-sm opacity-60 font-medium" style={{ fontStyle: el.fontStyle }}>{el.text}</span>
          <div className="flex items-end justify-between">
            <span style={{ fontSize: 32, fontWeight: 'bold' }}>{el.graphValue?.toLocaleString()}</span>
            <span style={{ color: el.color, fontSize: 14, fontWeight: 'bold' }}>+14%</span>
          </div>
        </div>
      );
    }
    if (el.type === 'graph') {
      return (
        <div className="w-full h-full flex flex-col p-6 shadow-sm" style={{ background: el.bg }}>
          <span className="text-sm font-bold mb-6" style={{ color: el.color, fontStyle: el.fontStyle }}>{el.text}</span>
          <div className="flex-1 flex items-end gap-3 px-2">
            {[40, 70, 45, 90, 60, el.graphValue || 75, 50].map((v, i) => (
              <div key={i} className="flex-1 rounded-t-sm opacity-80" style={{ height: `${v}%`, backgroundColor: el.color || 'var(--primary)' }}></div>
            ))}
          </div>
        </div>
      );
    }
    if (el.type === 'sidebar-item') {
      const getIcon = (text: string = '') => {
        const t = text.toLowerCase();
        if (t.includes('home')) return <Sun size={18} opacity={0.7} />; // Reusing Sun as home-ish for now or I can import Home
        if (t.includes('analytics')) return <BarChart3 size={18} opacity={0.7} />;
        if (t.includes('setting')) return <Layers size={18} opacity={0.7} />; 
        if (t.includes('order') || t.includes('shop')) return <ShoppingCart size={18} opacity={0.7} />;
        if (t.includes('customer') || t.includes('user')) return <Briefcase size={18} opacity={0.7} />;
        return <Layers size={18} opacity={0.7} />;
      };

      return (
        <div className="w-full h-full flex items-center gap-3 px-4 transition-all duration-200" style={{ color: el.color, background: el.bg || 'transparent', borderRadius: el.radius }}>
          {getIcon(el.text)}
          <span className="truncate" style={{ fontWeight: el.fontWeight || '500', fontSize: el.fontSize || 14, fontStyle: el.fontStyle }}>{el.text}</span>
          <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      );
    }
    return <span style={{ fontStyle: el.fontStyle, padding: el.type === 'button' ? '0 10px' : 0 }}>{el.text}</span>;
  };

  const LeftSidebar = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Component size={16} className="text-primary" />
          <h2 className="font-display font-bold">Canvas Editor</h2>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {/* Templates */}
        <div className="p-4 border-b border-border space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><LayoutTemplate size={14}/> Templates</h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => loadTemplate('home')} className="p-2 border border-border rounded text-xs bg-surface2 hover:border-primary transition">Home</button>
            <button onClick={() => loadTemplate('dashboard')} className="p-2 border border-border rounded text-xs bg-surface2 hover:border-primary transition">Dashboard</button>
            <button onClick={() => loadTemplate('features')} className="p-2 border border-border rounded text-xs bg-surface2 hover:border-primary transition">Features</button>
            <button onClick={() => loadTemplate('login')} className="p-2 border border-border rounded text-xs bg-surface2 hover:border-primary transition">Auth Login</button>
            <button onClick={() => loadTemplate('shop')} className="col-span-2 p-2 border border-border rounded text-xs bg-surface2 hover:border-primary transition">Shop Form</button>
          </div>
        </div>

        {/* Component Palette */}
        <div className="p-4 border-b border-border space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Briefcase size={14}/> Components</h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => addElement('header')} className="flex flex-col items-center justify-center p-3 border border-border rounded-lg bg-background hover:border-primary hover:text-primary transition-colors text-xs gap-2 shadow-sm">
              <PanelLeft size={16} /> Header
            </button>
             <button onClick={() => addElement('shop-card')} className="flex flex-col items-center justify-center p-3 border border-border rounded-lg bg-background hover:border-primary hover:text-primary transition-colors text-xs gap-2 shadow-sm">
              <ShoppingCart size={16} /> Shop Card
            </button>
            <button onClick={() => addElement('business-stat')} className="flex flex-col items-center justify-center p-3 border border-border rounded-lg bg-background hover:border-primary hover:text-primary transition-colors text-xs gap-2 shadow-sm">
              <Briefcase size={16} /> Bus. Stat
            </button>
            <button onClick={() => addElement('graph')} className="flex flex-col items-center justify-center p-3 border border-border rounded-lg bg-background hover:border-primary hover:text-primary transition-colors text-xs gap-2 shadow-sm">
              <BarChart3 size={16} /> Graph
            </button>
            <button onClick={() => addElement('sidebar-item')} className="flex flex-col items-center justify-center p-3 border border-border rounded-lg bg-background hover:border-primary hover:text-primary transition-colors text-xs gap-2 shadow-sm">
              <Link size={16} /> Sidebar Link
            </button>
            <button onClick={() => addElement('rect')} className="flex flex-col items-center justify-center p-3 border border-border rounded-lg bg-background hover:border-primary hover:text-primary transition-colors text-xs gap-2 shadow-sm">
              <Square size={16} /> Box
            </button>
            <button onClick={() => addElement('text')} className="flex flex-col items-center justify-center p-3 border border-border rounded-lg bg-background hover:border-primary hover:text-primary transition-colors text-xs gap-2 shadow-sm">
              <Type size={16} /> Text
            </button>
            <button onClick={() => addElement('button')} className="col-span-2 flex flex-col items-center justify-center p-3 border border-border rounded-lg bg-background hover:border-primary hover:text-primary transition-colors text-xs gap-2 shadow-sm">
              <MousePointer2 size={16} /> Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RightSidebar = (
    <div className="flex flex-col h-full overflow-hidden bg-sidebar">
      <div className="p-4 border-b border-border bg-sidebar/50 backdrop-blur-sm sticky top-0 z-10">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Layers size={14} /> Properties
        </h3>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4">
        {selectedElement ? (
          <div className="space-y-4 animate-in fade-in pb-10">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground">UI Library Target</label>
              <select 
                value={selectedElement.uiLibrary || 'Tailwind'} 
                onChange={e => updateSelected({ uiLibrary: e.target.value })}
                className="bg-background border border-border p-1.5 rounded text-sm w-full"
              >
                {UI_LIBRARIES.map(lib => <option key={lib} value={lib}>{lib}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">X {selectedElement.lockedPos && '(Locked)'}</label>
                <input type="number" value={selectedElement.x} onChange={e => !selectedElement.lockedPos && updateSelected({x: Number(e.target.value)})} disabled={selectedElement.lockedPos} className="bg-background border border-border p-1 rounded text-sm w-full disabled:opacity-50" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">Y {selectedElement.lockedPos && '(Locked)'}</label>
                <input type="number" value={selectedElement.y} onChange={e => !selectedElement.lockedPos && updateSelected({y: Number(e.target.value)})} disabled={selectedElement.lockedPos} className="bg-background border border-border p-1 rounded text-sm w-full disabled:opacity-50" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">W {(selectedElement.lockedPos && selectedElement.type === 'header') || selectedElement.type === 'sidebar-item' ? '(Locked)' : ''}</label>
                <input type="number" value={selectedElement.w} onChange={e => !(selectedElement.lockedPos && selectedElement.type === 'header') && selectedElement.type !== 'sidebar-item' && updateSelected({w: Math.max(20, Number(e.target.value))})} disabled={(selectedElement.lockedPos && selectedElement.type === 'header') || selectedElement.type === 'sidebar-item'} className="bg-background border border-border p-1 rounded text-sm w-full disabled:opacity-50" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">H {selectedElement.type === 'sidebar-item' && '(Synced)'}</label>
                <input type="number" value={selectedElement.h} onChange={e => {
                  const nextH = Math.max(20, Number(e.target.value));
                  if (selectedElement.type === 'sidebar-item') {
                    setElements(elements.map(el => el.type === 'sidebar-item' ? { ...el, h: nextH } : el));
                  } else {
                    updateSelected({h: nextH});
                  }
                }} className="bg-background border border-border p-1 rounded text-sm w-full" />
              </div>
            </div>

            {(selectedElement.type !== 'rect' && selectedElement.type !== 'graph') && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">Text / Label Content</label>
                <input type="text" value={selectedElement.text || ''} onChange={e => updateSelected({text: e.target.value})} className="bg-background border border-border p-1.5 rounded text-sm w-full" />
              </div>
            )}

            {(selectedElement.type === 'business-stat' || selectedElement.type === 'shop-card' || selectedElement.type === 'graph') && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">Numeric Value</label>
                <input type="number" value={selectedElement.graphValue || 0} onChange={e => updateSelected({graphValue: Number(e.target.value)})} className="bg-background border border-border p-1.5 rounded text-sm w-full" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">BG Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={selectedElement.bg || '#ffffff'} onChange={e => updateSelected({bg: e.target.value})} className="w-8 h-8 rounded shrink-0 cursor-pointer" />
                  <span className="text-[10px] font-mono opacity-60 uppercase">{selectedElement.bg}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">{selectedElement.type === 'graph' ? 'Chart' : 'Text'} Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={selectedElement.color || '#000000'} onChange={e => updateSelected({color: e.target.value})} className="w-8 h-8 rounded shrink-0 cursor-pointer" />
                  <span className="text-[10px] font-mono opacity-60 uppercase">{selectedElement.color}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 py-3 border-t border-border mt-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Styles & Effects</label>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-muted-foreground">Radius</label>
                  <input type="number" value={selectedElement.radius || 0} onChange={e => updateSelected({ radius: Number(e.target.value) })} className="bg-background border border-border p-1 rounded text-sm w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-muted-foreground">Opacity (%)</label>
                  <input type="number" value={Math.round((selectedElement.opacity ?? 1) * 100)} onChange={e => updateSelected({ opacity: Number(e.target.value) / 100 })} className="bg-background border border-border p-1 rounded text-sm w-full" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">Shadow</label>
                <select value={selectedElement.shadow || 'none'} onChange={e => updateSelected({ shadow: e.target.value as any })} className="bg-background border border-border p-1.5 rounded text-sm w-full">
                  <option value="none">None</option>
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="xl">Extra Large</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-muted-foreground">Border Width</label>
                  <input type="number" min="0" value={selectedElement.borderWidth || 0} onChange={e => updateSelected({ borderWidth: Number(e.target.value) })} className="bg-background border border-border p-1 rounded text-sm w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-muted-foreground">Border Color</label>
                  <input type="color" value={selectedElement.borderColor || '#e2e8f0'} onChange={e => updateSelected({ borderColor: e.target.value })} className="w-full h-8 rounded cursor-pointer" />
                </div>
              </div>
            </div>

            <button onClick={removeSelected} className="w-full py-2.5 mt-4 text-destructive border border-destructive/20 rounded-lg flex items-center justify-center gap-2 text-sm font-bold bg-destructive/5 hover:bg-destructive/10 transition-all">
              <Trash2 size={14} /> Remove Element
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in pb-10">
            <div className="text-sm text-muted-foreground bg-surface2 rounded-md border border-border border-dashed p-4 text-center">
              Select an element to edit properties, or adjust artboard settings below.
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Canvas Width</label>
                <input type="number" value={canvasW} onChange={e => setCanvasW(Math.max(300, Number(e.target.value)))} className="bg-background border border-border p-2 rounded text-sm w-full font-mono" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Canvas Height</label>
                <input type="number" value={canvasH} onChange={e => setCanvasH(Math.max(300, Number(e.target.value)))} className="bg-background border border-border p-2 rounded text-sm w-full font-mono" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout sidebar={LeftSidebar} rightSidebar={RightSidebar}>
      <div 
        className="h-full flex flex-col relative bg-[#e5e5e5] dark:bg-[#1a1a1a]"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Page Tabs Area */}
        <div className="flex bg-surface border-b border-border h-10 px-4 items-center gap-2 overflow-x-auto shrink-0 select-none bg-background shadow-sm z-[60] sticky top-0">
          {pages.map(p => (
            <button 
              key={p.id} 
              onClick={() => { setActivePageId(p.id); setSelectedId(null); }}
              onDoubleClick={() => {
                if(pages.length > 1) {
                  setPages(pages.filter(page => page.id !== p.id));
                  if(activePageId === p.id) setActivePageId(pages[0].id);
                }
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors ${activePage.id === p.id ? 'bg-surface2 text-primary border-b-2 border-primary' : 'hover:bg-surface2 text-muted-foreground'}`}
              title="Double click to delete page"
            >
              {p.name}
            </button>
          ))}
          <button 
             className="px-2 py-1 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-surface2 rounded"
             onClick={() => {
                const newId = Date.now().toString();
                setPages(prev => [...prev, { id: newId, name: `Page ${prev.length + 1}`, elements: [] }]);
                setActivePageId(newId);
             }}
          >
             <Plus size={14} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 flex items-center bg-background border border-border rounded-lg shadow-xl p-1.5 z-[50] gap-1 pointer-events-auto">
          <button className="p-2 rounded bg-secondary text-foreground"><MousePointer2 size={16}/></button>
          <button className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Move size={16}/></button>
          <div className="w-px h-6 bg-border mx-2"></div>
          <button className="px-4 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium flex gap-2 items-center hover:opacity-90 transition-opacity">
            <Download size={14}/> Export Code
          </button>
        </div>

        {/* Canvas Area */}
        <div 
          className="flex-1 overflow-auto relative p-10 md:p-20"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedId(null); }}
        >
          {/* Artboard */}
          <div 
            className="bg-white mx-auto relative shadow-2xl ring-1 ring-black/5 overflow-hidden transition-all duration-300"
            onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedId(null); }}
            style={{ 
              width: `${canvasW}px`,
              height: `${canvasH}px`,
              backgroundImage: 'radial-gradient(#d4d4d8 1px, transparent 1px)', 
              backgroundSize: '20px 20px',
              backgroundPosition: '-10px -10px'
            }}
          >
            {elements.map(el => (
              <div
                key={el.id}
                onMouseDown={(e) => handleMouseDown(e, el.id)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (el.type === 'sidebar-item') navigateToPage(el.text || 'New Page');
                }}
                onClick={(e) => e.stopPropagation()}
                className={`absolute transition-shadow duration-200 group ${
                  selectedId === el.id 
                  ? `ring-2 ring-primary ring-offset-1 ${el.lockedPos ? 'z-0' : 'z-30'}` 
                  : `hover:ring-1 hover:ring-primary/50 ${el.lockedPos ? 'z-0' : 'z-10'}`
                }`}
                style={{
                  transform: `translate(${el.x}px, ${el.y}px)`,
                  width: el.w,
                  height: el.h,
                  cursor: el.lockedPos ? 'default' : (isDragging && selectedId === el.id && !resizeHandle ? 'grabbing' : 'grab'),
                  userSelect: 'none'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: el.bg,
                  color: el.color,
                  borderRadius: el.radius,
                  fontSize: el.fontSize,
                  fontWeight: el.fontWeight,
                  display: 'flex',
                  alignItems: el.type === 'button' ? 'center' : 'flex-start',
                  justifyContent: el.type === 'button' ? 'center' : 'flex-start',
                  boxShadow: el.shadow === 'sm' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 
                           el.shadow === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 
                           el.shadow === 'lg' ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' :
                           el.shadow === 'xl' ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : 'none',
                  border: el.borderWidth ? `${el.borderWidth}px solid ${el.borderColor || '#cbd5e1'}` : 'none',
                  opacity: el.opacity ?? 1,
                  overflow: 'auto',
                  scrollbarWidth: 'thin'
                }}>
                  {renderElementContent(el)}
                </div>

                {/* Resize Handles (Active) */}
                {selectedId === el.id && (
                  <>
                    {/* Edge Handles */}
                    {!(el.lockedPos || el.type === 'sidebar-item') && <div onMouseDown={(e) => handleResizeMouseDown(e, el.id, 't')} className="absolute -top-1.5 left-2 right-2 h-3 cursor-ns-resize z-20"></div>}
                    {!((el.lockedPos && el.type === 'header') || el.type === 'sidebar-item') && <div onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'r')} className="absolute top-2 -right-1.5 bottom-2 w-3 cursor-ew-resize z-20"></div>}
                    <div onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'b')} className="absolute -bottom-1.5 left-2 right-2 h-3 cursor-ns-resize z-20"></div>
                    {!(el.lockedPos || el.type === 'sidebar-item') && <div onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'l')} className="absolute top-2 -left-1.5 bottom-2 w-3 cursor-ew-resize z-20"></div>}
                  
                    {/* Corner Handles */}
                    {!(el.lockedPos || el.type === 'sidebar-item') && <div onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'tl')} className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-nwse-resize z-30"></div>}
                    {!((el.lockedPos && el.type === 'header') || el.type === 'sidebar-item') && <div onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'tr')} className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-nesw-resize z-30"></div>}
                    {!(el.lockedPos || el.type === 'sidebar-item') && <div onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'bl')} className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-nesw-resize z-30"></div>}
                    {!(el.type === 'sidebar-item') && <div onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'br')} className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-nwse-resize z-30"></div>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
