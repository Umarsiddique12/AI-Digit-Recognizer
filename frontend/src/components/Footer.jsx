import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 text-center slide-up" style={{ animationDelay: '0.3s' }}>
      <p className="text-slate-600 text-xs">
        Built with <span className="text-purple-400 font-medium">TensorFlow</span> · <span className="text-blue-400 font-medium">React</span> · <span className="text-emerald-400 font-medium">Flask</span> · Trained on MNIST Dataset
      </p>
      <p className="text-slate-700 text-[10px] mt-2 font-mono">
        Production Structure &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
