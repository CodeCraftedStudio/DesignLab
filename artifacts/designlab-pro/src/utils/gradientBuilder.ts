export function buildLinearGradient(angle: number, stops: string[]) {
  return `linear-gradient(${angle}deg, ${stops.join(', ')})`;
}

export function buildRadialGradient(shape: string, posX: string, posY: string, size: string, stops: string[]) {
  return `radial-gradient(${shape} ${size} at ${posX} ${posY}, ${stops.join(', ')})`;
}

export function buildConicGradient(fromAngle: number, posX: string, posY: string, stops: string[]) {
  return `conic-gradient(from ${fromAngle}deg at ${posX} ${posY}, ${stops.join(', ')})`;
}

export function stopsToCss(stops: {color: string, position?: number}[]) {
  return stops.map(s => s.position !== undefined ? `${s.color} ${s.position}%` : s.color).join(', ');
}

export const PRESET_GRADIENTS = [
  { name: 'Sunset', type: 'linear', angle: 45, stops: ['#ff7b00', '#ff007b'] },
  { name: 'Ocean', type: 'linear', angle: 135, stops: ['#0072ff', '#00c6ff'] },
  { name: 'Forest', type: 'linear', angle: 90, stops: ['#11998e', '#38ef7d'] },
  { name: 'Berry', type: 'linear', angle: 45, stops: ['#834d9b', '#d04ed6'] },
  { name: 'Mango', type: 'linear', angle: 45, stops: ['#ffa751', '#ffe259'] },
  { name: 'Dusk', type: 'linear', angle: 180, stops: ['#2c3e50', '#fd746c'] },
  { name: 'Aurora', type: 'radial', shape: 'circle', pos: '50% 50%', size: 'farthest-corner', stops: ['#00c6ff', '#0072ff'] },
  { name: 'Lava', type: 'linear', angle: 45, stops: ['#ff416c', '#ff4b2b'] },
  { name: 'Skyline', type: 'linear', angle: 180, stops: ['#141e30', '#243b55'] },
  { name: 'Candy', type: 'linear', angle: 45, stops: ['#d3959b', '#bfe6ba'] },
  { name: 'Mint', type: 'linear', angle: 45, stops: ['#00b09b', '#96c93d'] },
  { name: 'Vortex', type: 'conic', angle: 0, pos: '50% 50%', stops: ['#834d9b', '#d04ed6', '#834d9b'] }
];
