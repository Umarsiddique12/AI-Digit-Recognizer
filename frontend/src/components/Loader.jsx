import React from 'react';

export default function Loader() {
  return (
    <div className="text-center py-8 flex flex-col items-center justify-center">
      {/* Glow Ring Loader */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-purple-500/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 border-r-purple-500 spin-slow shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
      </div>
      
      <h3 className="text-slate-300 text-sm font-semibold tracking-wide" style={{ fontFamily: 'Space Grotesk' }}>
        Analyzing Digit...
      </h3>
      <p className="text-slate-500 text-xs mt-1">
        Executing forward pass through CNN layers
      </p>
    </div>
  );
}
