import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, ListChecks, Sun, Lightbulb, Home, ArrowRight, Brain } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function Suggestions() {
  const location = useLocation();
  const navigate = useNavigate();
  const level = location.state?.level || 'Moderate Anxiety';

  const tips = [
    {
      id: 'box-breathing',
      title: 'Box Breathing',
      subtitle: '4 · 4 · 4 rhythm',
      icon: <Wind size={28} className="text-emerald-400" />,
      iconBg: 'rgba(16,185,129,0.12)',
      iconBorder: 'rgba(16,185,129,0.25)',
      desc: 'Slow your heart rate and calm your nervous system with this simple breathing pattern used by athletes and Navy SEALs.',
    },
    {
      id: 'chunking',
      title: 'Study Chunking',
      subtitle: 'Pomodoro method',
      icon: <ListChecks size={28} className="text-blue-400" />,
      iconBg: 'rgba(59,130,246,0.12)',
      iconBorder: 'rgba(59,130,246,0.25)',
      desc: 'Break your syllabus into 25-minute focused blocks. One chunk at a time, one victory at a time.',
    },
    {
      id: 'active-recall',
      title: 'Active Recall',
      subtitle: 'Test yourself',
      icon: <Lightbulb size={28} className="text-yellow-400" />,
      iconBg: 'rgba(245,158,11,0.12)',
      iconBorder: 'rgba(245,158,11,0.25)',
      desc: 'Instead of re-reading, quiz yourself. Flashcards and self-explanation are proven to double retention.',
    },
    {
      id: 'sunlight',
      title: 'Sunlight Reset',
      subtitle: 'Light & hydration',
      icon: <Sun size={28} className="text-orange-400" />,
      iconBg: 'rgba(251,146,60,0.12)',
      iconBorder: 'rgba(251,146,60,0.25)',
      desc: 'A glass of water and 10 minutes of sunlight resets your circadian rhythm and sharpens your focus.',
    },
    {
      id: 'pmr',
      title: 'Muscle Relaxation',
      subtitle: 'Progressive PMR',
      icon: <Brain size={28} className="text-purple-400" />,
      iconBg: 'rgba(168,85,247,0.12)',
      iconBorder: 'rgba(168,85,247,0.25)',
      desc: 'Tense and release each muscle group from toe to head. One of the most effective techniques for deep physical calm.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-16 flex flex-col items-center">

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-200">
          Your Action Plan
        </h2>
        <p className="text-slate-400 text-lg">Curated for your {level.toLowerCase()}</p>
      </motion.div>

      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, idx) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
          >
            <GlassCard className="hover:scale-[1.01] transition-transform duration-300 cursor-pointer group">
              <div className="flex items-center gap-5">

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: tip.iconBg, border: `1px solid ${tip.iconBorder}` }}
                >
                  {tip.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white/90">{tip.title}</h3>
                    <span className="text-xs text-slate-500 font-mono">{tip.subtitle}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed font-light">{tip.desc}</p>
                </div>

                {/* Arrow */}
                <button
                  onClick={() => navigate(`/exercise/${tip.id}`, { state: { level } })}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold flex-shrink-0 group-hover:translate-x-1 duration-300"
                >
                  Try it
                  <ArrowRight size={16} />
                </button>

              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-semibold group"
        >
          <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
          Back to Home
        </button>
      </motion.div>

    </div>
  );
}
