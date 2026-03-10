import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Search, Sparkles, Wind, Heart, BookOpen, MapPin, Loader2, ChevronRight } from 'lucide-react';
import { analyzeLyrics } from './services/gemini';
import { LyricalAnalysis } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [lyrics, setLyrics] = useState('');
  const [analysis, setAnalysis] = useState<LyricalAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!lyrics.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeLyrics(lyrics);
      setAnalysis(result);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze lyrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-orange-500/30">
      <div className="atmosphere" />
      
      {/* Header */}
      <header className="pt-12 pb-8 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
        >
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-medium uppercase tracking-widest text-white/60">Linguistic Intelligence</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-serif italic mb-4 tracking-tighter"
        >
          LyricSoul
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 max-w-xl mx-auto text-lg font-light leading-relaxed"
        >
          Dissecting the emotional architecture and thematic nuances of your favorite verses.
        </motion.p>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-8 mb-12"
        >
          <div className="relative">
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Paste song lyrics here..."
              className="w-full h-64 bg-transparent border-none focus:ring-0 text-xl font-light leading-relaxed placeholder:text-white/10 resize-none"
            />
            <div className="absolute bottom-0 right-0 p-2 text-white/10 pointer-events-none">
              <Music className="w-12 h-12" />
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xs text-white/20 uppercase tracking-widest">
              {lyrics.length} characters
            </p>
            <button
              onClick={handleAnalyze}
              disabled={loading || !lyrics.trim()}
              className={cn(
                "group relative px-8 py-4 rounded-full font-medium transition-all duration-300 overflow-hidden",
                loading || !lyrics.trim() 
                  ? "bg-white/5 text-white/20 cursor-not-allowed" 
                  : "bg-white text-black hover:scale-105 active:scale-95"
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Soul
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="text-red-400 text-center mb-8 bg-red-400/10 py-3 rounded-xl border border-red-400/20">
            {error}
          </div>
        )}

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {analysis && (
            <motion.div
              key="analysis"
              ref={resultRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="space-y-12"
            >
              {/* Core Narrative */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-orange-500">
                  <BookOpen className="w-5 h-5" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">The Core Narrative</h2>
                </div>
                <p className="text-3xl md:text-4xl font-serif leading-tight text-white/90">
                  {analysis.coreNarrative}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Emotional Spectrum */}
                <div className="glass rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3 text-orange-500">
                    <Heart className="w-5 h-5" />
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">Emotional Spectrum</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">Primary Emotion</label>
                      <p className="text-2xl font-medium">{analysis.emotionalSpectrum.primaryEmotion}</p>
                    </div>
                    
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">Intensity</label>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-serif italic">{analysis.emotionalSpectrum.intensity}</span>
                        <span className="text-white/20 mb-1">/ 10</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.emotionalSpectrum.intensity * 10}%` }}
                          className="h-full bg-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">Mood Shift</label>
                      <p className="text-white/60 leading-relaxed italic">"{analysis.emotionalSpectrum.moodShift}"</p>
                    </div>
                  </div>
                </div>

                {/* Vibe & Setting */}
                <div className="glass rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3 text-orange-500">
                    <MapPin className="w-5 h-5" />
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">Vibe & Setting</h2>
                  </div>
                  <p className="text-xl font-light leading-relaxed text-white/80 italic">
                    {analysis.vibeAndSetting}
                  </p>
                  <div className="pt-4 border-t border-white/5">
                    <Wind className="w-8 h-8 text-white/10" />
                  </div>
                </div>
              </div>

              {/* Literary Devices */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-orange-500">
                  <Search className="w-5 h-5" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">Literary Devices & Symbolism</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.literaryDevices.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <h3 className="text-orange-400 font-medium mb-2">{item.device}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{item.explanation}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Subtext */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-orange-500">
                  <Wind className="w-5 h-5" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">Reading Between the Lines</h2>
                </div>
                <div className="glass rounded-3xl p-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                  <p className="text-2xl font-light leading-relaxed text-white/80">
                    {analysis.subtext}
                  </p>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-white/5">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/20">
          LyricSoul &copy; 2026 &bull; Powered by Gemini 3.1 Pro
        </p>
      </footer>
    </div>
  );
}
