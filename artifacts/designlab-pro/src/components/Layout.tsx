import React, { useState, useEffect, useRef } from 'react';
import DeviceFrame from './DeviceFrame';

interface LayoutProps {
  sidebar: React.ReactNode;
  rightSidebar?: React.ReactNode;
  children: React.ReactNode;
  noFrame?: boolean;
}

export default function Layout({ sidebar, rightSidebar, children, noFrame = false }: LayoutProps) {
  const [leftWidth, setLeftWidth] = useState(300);
  const [rightWidth, setRightWidth] = useState(320);
  const isResizingLeft = useRef(false);
  const isResizingRight = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft.current) {
        setLeftWidth(Math.max(200, Math.min(450, e.clientX)));
      }
      if (isResizingRight.current) {
        setRightWidth(Math.max(200, Math.min(450, window.innerWidth - e.clientX)));
      }
    };

    const handleMouseUp = () => {
      isResizingLeft.current = false;
      isResizingRight.current = false;
      document.body.style.cursor = 'default';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="flex-1 flex overflow-hidden bg-background text-foreground" style={{ height: 'calc(100vh - 3.5rem)' }}>
      {/* Left Sidebar - Hidden on Mobile */}
      <aside 
        className="hidden md:flex shrink-0 border-r border-border bg-sidebar overflow-y-auto flex-col transition-none relative"
        style={{ width: `${leftWidth}px` }}
      >
        {sidebar}
        <div 
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/30 active:bg-primary z-50"
          onMouseDown={() => { isResizingLeft.current = true; document.body.style.cursor = 'col-resize'; }}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-full bg-[#f8f9fa] dark:bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(128,128,160,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />
        <div className="flex-1 overflow-auto relative">
          {noFrame ? (
            children
          ) : (
            <DeviceFrame>
              {children}
            </DeviceFrame>
          )}
        </div>
      </main>

      {/* Right Sidebar (Properties) - Hidden on Mobile */}
      {rightSidebar && (
        <aside 
          className="hidden lg:flex shrink-0 border-l border-border bg-sidebar overflow-y-auto flex-col transition-none relative"
          style={{ width: `${rightWidth}px` }}
        >
          {rightSidebar}
          <div 
            className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-primary/30 active:bg-primary z-50"
            onMouseDown={() => { isResizingRight.current = true; document.body.style.cursor = 'col-resize'; }}
          />
        </aside>
      )}
    </div>
  );
}
