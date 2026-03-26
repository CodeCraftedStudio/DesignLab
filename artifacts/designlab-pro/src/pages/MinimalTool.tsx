import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, ArrowLeftRight, Twitter } from 'lucide-react';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, contrastRatio, wcagLevel } from '@/utils/colorMath';

export default function MinimalTool() {
  const [fg, setFg] = useState('#004466');
  const [bg, setBg] = useState('#00ffa2');

  const fgHsl = useMemo(() => {
    const rgb = hexToRgb(fg);
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
  }, [fg]);

  const bgHsl = useMemo(() => {
    const rgb = hexToRgb(bg);
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
  }, [bg]);

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);
  const level = wcagLevel(ratio);

  const updateFg = (h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l);
    setFg(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  const updateBg = (h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l);
    setBg(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  const reverse = () => {
    const temp = fg;
    setFg(bg);
    setBg(temp);
  };

  const randomize = () => {
    const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setFg(randomHex());
    setBg(randomHex());
  };

  return (
    <div
      className="w-full h-auto min-h-[calc(100vh-3.5rem)] transition-colors duration-300 flex flex-col p-4 sm:p-6 md:p-10 lg:p-12 selection:bg-current selection:text-transparent relative font-sans overflow-y-visible"
      style={{ backgroundColor: bg, color: fg }}
    >
      {/* Top Right Social Link */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 z-10">
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 bg-current text-inherit rounded-sm text-[8px] sm:text-[10px] font-bold uppercase transition-transform active:scale-95 group"
          style={{ backgroundColor: fg, color: bg }}
        >
          <Twitter size={8} className="sm:w-[10px] sm:h-[10px]" fill="currentColor" />
          <span>Post</span>
        </a>
      </div>

      <header className="mb-4 sm:mb-6 md:mb-10">
        <div className="flex items-baseline gap-3 sm:gap-4 md:gap-5 mb-1 sm:mb-2 md:mb-3">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight">Aa</h1>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">{ratio.toFixed(2)}</span>
            <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-bold opacity-70 tracking-widest">{level}</span>
          </div>
        </div>
        <p className="max-w-xl text-[10px] sm:text-[12px] md:text-[13px] leading-relaxed font-medium opacity-90 sm:block hidden">
          Contrast is the difference in luminance or color that makes an object distinguishble.
          Determined by the difference in color and brightness of the object within the field of view.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-16 lg:gap-24 mb-10 sm:mb-16">
        {/* Foreground Controls */}
        <div className="flex flex-col">
          <div className="mb-1 sm:mb-2">
            <div className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-0.5 sm:mb-1">Text</div>
            <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 sm:mb-4 leading-none">{fg}</div>
          </div>

          <div className="space-y-2 sm:space-y-4 md:space-y-6 max-w-sm lg:max-w-md">
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest opacity-60">
                Hue {Math.round(fgHsl.h)}°
              </div>
              <input
                type="range" min="0" max="360" value={fgHsl.h}
                onChange={(e) => updateFg(Number(e.target.value), fgHsl.s, fgHsl.l)}
                className="minimal-range"
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest opacity-60">
                Saturation {fgHsl.s / 100 === 1 ? '1' : (fgHsl.s / 100).toFixed(1)}
              </div>
              <input
                type="range" min="0" max="100" value={fgHsl.s}
                onChange={(e) => updateFg(fgHsl.h, Number(e.target.value), fgHsl.l)}
                className="minimal-range"
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest opacity-60">
                Lightness {fgHsl.l / 100 === 1 ? '1' : (fgHsl.l / 100).toFixed(1)}
              </div>
              <input
                type="range" min="0" max="100" value={fgHsl.l}
                onChange={(e) => updateFg(fgHsl.h, fgHsl.s, Number(e.target.value))}
                className="minimal-range"
              />
            </div>
          </div>

          <div className="mt-3 sm:mt-6 md:mt-8 flex gap-2 sm:gap-3">
            <button
              onClick={reverse}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-current text-inherit text-[8px] sm:text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 border border-current/20"
              style={{ backgroundColor: fg, color: bg }}
            >
              Reverse
            </button>
            <button
              onClick={randomize}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-current text-inherit text-[8px] sm:text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 border border-current/20"
              style={{ backgroundColor: fg, color: bg }}
            >
              Random
            </button>
          </div>
        </div>

        {/* Background Controls */}
        <div className="flex flex-col">
          <div className="mb-1 sm:mb-2 pt-4 md:pt-0 border-t border-current/10 md:border-none">
            <div className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-0.5 sm:mb-1">Background</div>
            <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 sm:mb-4 leading-none">{bg}</div>
          </div>

          <div className="space-y-2 sm:space-y-4 md:space-y-6 max-w-sm lg:max-w-md">
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest opacity-60">
                Hue {Math.round(bgHsl.h)}°
              </div>
              <input
                type="range" min="0" max="360" value={bgHsl.h}
                onChange={(e) => updateBg(Number(e.target.value), bgHsl.s, bgHsl.l)}
                className="minimal-range"
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest opacity-60">
                Saturation {bgHsl.s / 100 === 1 ? '1' : (bgHsl.s / 100).toFixed(1)}
              </div>
              <input
                type="range" min="0" max="100" value={bgHsl.s}
                onChange={(e) => updateBg(bgHsl.h, Number(e.target.value), bgHsl.l)}
                className="minimal-range"
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest opacity-60">
                Lightness {bgHsl.l / 100 === 1 ? '1' : (bgHsl.l / 100).toFixed(1)}
              </div>
              <input
                type="range" min="0" max="100" value={bgHsl.l}
                onChange={(e) => updateBg(bgHsl.h, bgHsl.s, Number(e.target.value))}
                className="minimal-range"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto pb-4 sm:pb-6 border-t border-current/5 pt-8">
        <div className="max-w-4xl text-base sm:text-xl md:text-3xl lg:text-4xl font-bold leading-[1.1] mb-4 sm:mb-8 tracking-tight">
          “If one says ‘Red’ (the name of the color) and there are 50 people listening, it can be expected that there will be 50 reds in their minds.”
          <div className="text-[9px] sm:text-[11px] md:text-[12px] mt-1.5 sm:mt-3 opacity-60 font-medium">— Josef Albers</div>
        </div>
        <div className="flex gap-4 sm:gap-6 text-[8px] sm:text-[9px] font-bold lowercase tracking-widest opacity-40">
          <a href="https://github.com/CodeCraftedStudio/DesignLab" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">github</a>
          <a href="https://abir2afridi.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">made by Abir Hasan Siam</a>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .minimal-range {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
          cursor: pointer;
          margin: 0.75rem 0;
        }
        .minimal-range::-webkit-slider-runnable-track {
          width: 100%;
          height: 1px;
          background: currentColor;
          opacity: 0.3;
        }
        .minimal-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background: currentColor;
          margin-top: -4.5px;
          border: none;
          transition: transform 0.1s ease-in-out;
        }
        .minimal-range:active::-webkit-slider-thumb {
          transform: scale(1.5);
        }
        .minimal-range::-moz-range-track {
          width: 100%;
          height: 1px;
          background: currentColor;
          opacity: 0.3;
        }
        .minimal-range::-moz-range-thumb {
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background: currentColor;
          border: none;
        }
      `}} />
    </div>
  );
}
