export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export function linearize(val: number) {
  val = val / 255;
  return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function contrastRatio(hex1: string, hex2: string) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function wcagLevel(ratio: number): 'AAA' | 'AA' | 'AA Large' | 'Fail' {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

export function generateHarmony(hex: string, type: 'complementary'|'analogous'|'triadic'|'tetradic'|'split'|'monochromatic'): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const harmonies: string[] = [hex];
  
  const addColor = (hOffset: number, sOffset = 0, lOffset = 0) => {
    let h = (hsl.h + hOffset) % 360;
    if (h < 0) h += 360;
    let s = Math.max(0, Math.min(100, hsl.s + sOffset));
    let l = Math.max(0, Math.min(100, hsl.l + lOffset));
    const newRgb = hslToRgb(h, s, l);
    harmonies.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  switch (type) {
    case 'complementary':
      addColor(180);
      addColor(180, 0, 15);
      addColor(0, 0, 15);
      addColor(0, 0, -15);
      break;
    case 'analogous':
      addColor(30);
      addColor(60);
      addColor(-30);
      addColor(-60);
      break;
    case 'triadic':
      addColor(120);
      addColor(240);
      addColor(0, 0, 10);
      addColor(120, 0, 10);
      break;
    case 'tetradic':
      addColor(90);
      addColor(180);
      addColor(270);
      addColor(0, -10, -10);
      break;
    case 'split':
      addColor(150);
      addColor(210);
      addColor(150, 0, 10);
      addColor(210, 0, 10);
      break;
    case 'monochromatic':
      addColor(0, 0, 20);
      addColor(0, 0, 40);
      addColor(0, 0, -20);
      addColor(0, 0, -40);
      break;
  }
  return harmonies.slice(0, 5);
}

export function lerpHex(hex1: string, hex2: string, t: number) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  return rgbToHex(
    Math.round(c1.r + (c2.r - c1.r) * t),
    Math.round(c1.g + (c2.g - c1.g) * t),
    Math.round(c1.b + (c2.b - c1.b) * t)
  );
}

export function generateStops(hex1: string, hex2: string, count: number) {
  const stops = [];
  for (let i = 0; i < count; i++) {
    stops.push(lerpHex(hex1, hex2, i / (count - 1)));
  }
  return stops;
}

export function generateTints(hex: string, steps: number) {
  return generateStops('#ffffff', hex, steps);
}

export function generateShades(hex: string, steps: number) {
  return generateStops(hex, '#000000', steps);
}

export function adjustLightness(hex: string, delta: number) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.max(0, Math.min(100, hsl.l + delta));
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

export function isLight(hex: string) {
  return relativeLuminance(hex) > 0.179;
}
