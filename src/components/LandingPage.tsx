import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import PakSpaceLogo from './Logo';
import { ArrowRight, Menu, X, Mail, Sparkles, BookOpen, Heart, Users, ShoppingBag } from 'lucide-react';

export default function LandingPage() {
  const { setView, setAuthMode } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleStart = (mode: 'signup' | 'signin') => {
    setAuthMode(mode);
    setView('auth');
    setIsMobileMenuOpen(false);
  };

  return (
    <div 
      id="landing-container" 
      className="min-h-screen bg-[#FAF7EE] text-[#1F2937] flex flex-col justify-between overflow-x-hidden relative selection:bg-[#3B82F6]/20 font-sans"
    >
      {/* Background decoration: Subtle soft radial gradients for a friendly, bright atmosphere */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#FACC15]/10 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#3B82F6]/5 filter blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center z-40">
        <div className="flex items-center">
          <PakSpaceLogo size="md" showText={true} horizontal={true} textClassName="text-[#1F2937] text-xl font-extrabold" />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setIsAboutOpen(true)}
            className="text-sm font-semibold text-[#6B7280] hover:text-[#3B82F6] transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => handleStart('signup')}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            Join Now
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#1F2937] hover:text-[#3B82F6] transition-colors cursor-pointer focus:outline-none z-50"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-[#FAF7EE] shadow-2xl z-50 p-8 flex flex-col justify-between md:hidden border-l border-[#E5E7EB]"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-6 border-b border-[#E5E7EB]">
                  <PakSpaceLogo size="sm" showText={true} horizontal={true} textClassName="text-[#1F2937] font-bold" />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:text-red-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-6 text-left">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAboutOpen(true);
                    }}
                    className="text-base font-bold text-[#1F2937] hover:text-[#3B82F6] transition-colors flex items-center gap-3 py-2 text-left"
                  >
                    <BookOpen className="w-5 h-5 text-[#3B82F6]" />
                    About PakSpace
                  </button>
                  <button
                    onClick={() => handleStart('signup')}
                    className="text-base font-bold text-[#1F2937] hover:text-[#3B82F6] transition-colors flex items-center gap-3 py-2 text-left"
                  >
                    <Users className="w-5 h-5 text-[#FACC15]" />
                    Join Community
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#E5E7EB]">
                <button
                  onClick={() => handleStart('signin')}
                  className="w-full py-3.5 bg-white border border-[#E5E7EB] text-[#1F2937] font-bold rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleStart('signup')}
                  className="w-full py-3.5 bg-[#3B82F6] text-white font-bold rounded-2xl hover:bg-[#2563EB] transition-colors cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  Join Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Editorial Hero */}
      <main className="relative flex-grow flex flex-col justify-center items-center w-full max-w-4xl mx-auto px-6 py-16 md:py-32 z-10 text-center space-y-8">
        <div className="space-y-8 flex flex-col items-center">
          
          {/* Premium Typography Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 max-w-3xl"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#1F2937] leading-[1.05]">
              Where Pakistani Students <span className="text-[#3B82F6] relative inline-block">Connect<span className="absolute left-0 right-0 bottom-1 h-2 bg-[#FACC15]/20 -z-10 rounded-full"></span></span> & Collaborate.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#6B7280] font-medium tracking-tight max-w-2xl mx-auto leading-relaxed">
              A premium, minimalist social space built to discover opportunities, share ideas, ask questions anonymously, and engage with campus communities across Pakistan.
            </p>
          </motion.div>

          {/* Primary Action Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center pt-4 w-full"
          >
            <button
              onClick={() => handleStart('signup')}
              className="px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm cursor-pointer flex items-center justify-center gap-2 group"
            >
              Join Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full max-w-6xl mx-auto px-6 py-12 border-t border-[#E5E7EB] flex flex-col items-center justify-center gap-4 z-10 text-xs text-[#6B7280]">
        <div className="flex items-center gap-2 font-semibold">
          <Mail className="w-4 h-4 text-[#3B82F6]" />
          <span>Contact Email:</span>
          <a href="mailto:akroonjhawang@gmail.com" className="hover:text-[#3B82F6] transition-colors font-bold underline decoration-blue-500/30 decoration-2">
            akroonjhawang@gmail.com
          </a>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">
          © 2026 PakSpace Platform. Built with love for Pakistani students 🇵🇰
        </p>
      </footer>

      {/* About Modal Dialog */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="fixed inset-0 bg-[#1F2937]/80 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-left space-y-6"
            >
              <button
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="flex items-center gap-3">
                <PakSpaceLogo size="sm" showText={false} />
                <h2 className="text-2xl font-black text-[#1F2937] tracking-tight">About PakSpace</h2>
              </div>

              <div className="text-sm text-[#6B7280] leading-relaxed space-y-4">
                <p>
                  PakSpace is a student-powered social platform built for university students across Pakistan. It is a place where students can connect with their campus communities, share knowledge, ask questions anonymously, discover opportunities, and help one another throughout their academic journey.
                </p>
                <p>
                  Whether you're looking for academic discussions, student communities, marketplace listings, or meaningful conversations, PakSpace brings everything together in one trusted platform.
                </p>
                <p>
                  Our mission is to make university life more connected, collaborative, and accessible for every student in Pakistan.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase">Built By</span>
                  <p className="text-xs font-bold text-[#1F2937]">Aitzaz Roonjha</p>
                </div>
                <button
                  onClick={() => setIsAboutOpen(false)}
                  className="px-5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
