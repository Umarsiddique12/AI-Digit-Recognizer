import React from 'react';
import UploadBox from '../components/UploadBox';
import PredictionCard from '../components/PredictionCard';
import Loader from '../components/Loader';

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-purple-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

export default function Home({
  onPredict,
  onClear,
  loading,
  error,
  prediction,
  confidence,
  showResult,
  predCount,
}) {
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 px-4">
      {/* Drawing / Upload Canvas Panel */}
      <div className="lg:col-span-3 slide-up" style={{ animationDelay: '0.05s' }}>
        <UploadBox onPredict={onPredict} onClear={onClear} loading={loading} />
        
        {predCount > 0 && (
          <div className="mt-3 text-center">
            <span className="text-slate-600 text-xs">
              {predCount} prediction{predCount > 1 ? 's' : ''} made this session
            </span>
          </div>
        )}
      </div>

      {/* Quick Prediction Preview & Stats Panel */}
      <div className="lg:col-span-2 flex flex-col gap-6 slide-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Prediction Preview Box */}
        <div className="glass gradient-border rounded-3xl p-6 flex-1 flex flex-col items-center justify-center min-h-[220px]">
          {error ? (
            <div className="text-center w-full">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-red-400 text-sm font-medium leading-relaxed">{error}</p>
            </div>
          ) : loading ? (
            <Loader />
          ) : prediction !== null && showResult ? (
            <PredictionCard prediction={prediction} confidence={confidence} />
          ) : (
            <div className="text-center select-none">
              <div className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center mx-auto mb-4 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <BrainIcon />
              </div>
              <h4 className="text-slate-300 text-sm font-semibold tracking-wide" style={{ fontFamily: 'Space Grotesk' }}>
                AI Ready
              </h4>
              <p className="text-slate-500 text-xs mt-1 max-w-[180px] mx-auto leading-relaxed">
                Draw or upload a digit on the canvas to see the prediction.
              </p>
            </div>
          )}
        </div>

        {/* Stats Summary Dashboard */}
        <div className="glass gradient-border rounded-3xl p-5">
          <h4 className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Model Specifications
          </h4>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="text-center p-3 rounded-2xl bg-black/20 border border-white/5">
              <div className="text-xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>98.9%</div>
              <div className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider mt-0.5">Accuracy</div>
            </div>
            <div className="text-center p-3 rounded-2xl bg-black/20 border border-white/5">
              <div className="text-xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>CNN</div>
              <div className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider mt-0.5">Type</div>
            </div>
            <div className="text-center p-3 rounded-2xl bg-black/20 border border-white/5">
              <div className="text-xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>60,000</div>
              <div className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider mt-0.5">Train Set</div>
            </div>
            <div className="text-center p-3 rounded-2xl bg-black/20 border border-white/5">
              <div className="text-xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>28 x 28</div>
              <div className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider mt-0.5">Resolution</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
