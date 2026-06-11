import { useRef, useState, useEffect, useCallback } from 'react'

// Icons as inline SVGs
const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
)

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const PredictIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
  </svg>
)

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
)

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
]

const BRUSH_SIZES = [8, 15, 22, 30]

function App() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [allProbs, setAllProbs] = useState(null)
  const [confidence, setConfidence] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [brushSize, setBrushSize] = useState(15)
  const [showResult, setShowResult] = useState(false)
  const [predCount, setPredCount] = useState(0)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = useCallback((e) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineWidth = brushSize
    ctx.strokeStyle = '#111111'
    setIsDrawing(true)
    setHasDrawn(true)
  }, [brushSize])

  const draw = useCallback((e) => {
    if (!isDrawing) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getPos(e, canvas)
    ctx.lineTo(x, y)
    ctx.stroke()
  }, [isDrawing])

  const stopDrawing = useCallback(() => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.closePath()
    setIsDrawing(false)
  }, [])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setPrediction(null)
    setConfidence(null)
    setAllProbs(null)
    setError(null)
    setHasDrawn(false)
    setShowResult(false)
  }

  const getPrediction = () => {
    const canvas = canvasRef.current
    setLoading(true)
    setError(null)
    setShowResult(false)

    canvas.toBlob(async (blob) => {
      const formData = new FormData()
      formData.append('image', blob, 'digit.png')
      try {
        const response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()
        if (response.ok) {
          setPrediction(data.prediction)
          setConfidence(data.confidence)
          setAllProbs(data.all_probs || null)
          setPredCount(c => c + 1)
          setTimeout(() => setShowResult(true), 100)
        } else {
          setError(data.error || 'Prediction failed')
        }
      } catch {
        setError('Cannot connect to backend. Is Flask running on port 5000?')
      } finally {
        setLoading(false)
      }
    })
  }

  return (
    <div className="bg-animated min-h-screen w-full relative overflow-hidden">
      {/* Animated Orbs */}
      <div className="orb1 absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)' }} />
      <div className="orb2 absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />
      <div className="orb3 absolute top-[40%] right-[20%] w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 py-12">

        {/* Header */}
        <div className="text-center mb-8 slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-5 border border-purple-500/20">
            <SparkleIcon />
            <span className="text-xs font-semibold text-purple-300 tracking-widest uppercase">AI Powered · 98.9% Accuracy</span>
            <SparkleIcon />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Digit{' '}
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent glow-text">
              Recognizer
            </span>
          </h1>
          <p className="text-slate-400 text-base font-medium max-w-sm mx-auto">
            Draw any digit from <span className="text-white font-semibold">0 to 9</span> and watch our neural network predict it in real-time
          </p>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Left Panel — Canvas */}
          <div className="lg:col-span-3 slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="glass gradient-border rounded-3xl p-6 h-full">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-slate-400 text-xs font-medium">canvas.draw</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/30 rounded-xl p-1.5 border border-white/5">
                  {BRUSH_SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`brush-btn w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${brushSize === size ? 'active border-purple-500/80 bg-purple-500/20' : 'border-white/10 hover:border-white/20'}`}
                      title={`Brush: ${size}px`}
                    >
                      <div className="rounded-full bg-white" style={{ width: Math.max(4, size / 4), height: Math.max(4, size / 4) }}></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas */}
              <div className="relative flex justify-center">
                {!hasDrawn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                    <div className="text-slate-600 text-5xl font-black mb-2" style={{ fontFamily: 'Space Grotesk' }}>0–9</div>
                    <p className="text-slate-600 text-sm">Draw here</p>
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="canvas-glow rounded-2xl touch-none w-full max-w-[400px]"
                  style={{ cursor: 'crosshair', background: 'white' }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={clearCanvas}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-2xl font-semibold transition-all border border-white/10 hover:border-white/20 active:scale-95"
                >
                  <ClearIcon />
                  Clear
                </button>
                <button
                  onClick={getPrediction}
                  disabled={loading || !hasDrawn}
                  className="flex-[2] relative flex items-center justify-center gap-2 py-3.5 px-6 text-white rounded-2xl font-bold transition-all active:scale-95 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: loading || !hasDrawn
                      ? 'rgba(139,92,246,0.3)'
                      : 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                    boxShadow: !loading && hasDrawn ? '0 0 30px rgba(124,58,237,0.4)' : 'none'
                  }}
                >
                  {loading && <div className="shimmer absolute inset-0"></div>}
                  {loading
                    ? <>
                        <svg className="spin-slow w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeLinecap="round"/>
                        </svg>
                        Analyzing...
                      </>
                    : <>
                        <BrainIcon />
                        Predict Digit
                      </>
                  }
                </button>
              </div>

              {/* Prediction count badge */}
              {predCount > 0 && (
                <div className="mt-3 text-center">
                  <span className="text-slate-600 text-xs">{predCount} prediction{predCount > 1 ? 's' : ''} made</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel — Results */}
          <div className="lg:col-span-2 flex flex-col gap-4 slide-up" style={{ animationDelay: '0.2s' }}>

            {/* Main Prediction Card */}
            <div className="glass gradient-border rounded-3xl p-6 flex-1 flex flex-col items-center justify-center min-h-[200px]">
              {error ? (
                <div className="text-center w-full">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  </div>
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              ) : prediction !== null && showResult ? (
                <div className="text-center w-full">
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-3">Predicted Digit</p>
                  <div
                    className="pop-in text-[7rem] font-black leading-none mb-3 bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, hsl(${prediction * 36}, 80%, 65%), hsl(${prediction * 36 + 60}, 80%, 55%))`,
                      filter: `drop-shadow(0 0 30px hsl(${prediction * 36}, 80%, 50%))`
                    }}
                  >
                    {prediction}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="h-1.5 rounded-full bg-black/30 flex-1 overflow-hidden">
                      <div
                        className="h-full rounded-full bar-fill"
                        style={{
                          '--bar-width': `${(confidence * 100).toFixed(1)}%`,
                          background: `linear-gradient(90deg, hsl(${prediction * 36}, 80%, 55%), hsl(${prediction * 36 + 60}, 80%, 65%))`
                        }}
                      />
                    </div>
                    <span className="text-white font-bold text-sm">{(confidence * 100).toFixed(1)}%</span>
                  </div>
                  <p className="text-slate-500 text-xs">Confidence Score</p>
                </div>
              ) : loading ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-purple-500/30 border-t-purple-500 spin-slow mx-auto mb-4"></div>
                  <p className="text-slate-400 text-sm font-medium">Neural network thinking...</p>
                  <p className="text-slate-600 text-xs mt-1">Processing image through CNN</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center mx-auto mb-3">
                    <BrainIcon />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Draw a digit to begin</p>
                  <p className="text-slate-600 text-xs mt-1">AI prediction will appear here</p>
                </div>
              )}
            </div>

            {/* All Probabilities */}
            {showResult && allProbs && (
              <div className="glass gradient-border rounded-3xl p-5 slide-up">
                <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-4">All Digit Probabilities</p>
                <div className="space-y-2">
                  {allProbs.map((prob, digit) => (
                    <div key={digit} className="flex items-center gap-2.5">
                      <span className={`w-5 text-xs font-bold text-right flex-shrink-0 ${digit === prediction ? 'text-white' : 'text-slate-500'}`}>
                        {digit}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-black/40 overflow-hidden">
                        <div
                          className={`h-full rounded-full bar-fill bg-gradient-to-r ${DIGIT_COLORS[digit]} ${digit === prediction ? 'opacity-100' : 'opacity-40'}`}
                          style={{ '--bar-width': `${(prob * 100).toFixed(1)}%`, animationDelay: `${digit * 0.05}s` }}
                        />
                      </div>
                      <span className={`w-10 text-xs text-right flex-shrink-0 ${digit === prediction ? 'text-white font-bold' : 'text-slate-600'}`}>
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Card */}
            <div className="glass gradient-border rounded-3xl p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-2xl bg-black/20">
                  <div className="text-2xl font-black text-white">98.9%</div>
                  <div className="text-slate-500 text-xs mt-0.5">Model Accuracy</div>
                </div>
                <div className="text-center p-3 rounded-2xl bg-black/20">
                  <div className="text-2xl font-black text-white">CNN</div>
                  <div className="text-slate-500 text-xs mt-0.5">Architecture</div>
                </div>
                <div className="text-center p-3 rounded-2xl bg-black/20">
                  <div className="text-2xl font-black text-white">60K</div>
                  <div className="text-slate-500 text-xs mt-0.5">Training Images</div>
                </div>
                <div className="text-center p-3 rounded-2xl bg-black/20">
                  <div className="text-2xl font-black text-white">28²</div>
                  <div className="text-slate-500 text-xs mt-0.5">Input Pixels</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center slide-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-slate-600 text-xs">
            Built with <span className="text-purple-400">TensorFlow</span> · <span className="text-blue-400">React</span> · <span className="text-emerald-400">Flask</span> · Trained on MNIST Dataset
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
