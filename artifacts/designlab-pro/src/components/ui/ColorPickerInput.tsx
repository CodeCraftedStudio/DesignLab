import React from 'react';

interface ColorPickerInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export function ColorPickerInput({ label, value, onChange }: ColorPickerInputProps) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 rounded-md overflow-hidden ring-1 ring-border shadow-sm">
          <input 
            type="color" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 w-12 h-12 cursor-pointer"
          />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 text-xs font-mono bg-transparent border-none outline-none text-right uppercase focus:text-primary"
        maxLength={7}
      />
    </div>
  );
}
