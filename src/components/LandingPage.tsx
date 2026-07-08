/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import PakSpaceLogo from './Logo';
import { ArrowRight, Compass, Sparkles, BookOpen, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const { setView, setAuthMode } = useApp();

  const handleStart = (mode: 'signup' | 'signin') => {
    setAuthMode(mode);
    setView('auth');
  };

  return (
    <div 
      id="landing-container" 
      className="min-h-screen bg-[#080E21] text-[#E5E5E0] flex flex-col justify-between overflow-x-hidden relative selection:bg-blue-500/20 selection:text-blue-300 font-sans"
    >
      {/* Top Navigation */}
      <header className="relative w-full max-w-5xl mx-auto px-6 py-6 flex justify-between items-center z-10 border-b border-[#1E293B]">
        <div className="flex items-center">
          <PakSpaceLogo size="sm" showText={true} horizontal={true} />
        </div>
        
        <div className="flex items-center gap-5">
          <button
            id="signin-header-btn"
            onClick={() => handleStart('signin')}
            className="px-3 py-1.5 text-xs font-mono font-medium text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            id="join-header-btn"
            onClick={() => handleStart('signup')}
            className="px-4 py-2 text-xs font-mono font-bold text-white bg-[#004D34] hover:bg-[#003322] rounded-lg transition-all cursor-pointer border border-[#004D34]"
          >
            Join PakSpace
          </button>
        </div>
      </header>

      {/* Main Editorial Hero */}
      <main className="relative flex-grow flex flex-col justify-center items-center w-full max-w-3xl mx-auto px-6 py-16 md:py-24 z-10 text-center space-y-10">
        
        {/* Centered Logo & Brand Identity */}
        <div className="space-y-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-2"
          >
            <PakSpaceLogo size="xl" showText={false} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-4 text-center"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-yellow-400 leading-tight">
              PakSpace
            </h1>
            <p className="text-lg md:text-xl font-serif text-emerald-400 font-medium tracking-tight max-w-xl mx-auto italic">
              "The student space to connect, share, learn, and grow."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-xl pt-3"
          >
            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-sans">
              PakSpace is a student-powered platform where university communities share opportunities, discussions, resources, and marketplace items.
            </p>
          </motion.div>

          {/* Clean Call To Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 w-full max-w-md"
          >
            <button
              id="signup-landing-btn"
              onClick={() => handleStart('signup')}
              className="w-full sm:w-48 px-6 py-3.5 bg-[#004D34] hover:bg-[#003322] text-white font-mono font-bold rounded-lg transition-all shadow-md transform active:scale-[0.98] text-xs cursor-pointer flex items-center justify-center gap-2 group"
            >
              Join PakSpace
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              id="explore-landing-btn"
              onClick={() => handleStart('signin')}
              className="w-full sm:w-48 px-6 py-3.5 bg-transparent hover:bg-white/5 border border-[#1E293B] hover:border-gray-500 text-gray-300 font-mono font-bold rounded-lg transition-all transform active:scale-[0.98] text-xs cursor-pointer"
            >
              Explore Communities
            </button>
          </motion.div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative w-full max-w-5xl mx-auto px-6 py-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 z-10 text-[10px] text-gray-500 font-sans">
        <p className="tracking-wide text-gray-400 font-mono">
          © 2026 PakSpace Platform. Built for student community in Pakistan 🇵🇰
        </p>
        <div className="flex gap-6 font-mono text-gray-400">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-white cursor-pointer transition-colors">Safety Code</span>
        </div>
      </footer>
    </div>
  );
}
