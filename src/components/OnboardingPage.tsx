import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, GraduationCap, Check, UserPlus, MapPin, 
  Globe, Instagram, Linkedin, User, Camera, 
  ArrowRight, ArrowLeft, Image as ImageIcon
} from 'lucide-react';
import PakSpaceLogo from './Logo';
import UniversityDropdown from './UniversityDropdown';

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
  const [avatar, setAvatar] = useState<string>('');
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
    <div id="onboarding-container" className="min-h-screen bg-[var(--bg-app)] text-[var(--text-secondary)] flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans select-none">
      
      {/* Background ambient radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#1E3A8A]/[0.02] rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--brand-blue)]/[0.02] rounded-full filter blur-[100px] pointer-events-none" />

      {/* Progress Tracker Header */}
      <div className="w-full max-w-[560px] mb-10 flex flex-col items-center gap-6 z-10">
        <div className="flex items-center gap-2">
          <PakSpaceLogo size="sm" showText={false} />
          <span className="text-sm font-bold tracking-tight text-[var(--text-primary)] font-display">Customize Your Profile</span>
        </div>

        {/* Minimal stepper: small circles joined by thin lines */}
        <div className="flex items-center w-full max-w-[280px]">
          {[1, 2, 3].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    step >= s ? 'bg-[var(--brand-blue)]' : 'bg-[var(--border-strong)]'
                  }`}
                />
                <span className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${
                  step === s ? 'text-[var(--brand-blue)]' : 'text-gray-400'
                }`}>
                  {s === 1 ? 'Photo' : s === 2 ? 'Profile' : 'Personalize'}
                </span>
              </div>
              {i < 2 && (
                <div className={`flex-1 h-px mx-2 -mt-4 transition-colors duration-300 ${
                  step > s ? 'bg-[var(--brand-blue)]' : 'bg-[var(--border-color)]'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Container Form Card */}
      <div className="w-full max-w-[560px] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 md:p-10 shadow-2xl relative z-10 backdrop-blur-md">
        
        {/* STEP 1: UPLOAD PROFILE PHOTO */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-left"
          >
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-display">Add your profile photo</h2>
              <p className="text-sm text-gray-400">A real photo helps other students recognize and trust you.</p>
            </div>

            {/* Profile Photo Preview Circle */}
            <div className="flex flex-col items-center justify-center py-6 space-y-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`group relative w-32 h-32 rounded-full overflow-hidden shadow-sm flex items-center justify-center cursor-pointer transition-all ${
                  avatar
                    ? 'border-2 border-[var(--brand-blue)]'
                    : 'border-2 border-dashed border-[var(--border-strong)] hover:border-[var(--brand-blue)]/50 bg-[var(--bg-surface-2)]'
                }`}
              >
                {avatar ? (
                  <>
                    <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover animate-fade-in" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </>
                ) : (
                  <Camera className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                )}
              </div>

              {/* Single, simple upload action */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-6 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)] text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98]"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Choose Photo
              </button>
              <p className="text-[10px] text-gray-400">PNG, JPG, or WEBP up to 3MB</p>

              {/* Hidden file input — opens the native camera / gallery / file picker */}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden" 
              />
            </div>

            {/* Next Step Footer */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-40 py-3.5 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)] text-white font-semibold rounded-2xl transition-all shadow-sm hover:shadow-md text-xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
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
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-display">Complete profile details</h2>
              <p className="text-xs text-gray-400">Tell other students and creators who you are and where you study.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-blue)]">
                    Display Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aitzaz Ahmed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)] focus:outline-none focus:border-[var(--brand-blue)] text-xs placeholder:text-gray-650 text-[var(--text-primary)] focus:bg-[var(--bg-surface)] transition-all"
                    />
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-600" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-blue)]">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. aitzazahmed"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)] focus:outline-none focus:border-[var(--brand-blue)] text-xs placeholder:text-gray-650 text-[var(--text-primary)] focus:bg-[var(--bg-surface)] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-blue)]">
                    University / Organization Name
                  </label>
                  <UniversityDropdown 
                    value={affiliationName} 
                    onChange={setAffiliationName} 
                    placeholder="Search or select your university..." 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-blue)]">
                    Degree / Study Program
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BS Computer Science"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)] focus:outline-none focus:border-[var(--brand-blue)] text-xs placeholder:text-gray-655 text-[var(--text-primary)] focus:bg-[var(--bg-surface)] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-blue)]">
                  Location (City)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Islamabad, Lahore, Karachi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)] focus:outline-none focus:border-[var(--brand-blue)] text-xs placeholder:text-gray-655 text-[var(--text-primary)] focus:bg-[var(--bg-surface)] transition-all"
                  />
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-600" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-blue)]">
                  Short Bio
                </label>
                <textarea
                  placeholder="Describe your interests or study goals. E.g. Aspiring full-stack engineer and UI designer. Excited to connect with designers and developers across Pakistani universities."
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)] focus:outline-none focus:border-[var(--brand-blue)] text-xs placeholder:text-gray-655 text-[var(--text-primary)] focus:bg-[var(--bg-surface)] transition-all resize-none"
                />
              </div>
            </div>

            {/* Back & Next Step Footer */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 bg-transparent hover:bg-[var(--bg-app)] text-gray-400 font-semibold rounded-2xl text-xs cursor-pointer flex items-center gap-1 transition-all active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!name.trim() || !username.trim() || !affiliationName.trim() || !city.trim()}
                className="px-6 py-3 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-2xl text-xs cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
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
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-display">Choose interests to personalize feed</h2>
              <p className="text-xs text-gray-400">Personalize your feed by selecting topics of interest across Pakistan.</p>
            </div>

            <div className="space-y-5 text-left">
              {/* Grid of Interests */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-blue)]">
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
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          selected
                            ? 'bg-[var(--brand-blue)] border-[var(--brand-blue)] text-white shadow-md shadow-[var(--brand-blue)]/20'
                            : 'bg-[var(--bg-app)] border-[var(--border-color)] text-gray-400 hover:border-gray-500 hover:text-[var(--text-primary)]'
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
              <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-blue)]">
                  Social Links (Optional)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex items-center gap-2 px-3 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl">
                    <Globe className="w-4 h-4 text-gray-600 shrink-0" />
                    <input
                      type="url"
                      placeholder="Personal Website URL"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full py-2.5 bg-transparent focus:outline-none text-xs text-[var(--text-primary)] placeholder:text-gray-655"
                    />
                  </div>

                  <div className="flex items-center gap-2 px-3 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl">
                    <Instagram className="w-4 h-4 text-gray-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="Instagram username"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full py-2.5 bg-transparent focus:outline-none text-xs text-[var(--text-primary)] placeholder:text-gray-655"
                    />
                  </div>

                  <div className="flex items-center gap-2 px-3 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl col-span-1 sm:col-span-2">
                    <Linkedin className="w-4 h-4 text-gray-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="LinkedIn Profile URL"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full py-2.5 bg-transparent focus:outline-none text-xs text-[var(--text-primary)] placeholder:text-gray-655"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Back & Finish Footer */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 bg-transparent hover:bg-[var(--bg-app)] text-gray-400 font-semibold rounded-2xl text-xs cursor-pointer flex items-center gap-1 transition-all active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                id="finish-onboarding-btn"
                type="button"
                onClick={handleFinish}
                className="px-6 py-3 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)] text-white font-semibold rounded-2xl text-xs cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <UserPlus className="w-4 h-4 text-[var(--text-primary)]" />
                Complete Onboarding
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
