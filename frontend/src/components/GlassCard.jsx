import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', delay = 0, noAnimation = false }) {
  const content = (
    <div className={`glass-panel p-8 rounded-2xl border border-white/10 backdrop-blur-xl bg-slate-800/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${className}`}>
      {children}
    </div>
  );

  if (noAnimation) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className="w-full"
    >
      {content}
    </motion.div>
  );
}
