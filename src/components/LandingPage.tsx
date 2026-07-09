import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import PakSpaceLogo from './Logo';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { setView, setAuthMode } = useApp();

  const handleStart = (mode: 'signup' | 'signin') => {
    setAuthMode(mode);
    setView('auth');
  };

  return (
    <div 
      id="landing-container" 
      className="min-h-screen bg-[#FACC15] text-[#1F2937] flex flex-col justify-between overflow-x-hidden relative selection:bg-[#3B82F6]/20 font-sans"
    >
      {/* Background grid details */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(31,41,55,0.02)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(31,41,55,0.02)_1.5px,transparent_1.5px)] bg-[size:30px_30px] opacity-100 pointer-events-none" />

      {/* Top Navigation */}
      <header className="relative w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center z-10">
        <div className="flex items-center">
          <PakSpaceLogo size="sm" showText={true} horizontal={true} textClassName="text-[#1F2937]" />
        </div>
        
        <div className="flex items-center gap-4">
          <button
            id="signin-header-btn"
            onClick={() => handleStart('signin')}
            className="px-5 py-2.5 text-sm font-semibold text-[#1F2937] hover:text-[#3B82F6] transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            id="join-header-btn"
            onClick={() => handleStart('signup')}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl transition-all shadow-lg shadow-blue-500/10 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            Join PakSpace
          </button>
        </div>
      </header>

      {/* Main Editorial Hero */}
      <main className="relative flex-grow flex flex-col justify-center items-center w-full max-w-4xl mx-auto px-6 py-12 md:py-20 z-10 text-center space-y-12">
        
        {/* Centered Logo & Brand Identity */}
        <div className="space-y-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="p-4 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <PakSpaceLogo size="xl" showText={false} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 max-w-2xl"
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-[#1F2937] leading-none uppercase">
              PAKSPACE
            </h1>
            <p className="text-lg md:text-2xl text-[#1F2937]/80 font-medium tracking-tight max-w-xl mx-auto italic font-serif">
              The premium student space to connect, share, learn, and grow.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <p className="text-base md:text-lg text-[#1F2937]/70 leading-relaxed font-medium">
              Join the official digital campus directory where Pakistani university students share resources, list marketplace items, and collaborate in secure spaces.
            </p>
          </motion.div>

          {/* Clean Call To Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-md"
          >
            <button
              id="signup-landing-btn"
              onClick={() => handleStart('signup')}
              className="w-full sm:w-52 px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-xl transition-all shadow-xl shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 text-sm cursor-pointer flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              id="explore-landing-btn"
              onClick={() => handleStart('signin')}
              className="w-full sm:w-52 px-8 py-4 bg-white/20 hover:bg-white/30 border border-[#1F2937]/10 hover:border-[#1F2937]/20 text-[#1F2937] font-bold rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm cursor-pointer"
            >
              Explore Dashboard
            </button>
          </motion.div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative w-full max-w-6xl mx-auto px-6 py-10 border-t border-[#1F2937]/10 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 text-xs text-[#1F2937]/60">
        <p className="font-semibold">
          © 2026 PakSpace Platform. Built for student community in Pakistan 🇵🇰
        </p>
        <div className="flex gap-6 font-semibold">
          <span className="hover:text-[#1F2937] cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-[#1F2937] cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-[#1F2937] cursor-pointer transition-colors">Safety</span>
        </div>
      </footer>
    </div>
  );
}
