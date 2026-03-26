export function generateCssVariables(tokens: Record<string, string>): string {
  let css = ':root {\n';
  for (const [key, value] of Object.entries(tokens)) {
    css += `  --${key}: ${value};\n`;
  }
  css += '}\n';
  return css;
}

export function generateScssVariables(tokens: Record<string, string>): string {
  let scss = '';
  for (const [key, value] of Object.entries(tokens)) {
    scss += `$${key}: ${value};\n`;
  }
  return scss;
}

export function generateTailwindConfig(tokens: Record<string, string>): string {
  const colors: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    colors[key] = `var(--${key})`;
  }
  return `module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/}/g, '      }')}
    }
  }
}`;
}
