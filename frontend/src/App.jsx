import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Background3D from './components/Background3D';
import Landing from './pages/Landing';
import InputSection from './pages/InputSection';
import AnalysisResult from './pages/AnalysisResult';
import Suggestions from './pages/Suggestions';
import Dashboard from './pages/Dashboard';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/input" element={<InputSection />} />
        <Route path="/result" element={<AnalysisResult />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="relative min-h-screen text-slate-100 overflow-hidden font-sans">
        <Background3D />
        
        {/* Navigation Bar / Header */}
        <header className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-transparent">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Exam Anxiety Detector
          </div>
          <nav className="flex gap-4">
            <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
            <a href="/dashboard" className="hover:text-purple-400 transition-colors">History</a>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 pt-24 min-h-screen flex flex-col sm:justify-center">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
