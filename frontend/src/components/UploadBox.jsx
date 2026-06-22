import React, { useRef, useState, useEffect, useCallback } from 'react';

// Icons
const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
  </svg>
);

const BRUSH_SIZES = [8, 15, 22, 30];

export default function UploadBox({ onPredict, onClear, loading }) {
  const [activeMode, setActiveMode] = useState('draw'); // 'draw' or 'upload'
  const canvasRef = useRef(null);
  
  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [brushSize, setBrushSize] = useState(15);
  
  // Upload states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize/clear drawing canvas
  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setHasDrawn(false);
  };

  useEffect(() => {
    if (activeMode === 'draw') {
      initializeCanvas();
    }
  }, [activeMode]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = useCallback((e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = '#111111';
    setIsDrawing(true);
    setHasDrawn(true);
  }, [brushSize]);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  }, []);

  const handleClear = () => {
    if (activeMode === 'draw') {
      initializeCanvas();
    } else {
      setUploadedFile(null);
      setPreviewUrl(null);
    }
    onClear();
  };

  const handlePredict = () => {
    if (activeMode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.toBlob((blob) => {
        if (blob) {
          onPredict(blob);
        }
      }, 'image/png');
    } else if (activeMode === 'upload' && uploadedFile) {
      onPredict(uploadedFile);
    }
  };

  // Upload Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const isPredictDisabled = activeMode === 'draw' ? !hasDrawn : !uploadedFile;

  return (
    <div className="glass gradient-border rounded-3xl p-6 h-full flex flex-col justify-between">
      {/* Mode Selectors */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveMode('draw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'draw'
                ? 'bg-purple-500/20 text-white border border-purple-500/35'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Draw Mode
          </button>
          <button
            onClick={() => setActiveMode('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'upload'
                ? 'bg-purple-500/20 text-white border border-purple-500/35'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload Mode
          </button>
        </div>

        {/* Brush sizes (only in draw mode) */}
        {activeMode === 'draw' && (
          <div className="flex items-center gap-1 bg-black/30 rounded-xl p-1 border border-white/5">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                  brushSize === size
                    ? 'border-purple-500/80 bg-purple-500/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
                title={`Brush: ${size}px`}
              >
                <div
                  className="rounded-full bg-white"
                  style={{ width: Math.max(3, size / 5), height: Math.max(3, size / 5) }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Editor Space */}
      <div className="flex-1 flex justify-center items-center py-2">
        {activeMode === 'draw' ? (
          <div className="relative flex justify-center w-full max-w-[360px] aspect-square rounded-2xl overflow-hidden" style={{ touchAction: 'none' }}>
            {!hasDrawn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none">
                <div className="text-slate-600 text-5xl font-black mb-1" style={{ fontFamily: 'Space Grotesk' }}>0–9</div>
                <p className="text-slate-500 text-xs">Draw a single digit here</p>
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="canvas-glow rounded-2xl touch-none w-full bg-white"
              style={{ cursor: 'crosshair', touchAction: 'none' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
        ) : (
          <div className="w-full max-w-[360px] aspect-square">
            {previewUrl ? (
              <div className="relative w-full h-full rounded-2xl overflow-hidden canvas-glow bg-white flex items-center justify-center">
                <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                <button
                  onClick={() => { setUploadedFile(null); setPreviewUrl(null); }}
                  className="absolute top-3 right-3 p-1.5 bg-black/75 hover:bg-black text-slate-300 hover:text-white rounded-lg transition-all"
                >
                  <ClearIcon />
                </button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full h-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                    : 'border-white/15 hover:border-white/35 bg-black/20'
                }`}
                onClick={() => document.getElementById('digit-image-upload').click()}
              >
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  <UploadIcon />
                </div>
                <h4 className="text-slate-200 text-sm font-semibold mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                  Drag & Drop Image
                </h4>
                <p className="text-slate-500 text-xs max-w-[200px] mb-3">
                  Upload a clean, high contrast image of a hand-written digit.
                </p>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-[10px] font-semibold hover:bg-white/10 transition-all">
                  Browse Files
                </span>
                <input
                  id="digit-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Button Controls */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleClear}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-2xl font-semibold transition-all border border-white/10 hover:border-white/20 active:scale-95 disabled:opacity-40"
          disabled={loading || (activeMode === 'draw' ? !hasDrawn : !uploadedFile)}
        >
          <ClearIcon />
          Clear
        </button>
        
        <button
          onClick={handlePredict}
          disabled={loading || isPredictDisabled}
          className="flex-[2] relative flex items-center justify-center gap-2 py-3.5 px-6 text-white rounded-2xl font-bold transition-all active:scale-95 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: loading || isPredictDisabled
              ? 'rgba(139,92,246,0.3)'
              : 'linear-gradient(135deg, #7c3aed, #3b82f6)',
            boxShadow: !loading && !isPredictDisabled ? '0 0 30px rgba(124,58,237,0.4)' : 'none'
          }}
        >
          {loading && <div className="shimmer absolute inset-0" />}
          {loading ? (
            <>
              <svg className="spin-slow w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeLinecap="round" />
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <BrainIcon />
              <span>Predict Digit</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
