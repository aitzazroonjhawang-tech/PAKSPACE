import { useState, FormEvent, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, AlertCircle, Mail, Lock, User, AtSign } from 'lucide-react';
import PakSpaceLogo from './Logo';

export default function AuthPage() {
  const { setView, authMode, setAuthMode, signUp, signIn, triggerToast } = useApp();
  
  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize Google Identity Services (GSI)
  useEffect(() => {
    const scriptId = 'google-gsi-client-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    script.onload = () => {
      initializeGSI();
    };

    const google = (window as any).google;
    if (google?.accounts?.id) {
      initializeGSI();
    }
  }, [authMode]);

  const initializeGSI = () => {
    const google = (window as any).google;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!google?.accounts?.id || !clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
      return;
    }

    try {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      const btnDiv = document.getElementById('google-gsi-button-container');
      if (btnDiv) {
        google.accounts.id.renderButton(btnDiv, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          width: btnDiv.clientWidth || 380,
        });
      }
    } catch (err) {
      console.error('Error rendering Google Sign-In button:', err);
    }
  };

  const handleCredentialResponse = (response: any) => {
    try {
      setError('');
      setLoading(true);
      triggerToast('Google authentication successful! 🔒');

      // Decode Base64 JWT token
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      const googleEmail = payload.email;
      const googleName = payload.name;
      const googleUsername = googleEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');

      // Sign up or log in the user via AppContext
      try {
        signIn(googleEmail);
      } catch (e) {
        signUp(googleName, googleUsername, googleEmail);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to parse Google login JWT:', err);
      setError(err.message || 'Google authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Quick validations
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }

      if (authMode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your display name.');
          setLoading(false);
          return;
        }
        if (!username.trim() || username.length < 3) {
          setError('Username must be at least 3 alphanumeric characters.');
          setLoading(false);
          return;
        }

        // Academic Domain Validation Check
        const lowerEmail = email.toLowerCase().trim();
        const isAcademic = lowerEmail.endsWith('.edu') || lowerEmail.endsWith('.edu.pk');
        if (!isAcademic) {
          setError('Academic Verification: Manual email registrations are restricted exclusively to valid institutional addresses containing a .edu or .edu.pk domain suffix. If you only have a standard public email (like @gmail.com), please connect securely via the Google Sign-In button above.');
          setLoading(false);
          return;
        }

        try {
          signUp(name, username, email, password);
          triggerToast('Account created successfully! 🚀');
        } catch (err: any) {
          setError(err.message || 'An error occurred during sign up.');
        }
      } else {
        try {
          signIn(email, password);
          triggerToast('Welcome back! 🔑');
        } catch (err: any) {
          setError(err.message || 'An error occurred during sign in.');
        }
      }
      setLoading(false);
    }, 800);
  };

  const handleGoogleSignIn = () => {
    setError('');
    const google = (window as any).google;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (google?.accounts?.id && clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID') {
      setLoading(true);
      triggerToast('Connecting securely with Google... 🚀');
      try {
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            triggerToast('One-tap sign-in skipped. Please use the Google button.');
            setLoading(false);
          }
        });
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    } else {
      // Graceful fallback for preview testing
      setLoading(true);
      triggerToast('Connecting securely with Google (Developer Mode)... 🚀');
      
      setTimeout(() => {
        const simulatedEmail = 'aitzazroonjhawang@gmail.com';
        const simulatedName = 'Aitzaz Ahmed';
        const simulatedUsername = 'aitzazahmed';
        
        triggerToast('Google authentication successful! 🔒');
        try {
          try {
            signIn(simulatedEmail);
          } catch (e) {
            signUp(simulatedName, simulatedUsername, simulatedEmail);
          }
        } catch (err: any) {
          setError(err.message || 'Developer Google Sign-In failed.');
        }
        setLoading(false);
      }, 1200);
    }
  };

  const toggleMode = () => {
    setError('');
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div id="auth-container" className="min-h-screen bg-[#FACC15] text-[#1F2937] flex flex-col justify-center items-center p-6 relative select-none overflow-hidden font-sans">
      
      {/* Background grid details */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(31,41,55,0.015)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(31,41,55,0.015)_1.5px,transparent_1.5px)] bg-[size:30px_30px] opacity-100 pointer-events-none" />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          id="back-to-landing-btn"
          onClick={() => setView('landing')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-[#E5E7EB] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all text-[#6B7280] cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Landing
        </button>
      </div>

      {/* Main Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-3xl p-8 relative z-10 shadow-xl"
      >
        {/* Brand logo at head of card */}
        <div className="flex flex-col items-center mb-6">
          <PakSpaceLogo size="md" showText={true} textClassName="text-2xl mt-2 font-bold tracking-tight text-[#1F2937]" />
          <h2 className="text-xl font-bold text-[#1F2937] mt-4 tracking-tight">
            {authMode === 'signup' ? 'Create your platform account' : 'Welcome back to PakSpace'}
          </h2>
          <p className="text-xs text-[#6B7280] mt-1.5 font-medium">
            {authMode === 'signup' ? 'Sign up to design and join community spaces' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {/* Real GSI standard button container */}
        <div id="google-gsi-button-container" className="flex justify-center mb-4 min-h-[40px]" />

        {/* Continue with Google Button */}
        <button
          id="google-auth-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-4 bg-[#FAF7EE] hover:bg-[#F7F4EB] disabled:opacity-50 border border-[#E5E7EB] hover:border-[#3B82F6] hover:text-[#3B82F6] text-[#1F2937] font-semibold rounded-2xl transition-all text-xs flex items-center justify-center gap-2.5 cursor-pointer transform active:scale-98"
        >
          {/* Google Colorized Icon G representation */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow border-t border-[#E5E7EB]" />
          <span className="px-3 text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold">Or use email</span>
          <div className="flex-grow border-t border-[#E5E7EB]" />
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3.5 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-2xl text-xs flex items-start gap-2.5 animate-fade-in text-left">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4.5 text-left">
          {authMode === 'signup' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#3B82F6] ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="signup-name-input"
                    type="text"
                    required
                    placeholder="e.g. Aitzaz Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-2xl bg-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-sm transition-all placeholder:text-[#9CA3AF] text-[#1F2937]"
                  />
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#9CA3AF]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#3B82F6] ml-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="signup-username-input"
                    type="text"
                    required
                    placeholder="e.g. aitzazahmed"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-2xl bg-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-sm transition-all placeholder:text-[#9CA3AF] text-[#1F2937]"
                  />
                  <AtSign className="absolute left-3.5 top-3.5 w-4 h-4 text-[#9CA3AF]" />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#3B82F6] ml-1">
              Email Address
            </label>
            <div className="relative">
              <input
                id="auth-email-input"
                type="email"
                required
                placeholder="e.g. student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-2xl bg-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-sm transition-all placeholder:text-[#9CA3AF] text-[#1F2937]"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#9CA3AF]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#3B82F6] ml-1">
              Password
            </label>
            <div className="relative">
              <input
                id="auth-password-input"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-2xl bg-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-sm transition-all placeholder:text-[#9CA3AF] text-[#1F2937]"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#9CA3AF]" />
            </div>
          </div>

          {/* Action button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/10 transition-all text-sm transform active:scale-98 mt-4 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              authMode === 'signup' ? 'Continue with Email' : 'Sign In with Email'
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 pt-5 border-t border-[#E5E7EB] text-center">
          <p className="text-xs text-[#6B7280] font-medium">
            {authMode === 'signup' ? 'Already have an account?' : 'New to PakSpace?'}
            <button
              id="auth-toggle-mode-btn"
              onClick={toggleMode}
              className="ml-1 text-[#3B82F6] font-bold hover:underline bg-transparent border-none cursor-pointer"
            >
              {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
