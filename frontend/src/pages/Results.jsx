import React from 'react';
import PredictionCard from '../components/PredictionCard';

const DIGIT_COLORS = [
  'from-red-500 to-pink-500',
  'from-orange-500 to-amber-500',
  'from-yellow-500 to-lime-500',
  'from-green-500 to-emerald-500',
  'from-teal-500 to-cyan-500',
  'from-blue-500 to-sky-500',
  'from-indigo-500 to-violet-500',
  'from-purple-500 to-fuchsia-500',
  'from-pink-500 to-rose-500',
  'from-rose-500 to-red-500',
];

export default function Results({ prediction, confidence, allProbs }) {
  if (prediction === null || confidence === null || !allProbs) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-12 text-center slide-up">
        <div className="glass gradient-border rounded-3xl p-8">
          <p className="text-slate-400 text-sm">
            No prediction data found. Go to the <span className="text-purple-400 font-semibold cursor-pointer">Home</span> tab to draw and predict first!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 px-4 slide-up" style={{ animationDelay: '0.05s' }}>
      {/* Left Column: Visual Predicted Digit */}
      <div className="md:col-span-2 glass gradient-border rounded-3xl p-6 flex flex-col items-center justify-center min-h-[300px]">
        <PredictionCard prediction={prediction} confidence={confidence} />
      </div>

      {/* Right Column: Detailed probability distributions */}
      <div className="md:col-span-3 glass gradient-border rounded-3xl p-6">
        <h3 className="text-slate-300 text-sm font-semibold uppercase tracking-widest mb-6" style={{ fontFamily: 'Space Grotesk' }}>
          Probability Distribution
        </h3>
        
        <div className="space-y-3">
          {allProbs.map((prob, digit) => {
            const isPredicted = digit === prediction;
            return (
              <div key={digit} className="flex items-center gap-3">
                {/* Digit label */}
                <span className={`w-5 text-xs font-black text-right flex-shrink-0 ${isPredicted ? 'text-white' : 'text-slate-500'}`}>
                  {digit}
                </span>

                {/* Progress bar wrapper */}
                <div className="flex-1 h-2 rounded-full bg-black/40 overflow-hidden relative border border-white/[0.02]">
                  <div
                    className={`h-full rounded-full bar-fill bg-gradient-to-r ${DIGIT_COLORS[digit]} ${
                      isPredicted ? 'opacity-100 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'opacity-30'
                    }`}
                    style={{
                      '--bar-width': `${(prob * 100).toFixed(1)}%`,
                      animationDelay: `${digit * 0.04}s`,
                    }}
                  />
                </div>

                {/* Probability Value */}
                <span className={`w-12 text-xs text-right font-mono flex-shrink-0 ${isPredicted ? 'text-white font-bold' : 'text-slate-600'}`}>
                  {(prob * 100).toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
