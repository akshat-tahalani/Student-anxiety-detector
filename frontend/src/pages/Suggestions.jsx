import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, ListChecks, Sun, Lightbulb, PlayCircle, Home } from 'lucide-react';

import GlassCard from '../components/GlassCard';

export default function Suggestions() {
  const location = useLocation();
  const navigate = useNavigate();
  const level = location.state?.level || 'Moderate Anxiety';

  const commonTips = [
    {
      title: 'Box Breathing 4-4-4',
      icon: <Wind size={32} className="text-emerald-400" />,
      desc: 'Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds. Repeat for 2 minutes to slow your heart rate.'
    },
    {
      title: 'Chunking Your Study',
      icon: <ListChecks size={32} className="text-blue-400" />,
      desc: 'Break your remaining syllabus into 25-minute Pomodoro sessions. Focus on completing one small chunk at a time.'
    },
    {
      title: 'Active Recall',
      icon: <Lightbulb size={32} className="text-yellow-400" />,
      desc: 'Instead of re-reading notes, test yourself. Create flashcards or teach the concepts to an imaginary friend.'
    },
    {
      title: 'Sunlight and Hydration',
      icon: <Sun size={32} className="text-orange-400" />,
      desc: 'Drink a glass of water and get 10 minutes of direct sunlight. It will reset your circadian rhythm and boost focus.'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center min-h-[85vh]">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-200">
          Personalized Action Plan
        </h2>
        <p className="text-xl text-slate-300">Targeted towards your {level.toLowerCase()}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        {commonTips.map((tip, idx) => (
          <GlassCard key={idx} delay={0.1 * idx} className="hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 shadow-inner">
                {tip.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-white/90">{tip.title}</h3>
                <p className="text-slate-300 leading-relaxed font-light">{tip.desc}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold uppercase tracking-wider group">
                 <PlayCircle size={18} className="group-hover:scale-110 transition-transform" /> Try it now
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.8 }}
        className="mt-16 text-center"
      >
        <button 
          onClick={() => navigate('/')}
          className="glow-button px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 w-fit mx-auto group"
        >
          <Home size={20} className="group-hover:-translate-y-1 transition-transform" /> Back to Home
        </button>
      </motion.div>
    </div>
  );
}
