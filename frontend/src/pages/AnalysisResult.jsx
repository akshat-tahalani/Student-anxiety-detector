import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function AnalysisResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const anxiety_level = location.state?.anxiety_level;

  if (!anxiety_level) {
    return <Navigate to="/" replace />;
  }

  const getCategory = (level) => {
    if (level === "Low Anxiety")
      return {
        label: 'Low Anxiety',
        emoji: '😌',
        color: '#10b981',
        glow: 'rgba(16,185,129,0.3)',
        bg: 'rgba(16,185,129,0.08)',
        border: 'rgba(16,185,129,0.3)',
        desc: 'You seem calm and prepared. Great job managing your stress!',
        dots: 1,
      };
    if (level === "Moderate Anxiety")
      return {
        label: 'Moderate Anxiety',
        emoji: '😐',
        color: '#f59e0b',
        glow: 'rgba(245,158,11,0.3)',
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.3)',
        desc: 'You have some pre-exam jitters, which is normal and can help keep you focused.',
        dots: 2,
      };
    return {
      label: 'High Anxiety',
      emoji: '😰',
      color: '#ef4444',
      glow: 'rgba(239,68,68,0.3)',
      bg: 'rgba(239,68,68,0.08)',
      border: 'rgba(239,68,68,0.3)',
      desc: 'You are experiencing significant stress. Taking a step back to breathe and reset is highly recommended.',
      dots: 3,
    };
  };

  const { label, emoji, color, glow, bg, border, desc, dots } = getCategory(anxiety_level);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 flex flex-col items-center">

      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <HeartPulse size={48} className="mx-auto text-blue-400 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-300">
          Analysis Complete
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 w-full">

        {/* Mood Visual Card */}
        <GlassCard delay={0.2} className="flex flex-col items-center justify-center p-12 gap-6">

          {/* Glowing emoji circle */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
            style={{
              background: bg,
              border: `1.5px solid ${border}`,
              boxShadow: `0 0 40px ${glow}`,
            }}
            className="w-36 h-36 rounded-full flex items-center justify-center"
          >
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>{emoji}</span>
          </motion.div>

          {/* Level dots indicator — 1 dot = low, 2 = moderate, 3 = high */}
          <div className="flex gap-3 items-center">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{
                  background: i <= dots ? color : 'rgba(255,255,255,0.1)',
                  boxShadow: i <= dots ? `0 0 10px ${glow}` : 'none',
                }}
                className="w-4 h-4 rounded-full"
              />
            ))}
          </div>

          {/* Label */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold tracking-wide"
            style={{ color }}
          >
            {label}
          </motion.h3>

        </GlassCard>

        {/* Insight Card */}
        <GlassCard delay={0.4} className="flex flex-col justify-center gap-6 p-10">
          <div>
            <h4 className="text-blue-200 text-sm uppercase tracking-widest font-bold mb-3 border-b border-blue-500/30 pb-2">
              AI Output Summary
            </h4>
            <p className="text-xl leading-relaxed text-slate-200 font-light">{desc}</p>
          </div>

          <div className="mt-auto space-y-4">
            <button
              onClick={() => navigate('/suggestions', { state: { level: label } })}
              className="w-full glow-button py-4 rounded-xl font-bold flex items-center justify-center gap-2 group"
            >
              Get Actionable Suggestions
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 rounded-xl font-bold border-2 border-slate-600 hover:border-slate-400 hover:bg-slate-700/30 transition-all flex items-center justify-center text-slate-300"
            >
              View My History
            </button>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
