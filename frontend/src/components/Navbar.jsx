import React from 'react';

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

export default function Navbar({ activeTab, setActiveTab, hasPrediction }) {
  return (
    <nav className="w-full max-w-4xl mx-auto mb-8 px-4">
      <div className="glass gradient-border rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <BrainIcon />
          </div>
          <div>
            <span className="text-white font-black text-lg tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
              MNIST <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Predictor</span>
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-purple-500/20 text-white border border-purple-500/30'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => setActiveTab('results')}
            disabled={!hasPrediction}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              !hasPrediction
                ? 'opacity-40 cursor-not-allowed text-slate-600'
                : activeTab === 'results'
                ? 'bg-purple-500/20 text-white border border-purple-500/30'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            Results
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'about'
                ? 'bg-purple-500/20 text-white border border-purple-500/30'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            About
          </button>
        </div>
      </div>
    </nav>
  );
}
