import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Home, Calendar } from 'lucide-react';

import GlassCard from '../components/GlassCard';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('anxietyHistory') || '[]');
    
    // Format data for Recharts
    const formattedData = data.map((entry, idx) => {
      const dateObj = new Date(entry.date);
      return {
        name: `Entry ${idx + 1}`,
        dateStr: dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        score: entry.score,
        text: entry.text,
      };
    });

    setHistory(formattedData);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-xl shadow-2xl max-w-xs backdrop-blur-md">
          <p className="font-bold text-blue-300 mb-2">{data.dateStr}</p>
          <p className="text-3xl font-black mb-1" style={{color: data.score > 66 ? '#ef4444' : data.score > 33 ? '#f59e0b' : '#10b981'}}>
            {data.score}%
          </p>
          <p className="text-sm text-slate-400 italic font-light truncate">"{data.text}"</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center min-h-[80vh]">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center p-4 bg-blue-500/20 rounded-full mb-6">
             <TrendingUp size={40} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400">
          Your Mental Health Dashboard
        </h2>
        <p className="text-lg text-slate-300">Track how your anxiety has changed over time</p>
      </motion.div>

      <GlassCard delay={0.2} className="w-full max-w-5xl h-[500px] p-8 flex flex-col mb-8 relative">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
             <Calendar size={64} className="opacity-50" />
             <p className="text-xl">No history found yet. Take a test to see your progress!</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} tickMargin={10} axisLine={false} />
              <YAxis stroke="#64748b" tick={{fill: '#94a3b8'}} tickMargin={10} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="score" stroke="#a78bfa" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

      <motion.button 
          onClick={() => navigate('/')}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5 }}
          className="px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 group hover:bg-slate-800/50 transition-colors border-2 border-slate-700 hover:border-blue-500/50"
      >
          <Home size={20} className="text-blue-400 group-hover:-translate-y-1 transition-transform" /> 
          Return to Analysis
      </motion.button>
    </div>
  );
}
