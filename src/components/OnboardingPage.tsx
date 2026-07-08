import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, GraduationCap, Check, UserPlus, MapPin, 
  Globe, Instagram, Linkedin, User, Camera, Upload, 
  ArrowRight, ArrowLeft, Image as ImageIcon, Video, VideoOff
} from 'lucide-react';
import PakSpaceLogo from './Logo';

const INTERESTS_LIST = [
  'Software Engineering',
  'Chai & Conversations',
  'Admissions & Scholarships',
  'CSS Preparation',
  'UI/UX Design',
  'Startup & Venturing',
  'Freelance & Gigs',
  'HEC Guidelines',
  'Data Science & AI',
  'Digital Marketing'
];

export default function OnboardingPage() {
  const { currentUser, finishOnboarding, triggerToast } = useApp();

  const [step, setStep] = useState(1);
  
  // Step 1 states: Profile Photo
  const [avatar, setAvatar] = useState<string>('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Step 2 states: Complete Profile
  const [name, setName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [affiliationName, setAffiliationName] = useState('');
  const [degree, setDegree] = useState('');

  // Step 3 states: Choose Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Stop camera tracks helper
  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    setMediaStream(null);
    setCameraActive(false);
  };

  // Start camera helper
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 300, height: 300, facingMode: 'user' }
      });
      setMediaStream(stream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      triggerToast('Could not access camera. Please allow permission or upload from gallery.');
    }
  };

  // Trigger camera ref assignment
  useEffect(() => {
    if (cameraActive && videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [cameraActive, mediaStream]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  // Capture photo onto Canvas
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 300, 300);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setAvatar(dataUrl);
        triggerToast('Profile photo captured! 📸');
        stopCamera();
      }
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 3MB for base64 storage)
    if (file.size > 3 * 1024 * 1024) {
      triggerToast('Please choose an image under 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
        triggerToast('Profile photo loaded successfully! 📁');
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      stopCamera();
      setStep(2);
    } else if (step === 2) {
      if (!name.trim()) {
        triggerToast('Display name is required.');
        return;
      }
      if (!username.trim() || username.length < 3) {
        triggerToast('Username must be at least 3 characters.');
        return;
      }
      if (!affiliationName.trim()) {
        triggerToast('University or organization details are required.');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    stopCamera();
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleFinish = () => {
    if (!name.trim() || !username.trim()) {
      triggerToast('Please complete your profile details!');
      return;
    }
    
    finishOnboarding({
      avatarUrl: avatar,
      name,
      username,
      bio: bio || `Passionate student on PakSpace. Let's connect! 🇵🇰`,
      universityStatus: 'Student', 
      universityName: affiliationName || 'PakSpace Community',
      degree: degree || 'General',
      city: city || 'Pakistan',
      interests: selectedInterests,
      website: website || undefined,
      instagram: instagram || undefined,
      linkedIn: linkedin || undefined,
    });
    
    triggerToast('Profile customized! Welcome to PakSpace! 🎉');
  };

  return (
    <div id="onboarding-container" className="min-h-screen bg-[#080E21] text-[#E5E5E0] flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans select-none">
      
      {/* Background ambient radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#1E3A8A]/[0.02] rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#047857]/[0.02] rounded-full filter blur-[100px] pointer-events-none" />

      {/* Progress Tracker Header */}
      <div className="w-full max-w-xl mb-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <PakSpaceLogo size="sm" showText={false} />
          <span className="text-sm font-bold tracking-tight text-white font-display">Customize Your Profile</span>
        </div>
        
        {/* Horizontal steps marker */}
        <div className="flex items-center gap-2 bg-[#111827] border border-[#1E293B] px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">
          <span className={step === 1 ? 'text-[#047857] font-bold' : ''}>1. Photo</span>
          <span>•</span>
          <span className={step === 2 ? 'text-[#047857] font-bold' : ''}>2. Profile</span>
          <span>•</span>
          <span className={step === 3 ? 'text-[#047857] font-bold' : ''}>3. Personalize</span>
        </div>
      </div>

      {/* Main Container Form Card */}
      <div className="w-full max-w-xl bg-[#111827] border border-[#1E293B] rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-md">
        
        {/* STEP 1: UPLOAD PROFILE PHOTO */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-left"
          >
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">Upload Profile Photo</h2>
              <p className="text-xs text-gray-400">Capture a live picture from your device camera or choose a photo from your gallery.</p>
            </div>

            {/* Profile Photo Preview Circle */}
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#047857] bg-black/40 shadow-xl flex items-center justify-center">
                {cameraActive ? (
                  <video 
                    ref={videoRef} 
                    id="webcam-video"
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )}
                
                {cameraActive && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#047857] text-white text-[8px] font-mono font-bold rounded-full uppercase animate-pulse select-none">
                    Live
                  </div>
                )}
              </div>

              {/* Upload & Camera Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm pt-2 font-mono">
                {cameraActive ? (
                  <>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="w-full py-2.5 px-4 bg-[#047857] hover:bg-[#059669] border border-[#1E293B] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="w-full py-2.5 px-4 bg-[#080E21] hover:bg-[#111827] text-gray-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-[#1E293B]"
                    >
                      <VideoOff className="w-4 h-4" />
                      Cancel Camera
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full py-2.5 px-4 bg-[#047857] hover:bg-[#059669] border border-[#1E293B] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      Use Device Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 bg-[#080E21] hover:bg-[#111827] text-gray-200 border border-[#1E293B] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Upload className="w-4 h-4 text-[#047857]" />
                      Upload From Gallery
                    </button>
                  </>
                )}
              </div>

              {/* Hidden file input */}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden" 
              />
            </div>

            {/* Drag & Drop Hint */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-[#1E293B] rounded-2xl p-6 text-center hover:bg-[#080E21] hover:border-[#047857]/50 cursor-pointer transition-all select-none font-mono"
            >
              <ImageIcon className="w-6 h-6 text-gray-500 mx-auto mb-2" />
              <p className="text-[11px] text-gray-400">Drag and drop profile images here, or <span className="text-[#047857] hover:underline">browse files</span></p>
              <p className="text-[9px] text-gray-600 mt-1">PNG, JPG, or WEBP up to 3MB</p>
            </div>

            {/* Next Step Footer */}
            <div className="pt-4 flex justify-end font-mono">
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-40 py-3.5 bg-[#047857] hover:bg-[#059669] border border-[#1E293B] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#047857]/10 text-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                Continue Setup
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: COMPLETE PROFILE */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-left"
          >
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">Complete profile details</h2>
              <p className="text-xs text-gray-400 font-mono">Tell other students and creators who you are and where you study.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#047857] font-mono">
                    Display Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aitzaz Ahmed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-[#1E293B] rounded-xl bg-[#080E21] focus:outline-none focus:border-[#047857] text-xs placeholder:text-gray-650 text-white focus:bg-[#111827] transition-all"
                    />
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-600" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#047857] font-mono">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. aitzazahmed"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full px-4 py-3 border border-[#1E293B] rounded-xl bg-[#080E21] focus:outline-none focus:border-[#047857] text-xs placeholder:text-gray-650 text-white focus:bg-[#111827] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#047857] font-mono">
                    University / Organization Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. NUST, Islamabad or Fast-NUCES"
                      value={affiliationName}
                      onChange={(e) => setAffiliationName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-[#1E293B] rounded-xl bg-[#080E21] focus:outline-none focus:border-[#047857] text-xs placeholder:text-gray-655 text-white focus:bg-[#111827] transition-all"
                    />
                    <GraduationCap className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-600" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#047857] font-mono">
                    Degree / Study Program
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BS Computer Science"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-4 py-3 border border-[#1E293B] rounded-xl bg-[#080E21] focus:outline-none focus:border-[#047857] text-xs placeholder:text-gray-655 text-white focus:bg-[#111827] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#047857] font-mono">
                  Location (City)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Islamabad, Lahore, Karachi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#1E293B] rounded-xl bg-[#080E21] focus:outline-none focus:border-[#047857] text-xs placeholder:text-gray-655 text-white focus:bg-[#111827] transition-all"
                  />
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-600" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#047857] font-mono">
                  Short Bio
                </label>
                <textarea
                  placeholder="Describe your interests or study goals. E.g. Aspiring full-stack engineer and UI designer. Excited to connect with designers and developers across Pakistani universities."
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 border border-[#1E293B] rounded-xl bg-[#080E21] focus:outline-none focus:border-[#047857] text-xs placeholder:text-gray-655 text-white focus:bg-[#111827] transition-all resize-none"
                />
              </div>
            </div>

            {/* Back & Next Step Footer */}
            <div className="pt-4 flex items-center justify-between gap-4 font-mono">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 bg-[#080E21] hover:bg-[#111827] text-gray-300 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1 border border-[#1E293B] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!name.trim() || !username.trim() || !affiliationName.trim() || !city.trim()}
                className="px-6 py-3 bg-[#047857] hover:bg-[#059669] border border-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#047857]/10 transition-colors"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: CHOOSE INTERESTS TO PERSONALIZE FEED */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-left"
          >
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">Choose interests to personalize feed</h2>
              <p className="text-xs text-gray-400 font-mono">Personalize your feed by selecting topics of interest across Pakistan.</p>
            </div>

            <div className="space-y-5 text-left">
              {/* Grid of Interests */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#047857] font-mono">
                  Select Topics
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {INTERESTS_LIST.map((interest) => {
                    const selected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          selected
                            ? 'bg-[#047857] border-[#047857] text-white shadow-md shadow-[#047857]/20'
                            : 'bg-[#080E21] border-[#1E293B] text-gray-400 hover:border-gray-500 hover:text-white'
                        }`}
                      >
                        {interest}
                        {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Coordinates */}
              <div className="space-y-3 pt-4 border-t border-[#1E293B]">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#047857] font-mono">
                  Social Links (Optional)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono">
                  <div className="flex items-center gap-2 px-3 bg-[#080E21] border border-[#1E293B] rounded-xl">
                    <Globe className="w-4 h-4 text-gray-600 shrink-0" />
                    <input
                      type="url"
                      placeholder="Personal Website URL"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full py-2.5 bg-transparent focus:outline-none text-xs text-white placeholder:text-gray-655"
                    />
                  </div>

                  <div className="flex items-center gap-2 px-3 bg-[#080E21] border border-[#1E293B] rounded-xl">
                    <Instagram className="w-4 h-4 text-gray-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="Instagram username"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full py-2.5 bg-transparent focus:outline-none text-xs text-white placeholder:text-gray-655"
                    />
                  </div>

                  <div className="flex items-center gap-2 px-3 bg-[#080E21] border border-[#1E293B] rounded-xl col-span-1 sm:col-span-2">
                    <Linkedin className="w-4 h-4 text-gray-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="LinkedIn Profile URL"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full py-2.5 bg-transparent focus:outline-none text-xs text-white placeholder:text-gray-655"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Back & Finish Footer */}
            <div className="pt-4 flex items-center justify-between gap-4 font-mono">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 bg-[#080E21] hover:bg-[#111827] text-gray-300 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1 border border-[#1E293B] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                id="finish-onboarding-btn"
                type="button"
                onClick={handleFinish}
                className="px-6 py-3 bg-[#047857] hover:bg-[#059669] border border-[#1E293B] text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#047857]/10 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-white" />
                Complete Onboarding
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
