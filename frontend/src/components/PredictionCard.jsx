import React from 'react';

export default function PredictionCard({ prediction, confidence }) {
  if (prediction === null || confidence === null) {
    return null;
  }

  // Calculate dynamic colors based on the digit
  const hue = prediction * 36;
  const gradientStart = `hsl(${hue}, 80%, 65%)`;
  const gradientEnd = `hsl(${hue + 60}, 80%, 55%)`;
  const shadowColor = `hsl(${hue}, 80%, 50%)`;

  return (
    <div className="text-center w-full flex flex-col items-center justify-center py-4">
      <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-3">
        Predicted Digit
      </p>
      
      {/* Glow Digit Display */}
      <div
        className="pop-in text-[7rem] font-black leading-none mb-3 bg-clip-text text-transparent select-none cursor-default"
        style={{
          backgroundImage: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
          filter: `drop-shadow(0 0 25px ${shadowColor})`,
          fontFamily: 'Space Grotesk'
        }}
      >
        {prediction}
      </div>

      {/* Confidence Bar */}
      <div className="w-full max-w-[240px]">
        <div className="flex items-center justify-between gap-2.5 mb-2">
          <div className="h-2 rounded-full bg-black/35 flex-1 overflow-hidden">
            <div
              className="h-full rounded-full bar-fill"
              style={{
                '--bar-width': `${(confidence * 100).toFixed(1)}%`,
                background: `linear-gradient(90deg, ${gradientStart}, ${gradientEnd})`
              }}
            />
          </div>
          <span className="text-white font-bold text-sm leading-none flex-shrink-0">
            {(confidence * 100).toFixed(1)}%
          </span>
        </div>
        <p className="text-slate-500 text-[11px] font-medium tracking-wide">
          Confidence Score
        </p>
      </div>
    </div>
  );
}
