export function polylinePoints(data: number[], width: number, height: number, padding: number) {
  if (!data || data.length === 0) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  
  return data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * innerWidth;
    const y = height - padding - ((val - min) / range) * innerHeight;
    return `${x},${y}`;
  }).join(' ');
}

export function areaPolygon(data: number[], width: number, height: number, padding: number) {
  if (!data || data.length === 0) return '';
  const points = polylinePoints(data, width, height, padding);
  const innerWidth = width - padding * 2;
  return `${points} ${width - padding},${height - padding} ${padding},${height - padding}`;
}

export function barRects(data: number[], width: number, height: number, padding: number, barWidth: number) {
  if (!data || data.length === 0) return [];
  const min = Math.min(0, ...data); // Bars usually start from 0
  const max = Math.max(...data);
  const range = max - min || 1;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  
  return data.map((val, i) => {
    const spacing = innerWidth / data.length;
    const x = padding + (i * spacing) + (spacing - barWidth) / 2;
    const h = ((val - min) / range) * innerHeight;
    const y = height - padding - h;
    return { x, y, w: barWidth, h, value: val };
  });
}

export function donutSegments(data: number[], cx: number, cy: number, r: number, innerR: number, colors: string[]) {
  const total = data.reduce((a, b) => a + b, 0);
  const circumference = 2 * Math.PI * r;
  let currentOffset = 0;
  
  return data.map((val, i) => {
    const percent = val / total;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = `${-currentOffset}`;
    currentOffset += percent * circumference;
    
    return {
      d: `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`, // full circle path
      color: colors[i % colors.length],
      dasharray: strokeDasharray,
      dashoffset: strokeDashoffset
    };
  });
}

export function sparklinePoints(data: number[], width: number, height: number) {
  return polylinePoints(data, width, height, 0);
}
