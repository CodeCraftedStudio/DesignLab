import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Scaling, Copy } from 'lucide-react';

export default function SpacingTool() {
  const [baseUnit, setBaseUnit] = useState(4);
  const [scaleType, setScaleType] = useState<'linear' | 'modular'>('linear');
  const [modularRatio, setModularRatio] = useState(1.5);

  const steps = 16;
  const spaces = Array.from({ length: steps }, (_, i) => {
    let val;
    if (scaleType === 'linear') {
      val = (i + 1) * baseUnit;
    } else {
      val = Math.round(baseUnit * Math.pow(modularRatio, i));
    }
    return {
      step: i + 1,
      px: val,
      rem: (val / 16).toFixed(3)
    };
  });

  const Sidebar = (
    <div className="flex flex-col gap-6 p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Scaling size={16} className="text-primary" />
          <h2 className="font-display font-bold">Spacing Scale</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Base Unit</label>
            <div className="flex gap-2">
              {[4, 6, 8, 10].map(u => (
                <button
                  key={u}
                  onClick={() => setBaseUnit(u)}
                  className={`flex-1 py-1.5 text-sm rounded border ${baseUnit === u ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/50'}`}
                >
                  {u}px
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Scale Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setScaleType('linear')}
                className={`flex-1 py-1.5 text-sm rounded border ${scaleType === 'linear' ? 'bg-secondary text-foreground border-secondary-foreground/20' : 'bg-background border-border'}`}
              >
                Linear
              </button>
              <button
                onClick={() => setScaleType('modular')}
                className={`flex-1 py-1.5 text-sm rounded border ${scaleType === 'modular' ? 'bg-secondary text-foreground border-secondary-foreground/20' : 'bg-background border-border'}`}
              >
                Modular
              </button>
            </div>
          </div>

          {scaleType === 'modular' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground flex justify-between">
                Ratio <span>{modularRatio}</span>
              </label>
              <input type="range" min="1.1" max="2" step="0.05" value={modularRatio} onChange={e => setModularRatio(Number(e.target.value))} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto space-y-2">
        <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2">
          <Copy size={14} /> Copy Tailwind Config
        </button>
      </div>
    </div>
  );

  return (
    <Layout sidebar={Sidebar}>
      <div className="h-full overflow-auto p-12 bg-card">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="pb-8 border-b border-border">
            <h1 className="text-4xl font-display font-bold mb-4">Spacing System</h1>
            <p className="text-muted-foreground text-lg">
              Consistent spacing creates rhythm and hierarchy. Use these values for margins, padding, and gaps.
            </p>
          </header>

          <div className="space-y-6">
            {spaces.map((s, i) => (
              <div key={i} className="flex items-center gap-6 group hover:bg-secondary/50 p-2 rounded-lg transition-colors -mx-2">
                <div className="w-24 shrink-0 font-mono text-sm space-y-1">
                  <div className="text-foreground font-bold">space-{s.step}</div>
                  <div className="text-muted-foreground">{s.px}px</div>
                </div>
                
                <div className="flex-1 flex items-center h-12">
                  <div 
                    className="h-8 bg-primary rounded-md shadow-sm transition-all duration-300"
                    style={{ width: `${Math.min(s.px, 600)}px` }}
                  />
                  {s.px > 600 && <span className="ml-4 text-xs text-muted-foreground font-mono">+ {s.px - 600}px</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
