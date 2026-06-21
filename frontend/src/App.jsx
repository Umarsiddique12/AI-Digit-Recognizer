import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Results from './pages/Results';
import About from './pages/About';
import { predictDigit } from './services/api';

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-purple-400">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [allProbs, setAllProbs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [predCount, setPredCount] = useState(0);

  // Triggered when clear button is pressed
  const clearPredictionState = () => {
    setPrediction(null);
    setConfidence(null);
    setAllProbs(null);
    setError(null);
    setShowResult(false);
  };

  // Sends the image blob to the API service
  const handlePrediction = async (imageBlob) => {
    console.log('[DEBUG] App.handlePrediction started with imageBlob:', imageBlob);
    setLoading(true);
    setError(null);
    setShowResult(false);

    try {
      console.log('[DEBUG] App.handlePrediction calling predictDigit(imageBlob)');
      const data = await predictDigit(imageBlob);
      console.log('[DEBUG] App.handlePrediction received data from predictDigit:', data);
      setPrediction(data.prediction);
      setConfidence(data.confidence);
      setAllProbs(data.all_probs || null);
      setPredCount((prev) => prev + 1);
      
      // Allow minor delay to make UI transition smooth
      setTimeout(() => {
        setShowResult(true);
        setActiveTab('results'); // Switch directly to Results tab for full details
      }, 150);
    } catch (err) {
      console.error('[DEBUG] App.handlePrediction caught an error:', err);
      console.error(err);
      setError(err.message || 'Unable to connect to Flask API. Ensure the backend is active on port 5000.');
    } finally {
      console.log('[DEBUG] App.handlePrediction finally block executing (loading = false)');
      setLoading(false);
    }
  };

  return (
    <div className="bg-animated min-h-screen w-full relative overflow-hidden flex flex-col justify-between py-12">
      {/* Background Glowing Orbs */}
      <div
        className="orb1 absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)' }}
      />
      <div
        className="orb2 absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }}
      />
      <div
        className="orb3 absolute top-[40%] right-[20%] w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)' }}
      />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-start">
        {/* Header Title */}
        <div className="text-center mb-6 slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 border border-purple-500/20">
            <SparkleIcon />
            <span className="text-xs font-semibold text-purple-300 tracking-widest uppercase">
              AI Powered · 98.9% Accuracy
            </span>
            <SparkleIcon />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Digit{' '}
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent glow-text">
              Recognizer
            </span>
          </h1>
        </div>

        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasPrediction={prediction !== null}
        />

        {/* Page Render */}
        <main className="flex-1 flex items-center">
          {activeTab === 'home' && (
            <Home
              onPredict={handlePrediction}
              onClear={clearPredictionState}
              loading={loading}
              error={error}
              prediction={prediction}
              confidence={confidence}
              showResult={showResult}
              predCount={predCount}
            />
          )}

          {activeTab === 'results' && (
            <Results
              prediction={prediction}
              confidence={confidence}
              allProbs={allProbs}
            />
          )}

          {activeTab === 'about' && <About />}
        </main>
      </div>

      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default App;
