import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, PenLine, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';

export default function InputSection() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const charLimit = 500;

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!text.trim()) return;

  setIsAnalyzing(true);

  try {
    // ✅ Call your FastAPI backend
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statement: text }),
    });

    const result = await response.json();
    // result = { statement, anxiety_level, confidence }

    // ✅ Save to localStorage for dashboard history
    const history = JSON.parse(localStorage.getItem('anxietyHistory') || '[]');
    const newEntry = {
      date: new Date().toISOString(),
      score: result.confidence,
      anxiety_level: result.anxiety_level,
      text
    };
    localStorage.setItem('anxietyHistory', JSON.stringify([...history, newEntry]));

    setIsAnalyzing(false);

    // ✅ Pass real result to your result page
    navigate('/result', { state: { 
      score: result.confidence, 
      anxiety_level: result.anxiety_level 
    }});

  } catch (error) {
    console.error("Backend error:", error);
    setIsAnalyzing(false);
    alert("Could not connect to backend. Make sure FastAPI is running on port 8000.");
  }
};

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
      
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center p-4 bg-purple-500/20 rounded-full mb-6 relative">
             <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl animate-pulse" />
             <BrainCircuit size={40} className="text-purple-300 relative z-10" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-indigo-300">
          Share Your Thoughts
        </h2>
        <p className="text-slate-300 text-lg max-w-xl mx-auto font-light leading-relaxed">
          Write down how you feel about your upcoming exam. Be honest—our AI uses your words to accurately gauge your anxiety level.
        </p>
      </motion.div>

      <GlassCard className="w-full max-w-2xl relative overflow-hidden" delay={0.2}>
        <AnimatePresence mode="wait">
          {!isAnalyzing ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex justify-between items-center mb-2 px-2">
                <label className="text-sm font-semibold text-blue-200 tracking-wide uppercase flex items-center gap-2">
                  <PenLine size={16} /> Write here
                </label>
                <span className={`text-xs font-mono font-bold ${text.length > charLimit ? 'text-red-400' : 'text-slate-400'}`}>
                  {text.length}/{charLimit}
                </span>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.substring(0, charLimit))}
                placeholder="Ex. I have a math exam tomorrow and I feel like my mind will go blank..."
                className="glass-input w-full h-48 rounded-xl p-6 text-lg resize-none placeholder:text-slate-500 transition-all focus:ring-2 focus:ring-blue-500/50"
                required
              />

              <button
                type="submit"
                disabled={!text.trim()}
                className="glow-button mt-4 px-8 py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 group w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Analyze Thoughts
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-64 gap-6"
            >
              <Loader2 size={64} className="text-blue-400 animate-spin" />
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 animate-pulse">
                  AI is Analyzing...
                </h3>
                <p className="text-slate-400">Processing linguistic patterns</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

    </div>
  );
}
