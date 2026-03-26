import React from 'react';
import { useDesignStore } from '@/store/useDesignStore';
import { RefreshCcw, MoreHorizontal, Maximize2 } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export default function DeviceFrame({ children }: DeviceFrameProps) {
  const { device } = useDesignStore();

  const frameClasses = {
    desktop: "w-full h-full",
    laptop: "w-[1280px] max-w-full h-[800px] max-h-full mx-auto shadow-2xl rounded-xl border border-border overflow-hidden ring-1 ring-black/5 dark:ring-white/5",
    tablet: "w-[768px] max-w-full h-[1024px] max-h-full mx-auto shadow-2xl rounded-[2rem] border-[12px] border-sidebar overflow-hidden ring-1 ring-border",
    mobile: "w-[390px] max-w-full h-[844px] max-h-full mx-auto shadow-2xl rounded-[3rem] border-[12px] border-sidebar overflow-hidden relative ring-1 ring-border",
  };

  return (
    <div className="w-full h-full p-4 md:p-8 overflow-auto flex items-center justify-center bg-background/50">
      <div className={`transition-all duration-500 bg-background relative flex flex-col ${frameClasses[device]}`}>
        {device === 'mobile' && (
          <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
            <div className="w-32 h-6 bg-sidebar rounded-b-3xl"></div>
          </div>
        )}
        
        {device === 'desktop' && (
          <div className="h-10 border-b border-border bg-sidebar flex items-center px-4 gap-4 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-background border border-border h-6 rounded-md w-full max-w-md flex items-center px-3 gap-2 text-xs text-muted-foreground">
                <RefreshCcw size={12} />
                <span>localhost:3000/preview</span>
              </div>
            </div>
            <div className="flex gap-2 text-muted-foreground">
              <Maximize2 size={14} />
              <MoreHorizontal size={14} />
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-auto bg-card relative">
          {children}
        </div>
        
        {device === 'mobile' && (
          <div className="absolute bottom-1 inset-x-0 flex justify-center z-50">
            <div className="w-1/3 h-1 bg-muted-foreground/30 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
