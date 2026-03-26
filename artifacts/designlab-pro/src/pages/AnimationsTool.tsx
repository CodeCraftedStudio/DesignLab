import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Sparkles, Play, RotateCcw, Copy } from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';

const ANIMATIONS = {
  'Fade In': { keyframes: `{ from { opacity: 0; } to { opacity: 1; } }` },
  'Slide Up': { keyframes: `{ from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }` },
  'Scale': { keyframes: `{ from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }` },
  'Rotate': { keyframes: `{ from { transform: rotate(-180deg); opacity: 0; } to { transform: rotate(0); opacity: 1; } }` },
  'Bounce': { keyframes: `{ 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-30px); } 60% { transform: translateY(-15px); } }` },
  'Shake': { keyframes: `{ 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); } 20%, 40%, 60%, 80% { transform: translateX(10px); } }` },
  'Pulse': { keyframes: `{ 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }` },
  'Float': { keyframes: `{ 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }` },
};

const EASINGS = {
  'Linear': 'linear',
  'Ease': 'ease',
  'Ease In': 'ease-in',
  'Ease Out': 'ease-out',
  'Ease In Out': 'ease-in-out',
  'Spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

export default function AnimationsTool() {
  const { colorRoles } = useDesignStore();
  const [animType, setAnimType] = useState<keyof typeof ANIMATIONS>('Float');
  const [duration, setDuration] = useState(2);
  const [delay, setDelay] = useState(0);
  const [easing, setEasing] = useState<keyof typeof EASINGS>('Ease In Out');
  const [iteration, setIteration] = useState<'1' | '3' | 'infinite'>('infinite');
  
  const [playKey, setPlayKey] = useState(0);

  const triggerPlay = () => setPlayKey(k => k + 1);

  const cssString = `
.animated-element {
  animation-name: previewAnim;
  animation-duration: ${duration}s;
  animation-timing-function: ${EASINGS[easing]};
  animation-delay: ${delay}s;
  animation-iteration-count: ${iteration};
  animation-fill-mode: both;
}
@keyframes previewAnim ${ANIMATIONS[animType].keyframes}
  `;

  const framerMotionString = `
<motion.div
  initial={{ /* map from keyframes */ }}
  animate={{ /* map to keyframes */ }}
  transition={{
    duration: ${duration},
    delay: ${delay},
    ease: "${EASINGS[easing].startsWith('cubic') ? EASINGS[easing] : EASINGS[easing]}",
    repeat: ${iteration === 'infinite' ? 'Infinity' : iteration === '1' ? 0 : 2}
  }}
>
  Content
</motion.div>
  `;

  const Sidebar = (
    <div className="flex flex-col gap-6 p-4 h-full overflow-y-auto">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Sparkles size={16} className="text-primary" />
        <h2 className="font-display font-bold">Animation Lab</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <select 
            value={animType} 
            onChange={e => { setAnimType(e.target.value as any); triggerPlay(); }}
            className="p-2 rounded bg-background border border-border outline-none text-sm"
          >
            {Object.keys(ANIMATIONS).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground flex justify-between">
            Duration <span>{duration}s</span>
          </label>
          <input type="range" min="0.1" max="5" step="0.1" value={duration} onChange={e => { setDuration(Number(e.target.value)); triggerPlay(); }} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground flex justify-between">
            Delay <span>{delay}s</span>
          </label>
          <input type="range" min="0" max="3" step="0.1" value={delay} onChange={e => { setDelay(Number(e.target.value)); triggerPlay(); }} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Easing</label>
          <select 
            value={easing} 
            onChange={e => { setEasing(e.target.value as any); triggerPlay(); }}
            className="p-2 rounded bg-background border border-border outline-none text-sm"
          >
            {Object.keys(EASINGS).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Iteration</label>
          <div className="flex gap-2">
            {['1', '3', 'infinite'].map(i => (
              <button 
                key={i} 
                onClick={() => { setIteration(i as any); triggerPlay(); }}
                className={`flex-1 py-1 rounded border text-xs capitalize ${iteration === i ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background hover:bg-secondary'}`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <button onClick={triggerPlay} className="mt-4 py-2 bg-primary text-primary-foreground rounded shadow font-medium flex items-center justify-center gap-2 hover:opacity-90">
          <Play size={16} /> Preview
        </button>
      </div>
    </div>
  );

  return (
    <Layout sidebar={Sidebar}>
      <style dangerouslySetInnerHTML={{ __html: cssString }} />
      <div className="h-full flex flex-col p-8 bg-dot-pattern">
        
        <div className="flex justify-center items-center h-96 border border-border bg-card rounded-xl shadow-lg relative overflow-hidden mb-8">
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={triggerPlay} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors" title="Play">
              <Play size={16} />
            </button>
            <button onClick={() => setPlayKey(Date.now())} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors" title="Reset">
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Preview element */}
          <div 
            key={playKey} 
            className="animated-element w-32 h-32 rounded-2xl shadow-xl flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: colorRoles.primary, backgroundImage: `linear-gradient(135deg, ${colorRoles.primary}, ${colorRoles.surface})` }}
          >
            ✦
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-6 shadow-xl text-sm relative">
            <h3 className="font-bold mb-4 text-[#a5b4fc] flex items-center gap-2">
              CSS Keyframes
            </h3>
            <button className="absolute top-6 right-6 text-muted-foreground hover:text-white"><Copy size={16}/></button>
            <pre className="text-[#e2e2f0] font-mono whitespace-pre-wrap leading-relaxed">{cssString.trim()}</pre>
          </div>

          <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-6 shadow-xl text-sm relative">
            <h3 className="font-bold mb-4 text-[#f472b6] flex items-center gap-2">
              Framer Motion
            </h3>
            <button className="absolute top-6 right-6 text-muted-foreground hover:text-white"><Copy size={16}/></button>
            <pre className="text-[#e2e2f0] font-mono whitespace-pre-wrap leading-relaxed">{framerMotionString.trim()}</pre>
          </div>
        </div>

      </div>
    </Layout>
  );
}
