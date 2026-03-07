import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Brain, Sparkles, MoveRight } from 'lucide-react';
import BrainModel from '../components/BrainModel';
import GlassCard from '../components/GlassCard';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center lg:min-h-[80vh]">
      {/* Left Column - Text Content */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col gap-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 w-fit backdrop-blur-sm self-start">
          <Sparkles size={16} />
          <span className="text-sm font-medium tracking-wide uppercase">AI-Powered Detection</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          AI Exam Anxiety <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
            Detector
          </span>
        </h1>
        
        <p className="text-lg text-slate-300 max-w-lg leading-relaxed font-light">
          Understand and manage your exam stress. Write out your feelings and let our AI model analyze your anxiety levels, providing customized suggestions to help you achieve your best.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <button 
            onClick={() => navigate('/input')}
            className="glow-button px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 backdrop-blur-sm group"
          >
            Start Analysis
            <MoveRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Right Column - 3D Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative h-[400px] md:h-[600px] w-full"
      >
        <div className="absolute inset-0 flex items-center justify-center animate-pulse-glow rounded-full opacity-20 pointer-events-none"></div>
        <Suspense fallback={<div className="flex items-center justify-center h-full w-full"><Brain className="animate-bounce text-blue-400" size={48} /></div>}>
            <div className="w-full h-full relative z-10">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <BrainModel />
                </Canvas>
            </div>
        </Suspense>
      </motion.div>
    </div>
  );
}
