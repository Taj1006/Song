import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Send, Sparkles, Loader2, RefreshCw, Heart } from 'lucide-react';
import { analyzeMood, MoodAnalysis } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzeMood(input);
      setResult(analysis);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-orange-500/30">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0 atmosphere pointer-events-none" />
      
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Header */}
        <header className="mb-16 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
                <Music className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-orange-500/80">ISO Principle Curator</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
              How does your <br />
              <span className="italic text-orange-500">soul feel</span> today?
            </h1>
            <p className="text-lg text-white/60 max-w-xl leading-relaxed">
              Describe your mood in any way you like—abstract, poetic, or direct. 
              Our AI psychologist will curate a musical journey to meet you where you are and guide you forward.
            </p>
          </motion.div>
        </header>

        {/* Input Section */}
        <section className="mb-24">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass-card p-1"
          >
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 'I feel like a rainy window on a Sunday afternoon' or 'Like a static-filled radio in a desert'..."
                className="w-full bg-transparent border-none focus:ring-0 p-6 md:p-8 text-xl md:text-2xl font-light placeholder:text-white/20 min-h-[200px] resize-none"
                disabled={loading}
              />
              <div className="flex items-center justify-between p-4 md:p-6 border-t border-white/5">
                <div className="flex gap-2">
                  {['Melancholy', 'Electric', 'Serene', 'Chaos'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setInput(tag)}
                      className="hidden md:block text-[10px] uppercase tracking-widest font-mono px-3 py-1 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className={cn(
                    "flex items-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all duration-300",
                    loading || !input.trim() 
                      ? "bg-white/5 text-white/20 cursor-not-allowed" 
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Curate My Mood</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mt-4 text-red-400 text-center font-mono text-sm"
            >
              {error}
            </motion.p>
          )}
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.section
              ref={resultsRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 mb-2 block">Detected Resonance</span>
                  <h2 className="text-4xl md:text-6xl font-serif italic text-orange-500 capitalize">
                    {result.detectedMood}
                  </h2>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Another Mood
                </button>
              </div>

              <div className="grid gap-6">
                {result.recommendations.map((rec, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group glass-card p-6 md:p-8 hover:bg-white/[0.08] transition-all duration-500 cursor-default"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-mono text-lg">
                        0{idx + 1}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl md:text-2xl font-medium group-hover:text-orange-500 transition-colors">
                            {rec.songTitle}
                          </h3>
                          <span className="text-white/20">—</span>
                          <p className="text-white/60 text-lg">{rec.artist}</p>
                        </div>
                        <p className="text-white/40 font-serif italic leading-relaxed">
                          {rec.reason}
                        </p>
                      </div>
                      <button className="md:opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-full hover:bg-white/10 text-white/40 hover:text-red-400">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <footer className="pt-12 text-center">
                <p className="text-white/20 text-xs font-mono uppercase tracking-widest">
                  The ISO Principle: Meet the mood, then shift the energy.
                </p>
              </footer>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-12 text-center border-t border-white/5 mt-24">
        <p className="text-white/30 text-sm">
          Curated with intention & AI
        </p>
      </footer>
    </div>
  );
}
