/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Search, Compass, Users, Bell, User as UserIcon, Plus, Upload, Menu,
  Heart, MessageSquare, Bookmark, Share2, Globe, Instagram, Linkedin,
  LogOut, Moon, Sun, ArrowLeft, Check, Compass as CompassIcon, 
  MapPin, GraduationCap, X, Calendar, ArrowRight, ExternalLink, Key, Sparkles,
  ShoppingBag, Lock, Unlock, EyeOff, UserCheck, Settings, GripVertical, RefreshCw,
  CircleHelp, Info
} from 'lucide-react';
import { Post, Space, User, Scholarship, University, Comment } from '../types';
import PakSpaceLogo from './Logo';
import { MarketplaceView } from './MarketplaceView';
import UniversityDropdown from './UniversityDropdown';
import { RichTextEditor } from './RichTextEditor';
import { ImageCarousel } from './ImageCarousel';
import { CreatePostComposer } from './CreatePostComposer';

export default function MainApp() {
  const {
    currentUser,
    posts,
    spaces,
    notifications,
    appTab,
    activeSpaceId,
    activeUserId,
    activePostId,
    darkMode,
    toastMessage,
    triggerToast,
    
    setAppTab,
    setActiveSpaceId,
    setActiveUserId,
    setActivePostId,
    setDarkMode,
    signOut,
    updateProfile,
    addPost,
    createSpace,
    markAllNotificationsAsRead
  } = useApp();

  // Dialog and popup states
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsHeaderScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  // Create post states
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'text' | 'photo' | 'link' | 'question'>('text');
  const [newPostImageUrl, setNewPostImageUrl] = useState('');
  const [newPostLinkUrl, setNewPostLinkUrl] = useState('');
  const [newPostLinkTitle, setNewPostLinkTitle] = useState('');
  const [newPostSpaceId, setNewPostSpaceId] = useState('');
  const [postAnonymously, setPostAnonymously] = useState(false);
  const [newPostImageUrls, setNewPostImageUrls] = useState<string[]>([]);
  const [newPostAspectRatio, setNewPostAspectRatio] = useState<'1:1' | '4:5' | '16:9' | 'original'>('4:5');
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadProgressMap, setUploadProgressMap] = useState<Record<string, number>>({});
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleAddPhotos = (files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader();
      const fileId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      setUploadProgressMap(prev => ({ ...prev, [fileId]: 10 }));
      
      reader.onloadend = () => {
        const resultUrl = reader.result as string;
        let currentProgress = 10;
        const interval = setInterval(() => {
          currentProgress += Math.floor(Math.random() * 25) + 15;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            setNewPostImageUrls(prev => [...prev, resultUrl]);
            setTimeout(() => {
              setUploadProgressMap(prev => {
                const updated = { ...prev };
                delete updated[fileId];
                return updated;
              });
            }, 300);
          }
          setUploadProgressMap(prev => ({ ...prev, [fileId]: currentProgress }));
        }, 120);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleReplacePhoto = (idx: number, file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      const fileId = `img-replace-${Date.now()}`;
      setUploadProgressMap(prev => ({ ...prev, [fileId]: 20 }));
      reader.onloadend = () => {
        let currentProgress = 20;
        const interval = setInterval(() => {
          currentProgress += Math.floor(Math.random() * 30) + 15;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            setNewPostImageUrls(prev => {
              const updated = [...prev];
              updated[idx] = reader.result as string;
              return updated;
            });
            setTimeout(() => {
              setUploadProgressMap(prev => {
                const updated = { ...prev };
                delete updated[fileId];
                return updated;
              });
            }, 300);
          }
          setUploadProgressMap(prev => ({ ...prev, [fileId]: currentProgress }));
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  };

  // Restore drafts on mount
  useEffect(() => {
    try {
      const draftTitle = localStorage.getItem('pakspace_draft_title');
      const draftContent = localStorage.getItem('pakspace_draft_content');
      const draftType = localStorage.getItem('pakspace_draft_type');
      const draftImageUrls = localStorage.getItem('pakspace_draft_imageUrls');
      const draftAspectRatio = localStorage.getItem('pakspace_draft_aspectRatio');
      const draftLinkUrl = localStorage.getItem('pakspace_draft_linkUrl');
      const draftLinkTitle = localStorage.getItem('pakspace_draft_linkTitle');
      const draftSpaceId = localStorage.getItem('pakspace_draft_spaceId');
      const draftAnon = localStorage.getItem('pakspace_draft_anon');

      if (draftTitle) setNewPostTitle(draftTitle);
      if (draftContent) setNewPostContent(draftContent);
      if (draftType) setNewPostType(draftType as any);
      if (draftImageUrls) setNewPostImageUrls(JSON.parse(draftImageUrls));
      if (draftAspectRatio) setNewPostAspectRatio(draftAspectRatio as any);
      if (draftLinkUrl) setNewPostLinkUrl(draftLinkUrl);
      if (draftLinkTitle) setNewPostLinkTitle(draftLinkTitle);
      if (draftSpaceId) setNewPostSpaceId(draftSpaceId);
      if (draftAnon) setPostAnonymously(draftAnon === 'true');
    } catch (e) {
      console.error('Error loading draft', e);
    }
  }, []);

  // Save drafts as user types
  useEffect(() => {
    localStorage.setItem('pakspace_draft_title', newPostTitle);
    localStorage.setItem('pakspace_draft_content', newPostContent);
    localStorage.setItem('pakspace_draft_type', newPostType);
    localStorage.setItem('pakspace_draft_imageUrls', JSON.stringify(newPostImageUrls));
    localStorage.setItem('pakspace_draft_aspectRatio', newPostAspectRatio);
    localStorage.setItem('pakspace_draft_linkUrl', newPostLinkUrl);
    localStorage.setItem('pakspace_draft_linkTitle', newPostLinkTitle);
    localStorage.setItem('pakspace_draft_spaceId', newPostSpaceId);
    localStorage.setItem('pakspace_draft_anon', String(postAnonymously));
  }, [newPostTitle, newPostContent, newPostType, newPostImageUrls, newPostAspectRatio, newPostLinkUrl, newPostLinkTitle, newPostSpaceId, postAnonymously]);

  // Handle Ctrl+V paste event for images
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setNewPostImageUrls(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  // Create space states
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [newSpaceBanner, setNewSpaceBanner] = useState('');
  const [newSpaceLogo, setNewSpaceLogo] = useState('');
  const [newSpaceCategory, setNewSpaceCategory] = useState('General Discussions');
  const [newSpacePrivacy, setNewSpacePrivacy] = useState<'public' | 'private'>('public');

  // Edit profile states
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editStatus, setEditStatus] = useState(currentUser?.universityStatus || 'Current Student');
  const [editUniversityName, setEditUniversityName] = useState(currentUser?.universityName || '');
  const [editDegree, setEditDegree] = useState(currentUser?.degree || '');
  const [editCity, setEditCity] = useState(currentUser?.city || '');
  const [editWebsite, setEditWebsite] = useState(currentUser?.website || '');
  const [editInstagram, setEditInstagram] = useState(currentUser?.instagram || '');
  const [editLinkedin, setEditLinkedin] = useState(currentUser?.linkedIn || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [editCoverUrl, setEditCoverUrl] = useState(currentUser?.coverUrl || '');
  const [editGraduationYear, setEditGraduationYear] = useState(currentUser?.graduationYear || '');

  // Sync edits on currentUser change
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditBio(currentUser.bio);
      setEditStatus(currentUser.universityStatus || 'Current Student');
      setEditUniversityName(currentUser.universityName);
      setEditDegree(currentUser.degree);
      setEditCity(currentUser.city);
      setEditWebsite(currentUser.website || '');
      setEditInstagram(currentUser.instagram || '');
      setEditLinkedin(currentUser.linkedIn || '');
      setEditAvatarUrl(currentUser.avatarUrl);
      setEditCoverUrl(currentUser.coverUrl || '');
      setEditGraduationYear(currentUser.graduationYear || '');
    }
  }, [currentUser]);

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'c':
          e.preventDefault();
          setIsCreatePostOpen(true);
          break;
        case 'h':
          e.preventDefault();
          setAppTab('home');
          setActiveSpaceId(null);
          setActiveUserId(null);
          setActivePostId(null);
          break;
        case 'e':
          e.preventDefault();
          setAppTab('explore');
          setActiveSpaceId(null);
          setActiveUserId(null);
          setActivePostId(null);
          break;
        case 's':
          e.preventDefault();
          setAppTab('spaces');
          setActiveSpaceId(null);
          setActiveUserId(null);
          setActivePostId(null);
          break;
        case 'n':
          e.preventDefault();
          setAppTab('notifications');
          setActiveSpaceId(null);
          setActiveUserId(null);
          setActivePostId(null);
          break;
        case 'p':
          e.preventDefault();
          setAppTab('profile');
          setActiveSpaceId(null);
          setActiveUserId(null);
          setActivePostId(null);
          break;
        case 'escape':
          e.preventDefault();
          setIsCreatePostOpen(false);
          setIsCreateSpaceOpen(false);
          setIsEditProfileOpen(false);
          setIsShortcutsOpen(false);
          setActivePostId(null);
          break;
        case '?':
          e.preventDefault();
          setIsShortcutsOpen(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setAppTab, setActiveSpaceId, setActiveUserId, setActivePostId]);

  if (!currentUser) return null;

  // Handle post submit
  const handlePostSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && newPostImageUrls.length === 0 && !newPostLinkUrl.trim()) return;

    setIsPublishing(true);

    // The composer is a single unified writing surface now — the post type
    // is derived automatically from whether images were attached.
    const effectiveType: 'text' | 'photo' | 'link' | 'question' = newPostImageUrls.length > 0 ? 'photo' : newPostType;

    // Simulated premium publishing lag
    setTimeout(() => {
      addPost(newPostContent, effectiveType, {
        title: newPostTitle || undefined,
        imageUrl: effectiveType === 'photo' ? (newPostImageUrls[0] || undefined) : undefined,
        imageUrls: effectiveType === 'photo' ? newPostImageUrls : undefined,
        aspectRatio: effectiveType === 'photo' ? newPostAspectRatio : undefined,
        linkUrl: newPostType === 'link' ? newPostLinkUrl : undefined,
        linkTitle: newPostType === 'link' ? newPostLinkTitle : undefined,
        spaceId: newPostSpaceId || activeSpaceId || undefined,
        isAnonymous: postAnonymously
      });

      setNewPostTitle('');
      setNewPostContent('');
      setNewPostType('text');
      setNewPostImageUrl('');
      setNewPostImageUrls([]);
      setNewPostAspectRatio('4:5');
      setNewPostLinkUrl('');
      setNewPostLinkTitle('');
      setNewPostSpaceId('');
      setPostAnonymously(false);
      setIsPublishing(false);
      setIsCreatePostOpen(false);

      // Clear draft storage
      localStorage.removeItem('pakspace_draft_title');
      localStorage.removeItem('pakspace_draft_content');
      localStorage.removeItem('pakspace_draft_type');
      localStorage.removeItem('pakspace_draft_imageUrls');
      localStorage.removeItem('pakspace_draft_aspectRatio');
      localStorage.removeItem('pakspace_draft_linkUrl');
      localStorage.removeItem('pakspace_draft_linkTitle');
      localStorage.removeItem('pakspace_draft_spaceId');
      localStorage.removeItem('pakspace_draft_anon');

      triggerToast(postAnonymously ? 'Published anonymously! 🔒' : 'Post shared with PakSpace! ✨');
    }, 1200);
  };

  // Handle space submit
  const handleSpaceSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim() || !newSpaceDescription.trim()) return;

    createSpace(
      newSpaceName, 
      newSpaceDescription, 
      newSpaceBanner || undefined,
      newSpaceLogo || undefined,
      newSpaceCategory,
      newSpacePrivacy
    );
    setNewSpaceName('');
    setNewSpaceDescription('');
    setNewSpaceBanner('');
    setNewSpaceLogo('');
    setNewSpaceCategory('General Discussions');
    setNewSpacePrivacy('public');
    setIsCreateSpaceOpen(false);
    triggerToast(`"${newSpaceName}" Space Created! 🇵🇰`);
  };

  // Handle profile update submit
  const handleProfileUpdate = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      bio: editBio,
      universityStatus: editStatus as any,
      universityName: editUniversityName,
      degree: editDegree,
      city: editCity,
      avatarUrl: editAvatarUrl,
      coverUrl: editCoverUrl,
      website: editWebsite || undefined,
      instagram: editInstagram || undefined,
      linkedIn: editLinkedin || undefined,
      graduationYear: editGraduationYear || undefined
    });
    setIsEditProfileOpen(false);
    triggerToast('Profile updated successfully!');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'spaces', label: 'Spaces', icon: Users },
    { id: 'market', label: 'Marketplace', icon: ShoppingBag },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read && n.recipientId === currentUser.id).length },
    { id: 'profile', label: 'Profile', icon: UserIcon }
  ];

  return (
    <div id="app-root-container" className="min-h-screen bg-[var(--bg-app)] text-[var(--text-secondary)] transition-colors duration-300 pb-24 md:pb-0 flex selection:bg-[var(--brand-blue)]/30 selection:text-blue-200 font-sans">
      
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex flex-col justify-between w-64 border-r border-[var(--border-color)] bg-[var(--bg-app)] p-6 h-screen sticky top-0 shrink-0 z-40 select-none backdrop-blur-md">
        <div className="space-y-8">
          <div 
            onClick={() => {
              setAppTab('home');
              setActiveSpaceId(null);
              setActiveUserId(null);
              setActivePostId(null);
            }}
            className="flex items-center px-3 cursor-pointer"
          >
            <PakSpaceLogo showText={true} horizontal={true} size="sm" />
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = appTab === item.id && !activeSpaceId && !activeUserId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAppTab(item.id as any);
                    setActiveSpaceId(null);
                    setActiveUserId(null);
                    setActivePostId(null);
                    if (item.id === 'notifications') {
                      markAllNotificationsAsRead();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? 'bg-[var(--brand-blue)]/15 text-blue-450 border-l-2 border-[var(--brand-blue)]' 
                      : 'text-gray-400 hover:bg-white/[0.03] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-450' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="bg-[var(--brand-blue)] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-md">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <button
            id="desktop-create-post-btn"
            onClick={() => setIsCreatePostOpen(true)}
            className="w-full py-3.5 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)] border border-[var(--border-color)] text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
          >
            <Plus className="w-4.5 h-4.5" />
            Create Post
          </button>
        </div>

        <div className="border-t border-[#E5E7EB] dark:border-gray-800 pt-6 space-y-4">
          <div className="flex items-center justify-between px-3">
            <div 
              onClick={() => {
                setActiveUserId(currentUser.id);
                setAppTab('profile');
              }}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-880"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-none group-hover:underline">{currentUser.name}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">@{currentUser.username}</p>
              </div>
            </div>

            <button
              id="sidebar-settings-btn"
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-[var(--brand-blue)] transition-all cursor-pointer"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="flex items-center justify-between px-3 text-xs">
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="text-gray-400 hover:text-blue-400 flex items-center gap-1 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              Shortcuts ( ? )
            </button>

            <button
              id="signout-sidebar-btn"
              onClick={signOut}
              className="text-gray-400 hover:text-red-500 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header
        className={`md:hidden flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-color)] bg-[var(--bg-surface)] sticky top-0 z-40 w-full select-none transition-shadow duration-200 ${
          isHeaderScrolled ? 'shadow-[0_2px_10px_-2px_rgba(0,0,0,0.08)]' : ''
        }`}
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.625rem)' }}
      >
        <div className="flex items-center gap-3">
          <button
            id="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1.5 -ml-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] transition-all cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <span 
            onClick={() => {
              setAppTab('home');
              setActiveSpaceId(null);
              setActiveUserId(null);
              setActivePostId(null);
            }}
            className="cursor-pointer"
          >
            <PakSpaceLogo showText={true} horizontal={true} size="sm" />
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            id="mobile-settings-btn"
            onClick={() => setIsSettingsOpen(true)}
            title="Settings"
            className="p-1.5 rounded-lg text-gray-400"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <img 
            src={currentUser.avatarUrl} 
            alt={currentUser.name} 
            onClick={() => {
              setAppTab('profile');
              setActiveUserId(null);
              setActiveSpaceId(null);
              setActivePostId(null);
            }}
            className="w-7 h-7 rounded-full object-cover border border-white/10"
            referrerPolicy="no-referrer"
          />
        </div>
      </header>

      {/* MOBILE SLIDE-IN HAMBURGER MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Menu Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 bottom-0 left-0 w-72 bg-[var(--bg-surface-2)] border-r border-[var(--border-color)] p-6 flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <PakSpaceLogo showText={true} horizontal={true} size="sm" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-[var(--text-primary)] transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {/* Secondary pages only — primary tabs already live in the bottom nav */}
                  {[
                    {
                      id: 'notifications', label: 'Notifications', icon: Bell,
                      badge: notifications.filter(n => !n.read && n.recipientId === currentUser.id).length,
                      onClick: () => {
                        setAppTab('notifications');
                        setActiveSpaceId(null);
                        setActiveUserId(null);
                        setActivePostId(null);
                        markAllNotificationsAsRead();
                      }
                    },
                    {
                      id: 'search', label: 'Search', icon: Search,
                      onClick: () => {
                        setAppTab('explore');
                        setActiveSpaceId(null);
                        setActiveUserId(null);
                        setActivePostId(null);
                        setTimeout(() => document.getElementById('global-search-input')?.focus(), 150);
                      }
                    },
                    {
                      id: 'saved', label: 'Saved Posts', icon: Bookmark,
                      onClick: () => {
                        setActiveUserId(currentUser.id);
                        setAppTab('profile');
                        setActiveSpaceId(null);
                        setActivePostId(null);
                      }
                    },
                    { id: 'settings', label: 'Settings', icon: Settings, onClick: () => setIsSettingsOpen(true) },
                    { id: 'help', label: 'Help & Support', icon: CircleHelp, onClick: () => triggerToast('Help & Support: reach us anytime at support@pakspace.pk 💬') },
                    { id: 'about', label: 'About PakSpace', icon: Info, onClick: () => triggerToast('PakSpace — the campus network built for university students across Pakistan. 🇵🇰') }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id !== 'search' && item.id !== 'saved' && item.id !== 'help' && item.id !== 'about' && appTab === item.id && !activeSpaceId && !activeUserId;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { item.onClick(); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500' 
                            : 'hover:bg-white/5 text-gray-400 hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                        {'badge' in item && item.badge ? (
                          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom footer inside drawer */}
              <div className="pt-6 border-t border-white/[0.06] space-y-4">
                <div className="flex items-center gap-3">
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-[var(--text-primary)]">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-500">@{currentUser.username}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to sign out of PakSpace?')) {
                      signOut();
                    }
                  }}
                  className="w-full py-2.5 bg-red-950/20 hover:bg-red-900/30 text-red-400 rounded-xl text-xs font-bold transition-all border border-red-900/30 cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAVIGATION — fixed, Instagram/Threads style */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-surface)] border-t border-[var(--border-color)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch justify-between px-0.5">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'spaces', label: 'Spaces', icon: Users },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'create', label: 'Create', icon: Plus },
            { id: 'market', label: 'Marketplace', icon: ShoppingBag },
            { id: 'profile', label: 'Profile', icon: UserIcon }
          ].map((item) => {
            const Icon = item.icon;
            if (item.id === 'create') {
              return (
                <button
                  key={item.id}
                  id="mobile-bottomnav-create-btn"
                  onClick={() => setIsCreatePostOpen(true)}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-2 cursor-pointer group min-w-0"
                >
                  <span className="w-10 h-10 -mt-4 rounded-2xl bg-[var(--brand-blue)] text-white shadow-lg shadow-blue-950/30 flex items-center justify-center transition-transform group-active:scale-90">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-[9px] font-semibold text-gray-400">Create</span>
                </button>
              );
            }

            const isActive = appTab === item.id && !activeSpaceId && !activeUserId;
            const isProfileActive = item.id === 'profile' && appTab === 'profile' && (!activeUserId || activeUserId === currentUser.id);
            const active = isActive || isProfileActive;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setAppTab(item.id as any);
                  setActiveSpaceId(null);
                  setActiveUserId(null);
                  setActivePostId(null);
                }}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 cursor-pointer transition-all active:scale-95 min-w-0"
              >
                <Icon
                  className={`w-5 h-5 ${active ? 'text-[var(--brand-blue)]' : 'text-gray-400'}`}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span className={`text-[9px] font-semibold truncate ${active ? 'text-[var(--brand-blue)]' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* TOAST FEEDBACK PANEL */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 md:bottom-8 right-4 md:right-8 bg-zinc-950 text-white px-5 py-3 rounded-xl shadow-xl z-50 text-xs font-semibold flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-[#16A34A] stroke-[3]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-grow max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10">
        
        {/* VIEW DETAILED POST (MODAL OR BLOCK SUBVIEW) */}
        {activePostId && (
          <div className="mb-6 p-4 md:p-6 bg-white dark:bg-[#1F2937] border border-gray-150 dark:border-gray-800 rounded-[20px] shadow-xs space-y-6">
            <button
              onClick={() => setActivePostId(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-350"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Feed
            </button>

            {posts.find(p => p.id === activePostId) ? (
              <PostCard 
                post={posts.find(p => p.id === activePostId)!}
                onBack={() => setActivePostId(null)}
              />
            ) : (
              <p className="text-sm text-gray-400">Post not found.</p>
            )}
          </div>
        )}

        {!activePostId && (
          <>
            {/* VIEW INDIVIDUAL SPACE SUBVIEW */}
            {activeSpaceId && !activeUserId && (
              <SpaceView 
                spaceId={activeSpaceId} 
                onBack={() => setActiveSpaceId(null)} 
              />
            )}

            {/* VIEW INDIVIDUAL USER PROFILE SUBVIEW */}
            {activeUserId && (
              <UserProfileView 
                userId={activeUserId} 
                onBack={() => setActiveUserId(null)} 
              />
            )}

            {/* DEFAULT ROUTED TABS */}
            {!activeSpaceId && !activeUserId && (
              <>
                {/* 1. HOME TAB */}
                {appTab === 'home' && <HomeFeedView onCreateClick={() => setIsCreatePostOpen(true)} />}

                {/* 2. EXPLORE TAB */}
                {appTab === 'explore' && <ExploreView />}

                {/* 3. SPACES TAB */}
                {appTab === 'spaces' && <SpacesGridView onCreateSpaceClick={() => setIsCreateSpaceOpen(true)} />}

                {/* 3.5 CAMPUS MARKETPLACE TAB */}
                {appTab === 'market' && <MarketplaceView />}

                {/* 4. MESSAGES TAB */}
                {appTab === 'messages' && <MessagesInboxView />}

                {/* 5. NOTIFICATIONS TAB */}
                {appTab === 'notifications' && <NotificationsView />}

                {/* 6. PROFILE TAB */}
                {appTab === 'profile' && <MyProfileView onEditProfileClick={() => setIsEditProfileOpen(true)} />}
              </>
            )}
          </>
        )}

      </main>

      {/* DIALOGS AND MODALS PANEL */}
      
      {/* A. CREATE POST DIALOG — premium composer (Substack/Notion inspired) */}
      <AnimatePresence>
        {isCreatePostOpen && (
          <div className="fixed inset-0 bg-black/60 md:flex md:items-center md:justify-center md:p-4 z-50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="w-full h-full md:h-auto"
            >
              <CreatePostComposer
                currentUser={currentUser}
                spaces={spaces}
                content={newPostContent}
                onChangeContent={setNewPostContent}
                imageUrls={newPostImageUrls}
                onAddPhotos={handleAddPhotos}
                onReplacePhoto={handleReplacePhoto}
                onRemovePhoto={(idx) => setNewPostImageUrls(prev => prev.filter((_, i) => i !== idx))}
                onReorderPhotos={(urls) => setNewPostImageUrls(urls)}
                uploadProgressMap={uploadProgressMap}
                aspectRatio={newPostAspectRatio}
                onChangeAspectRatio={setNewPostAspectRatio}
                anonymous={postAnonymously}
                onChangeAnonymous={setPostAnonymously}
                spaceId={newPostSpaceId}
                onChangeSpaceId={setNewPostSpaceId}
                isPublishing={isPublishing}
                onSubmit={handlePostSubmit}
                onClose={() => setIsCreatePostOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* B. CREATE SPACE DIALOG */}
      <AnimatePresence>
        {isCreateSpaceOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[var(--bg-surface-2)]/95 border border-white/[0.08] rounded-3xl p-6 shadow-2xl relative space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-display">
                  <Users className="w-5 h-5 text-blue-500" />
                  Launch a Space
                </h3>
                <button
                  onClick={() => setIsCreateSpaceOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-[var(--text-primary)] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSpaceSubmit} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Space Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LUMS MBA 2026 or CSS Aspirants"
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)] focus:bg-white/[0.04] transition-all"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Description</label>
                  <textarea
                    required
                    placeholder="What is this community space about? Guidelines, expectations, topics..."
                    rows={2}
                    value={newSpaceDescription}
                    onChange={(e) => setNewSpaceDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 resize-none text-[var(--text-primary)] focus:bg-white/[0.04] transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Logo Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/logo..."
                      value={newSpaceLogo}
                      onChange={(e) => setNewSpaceLogo(e.target.value)}
                      className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)]"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Banner Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/banner..."
                      value={newSpaceBanner}
                      onChange={(e) => setNewSpaceBanner(e.target.value)}
                      className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Category</label>
                    <select
                      value={newSpaceCategory}
                      onChange={(e) => setNewSpaceCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-[#1A1E24] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)]"
                    >
                      <option value="General Discussions" className="bg-[#1A1E24]">General Discussions</option>
                      <option value="Degree Group" className="bg-[#1A1E24]">Degree Group</option>
                      <option value="Campus Club" className="bg-[#1A1E24]">Campus Club</option>
                      <option value="Admissions & Scholarships" className="bg-[#1A1E24]">Admissions & Scholarships</option>
                      <option value="Hostel & Accommodation" className="bg-[#1A1E24]">Hostel & Accommodation</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Privacy Settings</label>
                    <select
                      value={newSpacePrivacy}
                      onChange={(e) => setNewSpacePrivacy(e.target.value as any)}
                      className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-[#1A1E24] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)]"
                    >
                      <option value="public" className="bg-[#1A1E24]">Public Space (Instant Join)</option>
                      <option value="private" className="bg-[#1A1E24]">Private Space (Approval Required)</option>
                    </select>
                  </div>
                </div>

                <button
                  id="submit-space-btn"
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-blue-600/10"
                >
                  Create Space
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* C. EDIT PROFILE DIALOG */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[var(--bg-surface-2)]/95 border border-white/[0.08] rounded-3xl p-6 shadow-2xl relative space-y-4 my-8 animate-fade-in"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-display">
                  <UserIcon className="w-5 h-5 text-blue-500" />
                  Edit Profile
                </h3>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-[var(--text-primary)] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Display Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)] focus:bg-white/[0.04] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">Avatar Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditAvatarUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 file:cursor-pointer"
                    />
                  </div>
                </div>

                {/* Banner/Cover Image Upload */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">Profile Banner Cover</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditCoverUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 file:cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Short Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 resize-none text-[var(--text-primary)] focus:bg-white/[0.04] transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">User Role / Status</label>
                    <select
                      value={editStatus}
                      onChange={(e: any) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)] focus:bg-white/[0.04] transition-all"
                    >
                      <option value="Student" className="bg-[var(--bg-surface-2)]">Student</option>
                      <option value="Creator" className="bg-[var(--bg-surface-2)]">Creator</option>
                      <option value="Community" className="bg-[var(--bg-surface-2)]">Community</option>
                      <option value="Organization" className="bg-[var(--bg-surface-2)]">Organization</option>
                      <option value="Current Student" className="bg-[var(--bg-surface-2)]">Current Student</option>
                      <option value="Applying Soon" className="bg-[var(--bg-surface-2)]">Applying Soon</option>
                      <option value="Graduate" className="bg-[var(--bg-surface-2)]">Graduate</option>
                      <option value="Not in University" className="bg-[var(--bg-surface-2)]">Not in University</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">City</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)] focus:bg-white/[0.04] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">University / Org Name</label>
                    <UniversityDropdown
                      value={editUniversityName}
                      onChange={setEditUniversityName}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Degree Program / Role</label>
                    <input
                      type="text"
                      value={editDegree}
                      onChange={(e) => setEditDegree(e.target.value)}
                      className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)] focus:bg-white/[0.04] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Graduation Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2027"
                      value={editGraduationYear}
                      onChange={(e) => setEditGraduationYear(e.target.value)}
                      className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)] focus:bg-white/[0.04] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Social Coordinates</label>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    <input
                      type="url"
                      placeholder="Personal Website URL"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)] focus:bg-white/[0.04] transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Instagram Username"
                      value={editInstagram}
                      onChange={(e) => setEditInstagram(e.target.value)}
                      className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)] focus:bg-white/[0.04] transition-all"
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn Profile Name"
                      value={editLinkedin}
                      onChange={(e) => setEditLinkedin(e.target.value)}
                      className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.02] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)] focus:bg-white/[0.04] transition-all"
                    />
                  </div>
                </div>

                <button
                  id="save-profile-btn"
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-blue-600/10"
                >
                  Save Profile Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. KEYBOARD SHORTCUTS DIALOG */}
      <AnimatePresence>
        {isShortcutsOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[var(--bg-surface-2)]/95 border border-white/[0.08] rounded-3xl p-6 shadow-2xl relative space-y-4 text-left"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-display">
                  <Key className="w-4.5 h-4.5 text-blue-500" />
                  Keyboard Shortcuts
                </h3>
                <button
                  onClick={() => setIsShortcutsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-[var(--text-primary)] transition-all"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                  <span className="text-gray-400">Create Post</span>
                  <kbd className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg font-mono font-bold text-[10px] text-blue-400">C</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                  <span className="text-gray-400">Go to Home</span>
                  <kbd className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg font-mono font-bold text-[10px] text-blue-400">H</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                  <span className="text-gray-400">Go to Explore</span>
                  <kbd className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg font-mono font-bold text-[10px] text-blue-400">E</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                  <span className="text-gray-400">Go to Spaces</span>
                  <kbd className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg font-mono font-bold text-[10px] text-blue-400">S</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                  <span className="text-gray-400">Go to Notifications</span>
                  <kbd className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg font-mono font-bold text-[10px] text-blue-400">N</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                  <span className="text-gray-400">Go to Profile</span>
                  <kbd className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg font-mono font-bold text-[10px] text-blue-400">P</kbd>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-400">Close Modals / Back</span>
                  <kbd className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg font-mono font-bold text-[10px] text-blue-400">ESC</kbd>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* E. SETTINGS DIALOG */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[var(--bg-surface-2)]/95 border border-white/[0.08] rounded-3xl p-6 shadow-2xl relative space-y-5 text-left"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-display">
                  <Settings className="w-4.5 h-4.5 text-blue-500" />
                  Settings
                </h3>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-[var(--text-primary)] transition-all"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 py-1">
                  <div className="flex items-start gap-2.5">
                    {darkMode ? (
                      <Moon className="w-4.5 h-4.5 text-blue-400 mt-0.5 shrink-0" />
                    ) : (
                      <Sun className="w-4.5 h-4.5 text-amber-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">Dark Mode</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Switch the entire interface between the solid-yellow light theme and dark mode.</p>
                    </div>
                  </div>
                  <button
                    id="settings-dark-mode-toggle"
                    role="switch"
                    aria-checked={darkMode}
                    aria-label="Toggle dark mode"
                    onClick={() => setDarkMode(!darkMode)}
                    className="theme-switch"
                    data-on={darkMode}
                  >
                    <span className="theme-switch-knob" />
                  </button>
                </div>

                <div className="pt-3 border-t border-white/[0.06]">
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setIsEditProfileOpen(true);
                    }}
                    className="w-full text-left text-xs font-semibold text-gray-400 hover:text-[var(--text-primary)] py-2 transition-colors cursor-pointer"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setIsShortcutsOpen(true);
                    }}
                    className="w-full text-left text-xs font-semibold text-gray-400 hover:text-[var(--text-primary)] py-2 transition-colors cursor-pointer"
                  >
                    Keyboard Shortcuts
                  </button>
                  <button
                    id="settings-signout-btn"
                    onClick={signOut}
                    className="w-full text-left text-xs font-bold text-red-400 hover:text-red-500 py-2 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ==========================================
// TOP-LEVEL REACT COMPONENT DECLARATIONS (OUTSIDE MAINAPP)
// ==========================================

// 1. HOME FEED VIEW
function HomeFeedView({ onCreateClick }: { onCreateClick: () => void }) {
  const { currentUser, posts } = useApp();
  
  return (
    <div className="max-w-[650px] mx-auto space-y-4 sm:space-y-6 animate-fade-in font-sans w-full">
      <div 
        onClick={onCreateClick}
        className="flex items-center space-x-4 bg-white/[0.02] border border-white/[0.06] p-4 rounded-2xl cursor-pointer hover:border-[var(--brand-blue)]/30 hover:bg-white/[0.04] transition-all select-none"
      >
        <img 
          src={currentUser?.avatarUrl} 
          alt={currentUser?.name} 
          className="w-10 h-10 rounded-full object-cover border border-white/10"
          referrerPolicy="no-referrer"
        />
        <span className="text-gray-400 text-xs font-medium">Share a campus update, ask a question, or help a fellow student...</span>
      </div>

      <div className="space-y-4 text-left">
        {posts.filter(p => !p.spaceId).length === 0 ? (
          <div className="text-center py-20 px-6 space-y-5 bg-white/[0.01] border border-white/[0.05] rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/[0.01] to-transparent pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-blue-600/5 border border-blue-500/10 flex items-center justify-center mx-auto">
              <CompassIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight font-display">Your space is waiting.</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                Follow communities and start sharing ideas. Express yourself, find peers, or ask academic questions.
              </p>
            </div>
            <button
              onClick={onCreateClick}
              className="px-6 py-3 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)] text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-[var(--brand-blue)]/10 inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Compose Your First Post
            </button>
          </div>
        ) : (
          posts.filter(p => !p.spaceId).map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

// 2. EXPLORE VIEW
function ExploreView() {
  const { users, posts, spaces, scholarships, universities, currentUser, toggleFollow, setAppTab, setActiveSpaceId, setActiveUserId } = useApp();
  const [exploreSearch, setExploreSearch] = useState('');
  
  if (!currentUser) return null;

  const filteredPeople = users.filter(u => 
    u.id !== currentUser.id && 
    (u.name.toLowerCase().includes(exploreSearch.toLowerCase()) || 
     u.username.toLowerCase().includes(exploreSearch.toLowerCase()) ||
     u.universityName.toLowerCase().includes(exploreSearch.toLowerCase()))
  );

  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(exploreSearch.toLowerCase())
  );

  const filteredSpaces = spaces.filter(s => 
    s.name.toLowerCase().includes(exploreSearch.toLowerCase()) || 
    s.description.toLowerCase().includes(exploreSearch.toLowerCase())
  );

  const filteredScholarships = scholarships.filter(s => 
    s.title.toLowerCase().includes(exploreSearch.toLowerCase()) ||
    s.provider.toLowerCase().includes(exploreSearch.toLowerCase())
  );

  const filteredUniversities = universities.filter(u => 
    u.name.toLowerCase().includes(exploreSearch.toLowerCase()) ||
    u.city.toLowerCase().includes(exploreSearch.toLowerCase())
  );

  const isSearching = exploreSearch.trim().length > 0;

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-display">Explore Opportunities</h2>
        <div className="relative">
          <input
            id="global-search-input"
            type="text"
            placeholder="Search people, posts, spaces, scholarships, universities..."
            value={exploreSearch}
            onChange={(e) => setExploreSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white/[0.04] text-[var(--text-primary)] transition-all shadow-lg shadow-black/10"
          />
          <Search className="absolute left-4 top-4 w-4.5 h-4.5 text-gray-500" />
          {isSearching && (
            <button
              onClick={() => setExploreSearch('')}
              className="absolute right-4 top-3.5 p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[var(--text-primary)] cursor-pointer transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {isSearching ? (
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Search Results for "{exploreSearch}"</p>

          {filteredSpaces.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-display">
                <Users className="w-4 h-4 text-blue-500" />
                Spaces ({filteredSpaces.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredSpaces.map(space => (
                  <div 
                    key={space.id} 
                    onClick={() => setActiveSpaceId(space.id)}
                    className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-[18px] cursor-pointer hover:border-blue-500/30 hover:bg-white/[0.04] transition-all flex items-center gap-3"
                  >
                    <img src={space.logoUrl} alt={space.name} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/5" referrerPolicy="no-referrer" />
                    <div>
                      <h5 className="text-xs font-bold leading-tight hover:underline text-[var(--text-primary)]">{space.name}</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5">{space.members.length} members</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredPeople.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-display">
                <UserIcon className="w-4 h-4 text-blue-500" />
                Students & Grads ({filteredPeople.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPeople.map(person => (
                  <div 
                    key={person.id}
                    onClick={() => setActiveUserId(person.id)}
                    className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-[18px] cursor-pointer hover:border-blue-500/30 hover:bg-white/[0.04] transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img src={person.avatarUrl} alt={person.name} className="w-10 h-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                      <div>
                        <h5 className="text-xs font-bold leading-tight hover:underline text-[var(--text-primary)]">{person.name}</h5>
                        <p className="text-[10px] text-gray-400 mt-0.5">@{person.username}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredScholarships.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-display">
                <GraduationCap className="w-4.5 h-4.5 text-blue-500" />
                Scholarships ({filteredScholarships.length})
              </h4>
              <div className="space-y-3">
                {filteredScholarships.map(sch => (
                  <ScholarshipCard key={sch.id} scholarship={sch} />
                ))}
              </div>
            </div>
          )}

          {filteredUniversities.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-display">
                <Globe className="w-4 h-4 text-blue-500" />
                Universities ({filteredUniversities.length})
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {filteredUniversities.map(uni => (
                  <UniversityCard key={uni.id} university={uni} />
                ))}
              </div>
            </div>
          )}

          {filteredPosts.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-display">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Discussions ({filteredPosts.length})
              </h4>
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {filteredSpaces.length === 0 && 
           filteredPeople.length === 0 && 
           filteredScholarships.length === 0 && 
           filteredUniversities.length === 0 && 
           filteredPosts.length === 0 && (
            <div className="text-center py-12 space-y-2 bg-white/[0.02] border border-white/[0.06] rounded-3xl">
              <Search className="w-8 h-8 text-gray-500 mx-auto" />
              <p className="text-sm text-gray-400">No results found matching "{exploreSearch}"</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 text-center py-16 px-6 bg-white/[0.01] border border-white/[0.05] rounded-3xl relative overflow-hidden font-sans">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/[0.005] to-transparent pointer-events-none" />
          <div className="max-w-md mx-auto space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mx-auto text-gray-400">
              <Search className="w-4.5 h-4.5 text-[var(--brand-blue)]" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight font-display">Search the entire network</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Discover fellow students, academic mentors, campus clubs, and university communities across Pakistan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// 2.5 MESSAGES INBOX VIEW
function MessagesInboxView() {
  const { users, currentUser, triggerToast } = useApp();
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<string, { senderId: string; text: string; time: string }[]>>({});

  useEffect(() => {
    const saved = localStorage.getItem('pakspace_chats');
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveChat = (history: typeof chatHistory) => {
    setChatHistory(history);
    localStorage.setItem('pakspace_chats', JSON.stringify(history));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChatUser || !currentUser) return;

    const chatKey = [currentUser.id, activeChatUser.id].sort().join('_');
    const newMsg = {
      senderId: currentUser.id,
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = {
      ...chatHistory,
      [chatKey]: [...(chatHistory[chatKey] || []), newMsg]
    };

    saveChat(updated);
    setMessageText('');
    triggerToast(`Message sent to @${activeChatUser.username}!`);
  };

  const otherUsers = users.filter(u => u.id !== currentUser?.id);

  return (
    <div className="space-y-6 animate-fade-in font-sans text-left">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-display">Direct Messages</h2>
        <p className="text-xs text-gray-450 mt-0.5">Connect and coordinate directly with peers and creators across Pakistan.</p>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-12 md:gap-6 min-h-[480px] border border-white/[0.06] md:rounded-3xl bg-[var(--bg-app)] md:bg-white/[0.01] overflow-hidden md:relative fixed md:static inset-0 md:inset-auto z-[45] md:z-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Left Side: Users List — full screen on mobile until a chat is opened */}
        <div className={`md:col-span-5 md:border-r border-white/[0.06] p-4 space-y-4 h-full md:h-auto overflow-y-auto ${activeChatUser ? 'hidden md:block' : 'block'}`}>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Discussions</h3>
          <div className="space-y-1.5 overflow-y-auto md:max-h-[380px]">
            {otherUsers.length === 0 ? (
              <p className="text-[11px] text-gray-500 py-6 text-center">No other members registered yet.</p>
            ) : (
              otherUsers.map((u) => {
                const isActive = activeChatUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setActiveChatUser(u)}
                    className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-left cursor-pointer active:scale-[0.99] ${
                      isActive 
                        ? 'bg-blue-600/10 border border-blue-500/20' 
                        : 'border border-transparent hover:bg-white/[0.02]'
                    }`}
                  >
                    <img src={u.avatarUrl} alt={u.name} className="w-11 h-11 md:w-9 md:h-9 rounded-full object-cover border border-white/5 shrink-0" />
                    <div className="overflow-hidden">
                      <h4 className="text-sm md:text-xs font-bold text-[var(--text-primary)] truncate leading-none">{u.name}</h4>
                      <p className="text-[11px] md:text-[10px] text-gray-400 mt-1 truncate">@{u.username}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Chat Window — full-screen takeover on mobile, Instagram DM style */}
        <div className={`md:col-span-7 flex-col justify-between p-4 min-h-[400px] h-full md:h-auto ${activeChatUser ? 'flex' : 'hidden md:flex'}`}>
          {activeChatUser ? (
            <>
              {/* Active Chat Header */}
              <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3 mb-3 sticky top-0 bg-[var(--bg-app)] md:bg-transparent z-10">
                <button
                  onClick={() => setActiveChatUser(null)}
                  className="md:hidden p-1 -ml-1 rounded-lg text-gray-400 hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img src={activeChatUser.avatarUrl} alt={activeChatUser.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] leading-none">{activeChatUser.name}</h4>
                  <p className="text-[9px] text-[var(--brand-blue)] mt-0.5">Online</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto md:max-h-[260px] space-y-3 pr-1 py-2 text-xs">
                {(() => {
                  const chatKey = [currentUser?.id, activeChatUser.id].sort().join('_');
                  const msgs = chatHistory[chatKey] || [];
                  if (msgs.length === 0) {
                    return (
                      <div className="text-center py-12 space-y-1.5 text-gray-500">
                        <p className="font-semibold text-gray-400">No messages yet.</p>
                        <p className="text-[10px]">Send a friendly note to @{activeChatUser.username} to get started!</p>
                      </div>
                    );
                  }
                  return msgs.map((m, idx) => {
                    const isMe = m.senderId === currentUser?.id;
                    return (
                      <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 space-y-0.5 ${
                          isMe 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white/[0.04] text-gray-200 rounded-tl-none border border-white/[0.05]'
                        }`}>
                          <p className="leading-relaxed">{m.text}</p>
                          <p className="text-[8px] text-right opacity-60">{m.time}</p>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Message Input Box — sticky above the mobile keyboard */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-white/[0.06] sticky bottom-0 bg-[var(--bg-app)] md:bg-transparent">
                <input
                  type="text"
                  placeholder={`Write a message to @${activeChatUser.username}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow py-12 px-6 text-center space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-gray-400">
                <MessageSquare className="w-5 h-5 text-[var(--brand-blue)]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">Direct Messaging</h4>
                <p className="text-[11px] text-gray-400 max-w-xs leading-relaxed">
                  Connect with classmates, project partners, society members, and students from universities across Pakistan. Start meaningful conversations and build your campus network.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. SPACES GRID VIEW
function SpacesGridView({ onCreateSpaceClick }: { onCreateSpaceClick: () => void }) {
  const { spaces, currentUser, joinSpace, setActiveSpaceId } = useApp();
  
  if (!currentUser) return null;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex justify-between items-center select-none">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-display">University Spaces</h2>
          <p className="text-xs text-gray-400 mt-0.5">Explore degree groups, campus clubs, and admissions guides</p>
        </div>
        
        <button
          id="launch-space-btn"
          onClick={onCreateSpaceClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Launch Space
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {spaces.length === 0 ? (
          <div className="col-span-full text-center py-16 px-6 space-y-4 bg-white/[0.02] border border-white/[0.06] rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/[0.02] pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-2 animate-pulse">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">No Spaces Launched Yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              Be the first to launch a space for your university, department, or special interest! Let's connect students.
            </p>
            <button
              onClick={onCreateSpaceClick}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-blue-600/10"
            >
              Launch Your First Space
            </button>
          </div>
        ) : (
          spaces.map((space) => {
            const joined = space.members.includes(currentUser.id);
            return (
              <div 
                key={space.id}
                className="bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden hover:border-blue-500/20 transition-all duration-250 flex flex-col justify-between shadow-xl"
              >
                <div 
                  onClick={() => setActiveSpaceId(space.id)}
                  className="h-28 bg-[var(--bg-surface-2)] relative cursor-pointer group"
                >
                  <img src={space.bannerUrl} alt={space.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-3 left-4 flex items-center space-x-2">
                    <img src={space.logoUrl} alt={space.name} className="w-10 h-10 rounded-xl object-cover border-2 border-[var(--bg-surface-2)]" referrerPolicy="no-referrer" />
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-600/10 text-blue-400 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        {space.category || 'General Discussions'}
                      </span>
                      {space.privacy === 'private' ? (
                        <span className="bg-amber-500/10 text-amber-500 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Private
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-500 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                          <Unlock className="w-2.5 h-2.5" />
                          Public
                        </span>
                      )}
                    </div>
                    <h3 
                      onClick={() => setActiveSpaceId(space.id)}
                      className="font-bold text-[var(--text-primary)] hover:underline cursor-pointer tracking-tight"
                    >
                      {space.name}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{space.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] select-none">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                      {space.members.length} Members • {space.postsCount} Posts
                    </span>
                    
                    <button
                      onClick={() => joinSpace(space.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        joined 
                          ? 'bg-white/5 text-gray-450 border border-white/5' 
                          : (space.privacy === 'private' && (space.pendingRequests || []).includes(currentUser.id))
                            ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                            : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20'
                      }`}
                    >
                      {joined 
                        ? 'Joined' 
                        : space.privacy === 'private' 
                          ? (space.pendingRequests || []).includes(currentUser.id) 
                            ? 'Requested' 
                            : 'Request to Join'
                          : 'Join'
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// 4. NOTIFICATIONS VIEW
function NotificationsView() {
  const { notifications, currentUser, users, markNotificationAsRead, markAllNotificationsAsRead, setActivePostId, setActiveSpaceId, setActiveUserId } = useApp();
  
  if (!currentUser) return null;

  const userNotifs = notifications.filter(n => n.recipientId === currentUser.id);

  const getUserById = (id: string): User => {
    return users.find(u => u.id === id) || {
      id: 'deleted',
      name: 'Former Student',
      username: 'former_student',
      email: '',
      bio: '',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      coverUrl: '',
      universityStatus: 'Not in University',
      universityName: '',
      degree: '',
      city: '',
      interests: [],
      followersCount: 0,
      followingCount: 0,
      joinedAt: ''
    };
  };

  const formatTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex justify-between items-center select-none">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-display">Notifications</h2>
        {userNotifs.length > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-xs font-semibold text-blue-400 hover:underline cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {userNotifs.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-white/[0.02] border border-white/[0.06] rounded-3xl">
            <Bell className="w-8 h-8 text-gray-500 mx-auto" />
            <p className="text-sm text-gray-300 font-medium font-display">All quiet here!</p>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">We will notify you when students react to your posts or interact with your profile.</p>
          </div>
        ) : (
          userNotifs.map((notif) => {
            const sender = getUserById(notif.senderId);
            return (
              <div 
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.postId) {
                    setActivePostId(notif.postId);
                  } else if (notif.spaceId) {
                    setActiveSpaceId(notif.spaceId);
                  } else {
                    setActiveUserId(notif.senderId);
                  }
                }}
                className={`p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-between cursor-pointer hover:border-blue-500/20 transition-all ${
                  !notif.read ? 'border-l-4 border-l-blue-500 bg-blue-500/[0.01]' : ''
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <img src={sender.avatarUrl} alt={sender.name} className="w-10 h-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                  <div className="text-left text-xs">
                    <p className="text-gray-200">
                      <span className="font-bold text-[var(--text-primary)] hover:underline">{sender.name}</span>{' '}
                      {notif.type === 'like' && 'liked your post'}
                      {notif.type === 'comment' && 'commented on your post'}
                      {notif.type === 'follow' && 'started following you'}
                      {notif.type === 'mention' && 'mentioned you in a discussion'}
                      {notif.type === 'space_invite' && `invited you to join "${notif.spaceName}" Space`}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">{formatTime(notif.createdAt)}</p>
                  </div>
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// 5. CURRENT USER PROFILE TAB
function MyProfileView({ onEditProfileClick }: { onEditProfileClick: () => void }) {
  const { currentUser } = useApp();
  
  if (!currentUser) return null;

  return (
    <UserProfileView 
      userId={currentUser.id} 
      onBack={null} 
      onEditProfileClick={onEditProfileClick}
    />
  );
}

// COMPONENT: CARD UNIVERSITY
function UniversityCard({ university }: { university: University; key?: any }) {
  return (
    <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center space-x-4 hover:border-blue-500/20 hover:shadow-xl transition-all text-left">
      <img 
        src={university.logoUrl} 
        alt={university.name} 
        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
        referrerPolicy="no-referrer"
      />
      <div className="text-left space-y-1 min-w-0">
        <h4 className="text-xs font-bold text-[var(--text-primary)] truncate tracking-tight">{university.name}</h4>
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-gray-500" />
          {university.city}
        </p>
        <div className="flex items-center gap-3">
          {university.ranking && (
            <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">
              {university.ranking}
            </span>
          )}
          <a 
            href={university.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] font-semibold text-gray-450 hover:text-blue-400 flex items-center gap-0.5"
          >
            Website
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// COMPONENT: CARD SCHOLARSHIP
function ScholarshipCard({ scholarship }: { scholarship: Scholarship; key?: any }) {
  return (
    <div className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-left space-y-3 hover:border-blue-500/20 hover:shadow-xl transition-all duration-200">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {scholarship.category}
          </span>
          <h4 className="text-sm font-bold text-[var(--text-primary)] tracking-tight pt-1 font-display">{scholarship.title}</h4>
          <p className="text-[10px] text-gray-400 leading-none mt-0.5">Offered by {scholarship.provider}</p>
        </div>
        
        <div className="text-right">
          <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Deadline</span>
          <p className="text-xs font-bold text-gray-300 mt-0.5 flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            {scholarship.deadline}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-450 leading-relaxed">{scholarship.description}</p>
      
      <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl text-xs space-y-1">
        <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Eligibility</span>
        <p className="text-gray-300 font-medium">{scholarship.eligibility}</p>
      </div>

      <div className="pt-2 flex justify-end">
        <a
          href={scholarship.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-xl shadow-lg shadow-blue-600/10 flex items-center gap-1 transition-all cursor-pointer"
        >
          Apply Official
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// COMPONENT: CARD POST
function PostCard({ post, onBack, isPreview = false }: { post: Post; onBack?: () => void; isPreview?: boolean; key?: any }) {
  const { currentUser, users, comments, spaces, toggleLike, toggleBookmark, toggleFollow, addComment, triggerToast, setActiveUserId, setActiveSpaceId, deletePost } = useApp();
  const [quickCommentText, setQuickCommentText] = useState('');
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  const [commentAnonymously, setCommentAnonymously] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  if (!currentUser) return null;

  const postAuthor = users.find(u => u.id === post.userId) || {
    id: 'deleted',
    name: 'Former Student',
    username: 'former_student',
    email: '',
    bio: '',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    coverUrl: '',
    universityStatus: 'Not in University',
    universityName: '',
    degree: '',
    city: '',
    interests: [],
    followersCount: 0,
    followingCount: 0,
    joinedAt: ''
  };

  const postComments = comments.filter(c => c.postId === post.id);
  const hasLiked = post.likes.includes(currentUser.id);
  const hasBookmarked = post.bookmarks.includes(currentUser.id);
  const isOwner = post.userId === currentUser.id;

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isPreview || !quickCommentText.trim()) return;
    addComment(post.id, quickCommentText, commentAnonymously);
    setQuickCommentText('');
    setCommentAnonymously(false);
    triggerToast(commentAnonymously ? 'Comment posted anonymously! 🔒' : 'Comment posted! 💬');
  };

  const handleSharePost = (postId: string) => {
    if (isPreview) return;
    const fakeLink = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(fakeLink).then(() => {
      triggerToast('Post link copied to clipboard! 📋');
    }).catch(() => {
      triggerToast('Sharing enabled! 🚀');
    });
  };

  const formatTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-5 md:p-6 text-left space-y-3 sm:space-y-4 shadow-xs hover:shadow-md hover:border-[var(--border-strong)]/40 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden">
      {/* Visual Indicator for Live Preview mode */}
      {isPreview && (
        <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 text-[9px] text-center font-bold text-blue-400 py-1 uppercase tracking-widest border-b border-blue-500/10 select-none">
          Live Interactive Preview
        </div>
      )}

      {/* Header section */}
      <div className={`flex justify-between items-start select-none ${isPreview ? 'pt-4' : ''}`}>
        <div className="flex items-center space-x-3 min-w-0">
          <img 
            onClick={() => {
              if (isPreview || post.isAnonymous) return;
              setActiveUserId(postAuthor.id);
              if (onBack) onBack();
            }}
            src={post.isAnonymous ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' : postAuthor.avatarUrl} 
            alt={post.isAnonymous ? 'Anonymous' : postAuthor.name} 
            loading="lazy"
            decoding="async"
            className={`w-10 h-10 rounded-full object-cover border border-white/10 shrink-0 ${isPreview || post.isAnonymous ? 'cursor-default' : 'cursor-pointer hover:opacity-90 transition-all'}`}
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            {/* Display name, Username, University, and timestamp in one single clean row */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-left min-w-0">
              <span 
                onClick={() => {
                  if (isPreview || post.isAnonymous) return;
                  setActiveUserId(postAuthor.id);
                  if (onBack) onBack();
                }}
                className={`font-bold text-[var(--text-primary)] text-[14px] leading-tight shrink-0 ${isPreview || post.isAnonymous ? 'cursor-default' : 'hover:underline cursor-pointer'}`}
              >
                {post.isAnonymous ? (post.anonymousName || 'Anonymous Student') : postAuthor.name}
              </span>
              <span className="text-gray-500 font-medium text-[11px] shrink-0">
                {post.isAnonymous ? '@anonymous' : `@${postAuthor.username}`}
              </span>
              
              {post.isAnonymous ? (
                <span className="text-[8px] bg-red-950/20 border border-red-900/30 text-red-400 px-1.5 py-0.5 rounded font-mono leading-none flex items-center gap-0.5 shrink-0">
                  <Lock className="w-2.5 h-2.5 shrink-0" />
                  ANONYMOUS
                </span>
              ) : postAuthor.universityName ? (
                <span className="text-[10px] bg-white/5 border border-[var(--border-color)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded-md font-medium leading-none truncate max-w-[140px] shrink-0">
                  {postAuthor.universityName.split(',')[0]}
                </span>
              ) : null}

              <span className="text-gray-400 text-[10px] shrink-0 select-none">•</span>
              <span className="text-gray-500 text-[11px] shrink-0">
                {formatTime(post.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Action column on the right */}
        <div className="flex items-center space-x-2 shrink-0">
          {post.spaceId && (
            <span 
              onClick={() => {
                if (isPreview) return;
                setActiveSpaceId(post.spaceId!);
                if (onBack) onBack();
              }}
              className="text-[9px] bg-blue-600/10 text-blue-400 font-bold px-2 py-1 rounded-lg hover:underline cursor-pointer shrink-0"
            >
              in {spaces.find(s => s.id === post.spaceId)?.name || 'Space'}
            </span>
          )}

          {!isPreview && !isOwner && !post.isAnonymous && (
            <button
              onClick={() => toggleFollow(postAuthor.id)}
              className={`text-[10px] font-bold hover:underline bg-transparent border-none cursor-pointer shrink-0 ${
                currentUser.interests.includes(`following-${postAuthor.id}`)
                  ? 'text-gray-400'
                  : 'text-blue-400'
              }`}
            >
              {currentUser.interests.includes(`following-${postAuthor.id}`) ? 'Following' : 'Follow'}
            </button>
          )}

          {!isPreview && (isOwner || (post.spaceId && (() => {
            const sp = spaces.find(s => s.id === post.spaceId);
            return sp ? (sp.ownerId === currentUser.id || (sp.admins || []).includes(currentUser.id) || (sp.moderators || []).includes(currentUser.id)) : false;
          })())) && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this post permanently?")) {
                  deletePost(post.id);
                }
              }}
              className="text-[10px] font-bold text-red-400 hover:text-red-300 hover:underline bg-transparent border-none cursor-pointer p-0 shrink-0 flex items-center"
              title="Delete Post"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Post body content */}
      <div className="space-y-3">
        {post.title && (
          <h2 className="text-lg font-bold text-[var(--text-primary)] leading-snug tracking-tight font-sans">
            {post.title}
          </h2>
        )}

        {post.content.startsWith('<') || post.content.includes('</') ? (
          <div 
            className="rich-text-content text-[14px] sm:text-[15px] text-[var(--text-primary)] leading-relaxed font-sans prose dark:prose-invert max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-[14px] sm:text-[15px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap font-sans break-words">{post.content}</p>
        )}
        
        {/* Photos display: one image at a time, Instagram-style swipe */}
        {post.postType === 'photo' && post.imageUrls && post.imageUrls.length > 0 ? (
          <ImageCarousel
            images={post.imageUrls}
            fit="contain"
            maxHeight="400px"
            onImageClick={(url) => setLightboxUrl(url)}
            showCounter={post.imageUrls.length > 1}
          />
        ) : post.imageUrl ? (
          <ImageCarousel
            images={[post.imageUrl]}
            fit="contain"
            maxHeight="400px"
            onImageClick={(url) => setLightboxUrl(url)}
            showDots={false}
          />
        ) : null}

        {/* Link attachments */}
        {post.linkUrl && (
          <a
            href={post.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 border border-[var(--border-color)] rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex justify-between items-center text-xs">
              <div className="min-w-0 text-left">
                <p className="font-bold text-[var(--text-primary)] truncate">{post.linkTitle || 'External Resource'}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 truncate">{post.linkUrl}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 shrink-0 ml-2" />
            </div>
          </a>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-gray-400 text-xs select-none">
        <div className="flex items-center space-x-5">
          <button
            disabled={isPreview}
            onClick={() => toggleLike(post.id)}
            className={`flex items-center space-x-1.5 hover:text-red-450 transition-colors cursor-pointer disabled:opacity-50 ${
              hasLiked ? 'text-red-400 font-bold animate-pulse' : ''
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500 stroke-red-500' : ''}`} />
            <span className="text-xs">{post.likes.length}</span>
          </button>

          <button
            disabled={isPreview}
            onClick={() => setShowCommentsSection(!showCommentsSection)}
            className={`flex items-center space-x-1.5 hover:text-blue-450 transition-colors cursor-pointer disabled:opacity-50 ${
              showCommentsSection ? 'text-blue-400 font-bold' : ''
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs">{postComments.length}</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            disabled={isPreview}
            onClick={() => toggleBookmark(post.id)}
            className={`hover:text-blue-400 transition-colors cursor-pointer disabled:opacity-50 ${
              hasBookmarked ? 'text-blue-400 fill-blue-500/10 stroke-blue-400' : ''
            }`}
            title="Bookmark post"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            disabled={isPreview}
            onClick={() => handleSharePost(post.id)}
            className="hover:text-blue-400 transition-colors cursor-pointer disabled:opacity-50"
            title="Share link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Muted count of comments if section is closed */}
      {!isPreview && postComments.length > 0 && !showCommentsSection && (
        <button
          onClick={() => setShowCommentsSection(true)}
          className="text-xs text-blue-400 hover:text-blue-500 font-semibold cursor-pointer py-1 block text-left transition-colors"
        >
          View {postComments.length} {postComments.length === 1 ? 'comment' : 'comments'}
        </button>
      )}

      {/* Hide option if open */}
      {!isPreview && showCommentsSection && postComments.length > 0 && (
        <button
          onClick={() => setShowCommentsSection(false)}
          className="text-xs text-gray-500 hover:text-[var(--text-primary)] font-semibold cursor-pointer py-1 block text-left transition-colors"
        >
          Hide comments
        </button>
      )}

      {/* Expanded Comments Section */}
      {showCommentsSection && !isPreview && (
        <div className="pt-4 border-t border-white/[0.06] space-y-4 animate-fade-in">
          {postComments.length > 0 && (
            <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
              {postComments.map((comment) => {
                const author = users.find(u => u.id === comment.userId) || {
                  id: 'deleted',
                  name: 'Former Student',
                  username: 'former_student',
                  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
                };
                const displayCommentName = comment.isAnonymous ? (comment.anonymousName || 'Anonymous Student') : author.name;
                const displayCommentAvatar = comment.isAnonymous ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' : author.avatarUrl;

                return (
                  <div key={comment.id} className="flex space-x-3 text-xs items-start">
                    <img 
                      src={displayCommentAvatar} 
                      alt={displayCommentName} 
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/10" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="bg-[var(--bg-app)]/30 border border-[var(--border-color)] p-2.5 rounded-xl text-left flex-grow space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[var(--text-secondary)]">{displayCommentName}</span>
                          {comment.isAnonymous && (
                            <span className="text-[8px] bg-red-950/20 text-red-400 border border-red-900/30 font-mono px-1 rounded">🔒 ANON</span>
                          )}
                        </div>
                        <span className="text-[9px] text-gray-500 font-mono">{formatTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-300 leading-normal">{comment.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Comment Creation Form */}
          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Write a reply..."
                value={quickCommentText}
                onChange={(e) => setQuickCommentText(e.target.value)}
                className="flex-grow px-3 py-2 border border-[var(--border-color)] bg-[var(--bg-app)]/50 rounded-xl text-xs focus:outline-none focus:border-[var(--brand-blue)] text-[var(--text-secondary)]"
              />
              <button
                type="submit"
                disabled={!quickCommentText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-45 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl cursor-pointer shrink-0 transition-colors"
              >
                Reply
              </button>
            </div>

            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setCommentAnonymously(!commentAnonymously)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono tracking-wide transition-all cursor-pointer ${
                  commentAnonymously 
                    ? 'bg-red-950/20 border-red-900/40 text-red-400' 
                    : 'bg-white/5 border-[var(--border-color)] text-gray-400 hover:text-[var(--text-secondary)]'
                }`}
              >
                {commentAnonymously ? <Lock className="w-3 h-3 shrink-0 text-red-400" /> : <Unlock className="w-3 h-3 shrink-0" />}
                {commentAnonymously ? 'REPLYING ANONYMOUSLY (🔒)' : 'REPLY ANONYMOUSLY'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lightbox full-screen modal overlay */}
      {lightboxUrl && (
        <div 
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-[200] p-4 cursor-zoom-out animate-fade-in select-none"
        >
          <div className="relative max-w-full max-h-[85vh] flex flex-col items-center">
            <img src={lightboxUrl} alt="Enlarged campus moment" className="rounded-2xl max-w-full max-h-[80vh] object-contain shadow-2xl border border-white/15" />
            <p className="text-[10px] text-gray-500 mt-3 font-mono tracking-wider">Click anywhere to return to feed</p>
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENT: INDIVIDUAL SPACE SUBVIEW DETAILED PAGE
function SpaceView({ spaceId, onBack }: { spaceId: string; onBack: () => void }) {
  const { 
    spaces, 
    currentUser, 
    posts, 
    users,
    joinSpace, 
    updateSpace, 
    deleteSpace, 
    acceptOrDeclineRequest, 
    promoteMember, 
    removeMember, 
    pinAnnouncement, 
    triggerToast, 
    setActiveSpaceId 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'members' | 'settings'>('feed');
  const [spaceSearchQuery, setSpaceSearchQuery] = useState('');
  
  // Settings edit states
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editBannerUrl, setEditBannerUrl] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrivacy, setEditPrivacy] = useState<'public' | 'private'>('public');
  const [newAnnounceText, setNewAnnounceText] = useState('');

  if (!currentUser) return null;
  const space = spaces.find(s => s.id === spaceId);
  if (!space) return <p className="text-sm p-4 text-center">Space not found.</p>;

  // Initialize edit states when space loads
  const handleOpenSettings = () => {
    setEditName(space.name);
    setEditDescription(space.description);
    setEditLogoUrl(space.logoUrl);
    setEditBannerUrl(space.bannerUrl);
    setEditCategory(space.category || 'General Discussions');
    setEditPrivacy(space.privacy || 'public');
    setNewAnnounceText(space.pinnedAnnouncement || '');
    setActiveSubTab('settings');
  };

  const isMember = space.members.includes(currentUser.id);
  const isOwner = space.ownerId === currentUser.id;
  const isAdmin = isOwner || (space.admins || []).includes(currentUser.id);
  const isMod = isOwner || isAdmin || (space.moderators || []).includes(currentUser.id);
  const isPending = (space.pendingRequests || []).includes(currentUser.id);

  const spacePosts = posts.filter(p => p.spaceId === space.id && 
    (p.content.toLowerCase().includes(spaceSearchQuery.toLowerCase()) || spaceSearchQuery === '')
  );

  const formatTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleUpdateSpaceSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateSpace(space.id, {
      name: editName,
      description: editDescription,
      logoUrl: editLogoUrl,
      bannerUrl: editBannerUrl,
      category: editCategory,
      privacy: editPrivacy
    });
  };

  const handlePinAnnouncementSubmit = (e: FormEvent) => {
    e.preventDefault();
    pinAnnouncement(space.id, newAnnounceText);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in pb-12">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[var(--text-primary)] mb-2 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Spaces
      </button>

      {/* SPACE HEADER CARD */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden text-left shadow-xl">
        <div className="h-36 sm:h-44 bg-gray-900/45 relative">
          <img src={space.bannerUrl} alt={space.name} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
        </div>

        <div className="p-5 sm:p-6 relative space-y-4">
          <div className="absolute -top-10 left-5 sm:left-6">
            <img src={space.logoUrl} alt={space.name} className="w-16 h-16 rounded-2xl object-cover border-4 border-[#12161A] shadow-sm bg-[var(--bg-surface-2)]" referrerPolicy="no-referrer" />
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)] font-display">{space.name}</h2>
                <span className="bg-blue-600/10 text-blue-400 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  {space.category || 'General Discussions'}
                </span>
                {space.privacy === 'private' ? (
                  <span className="bg-amber-500/10 text-amber-500 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    Private
                  </span>
                ) : (
                  <span className="bg-emerald-500/10 text-emerald-500 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                    <Unlock className="w-2.5 h-2.5" />
                    Public
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">{space.members.length} members • Created {formatTime(space.createdAt)}</p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => joinSpace(space.id)}
                className={`flex-grow sm:flex-grow-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isMember 
                    ? 'bg-white/5 text-gray-400 border border-white/5' 
                    : isPending
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/15'
                }`}
              >
                {isMember 
                  ? 'Leave Space' 
                  : isPending 
                    ? 'Requested' 
                    : space.privacy === 'private' 
                      ? 'Request to Join' 
                      : 'Join Space'
                }
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed pt-2">{space.description}</p>
        </div>
      </div>

      {/* SPACE SUB-NAVIGATION TABS */}
      <div className="flex border-b border-white/[0.06] select-none">
        <button
          onClick={() => setActiveSubTab('feed')}
          className={`px-4 py-2 text-xs font-bold transition-all relative cursor-pointer ${
            activeSubTab === 'feed' ? 'text-blue-400' : 'text-gray-400 hover:text-[var(--text-primary)]'
          }`}
        >
          Discussions (Feed)
          {activeSubTab === 'feed' && (
            <motion.div layoutId="spaceActiveTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('members')}
          className={`px-4 py-2 text-xs font-bold transition-all relative cursor-pointer ${
            activeSubTab === 'members' ? 'text-blue-400' : 'text-gray-400 hover:text-[var(--text-primary)]'
          }`}
        >
          Members ({space.members.length})
          {activeSubTab === 'members' && (
            <motion.div layoutId="spaceActiveTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
        {isAdmin && (
          <button
            onClick={handleOpenSettings}
            className={`px-4 py-2 text-xs font-bold transition-all relative cursor-pointer ${
              activeSubTab === 'settings' ? 'text-blue-400' : 'text-gray-400 hover:text-[var(--text-primary)]'
            }`}
          >
            Settings & Moderation
            {activeSubTab === 'settings' && (
              <motion.div layoutId="spaceActiveTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        )}
      </div>

      {/* TAB 1: FEED VIEW */}
      {activeSubTab === 'feed' && (
        <div className="space-y-4 animate-fade-in">
          {/* Check Privacy Restrictions */}
          {space.privacy === 'private' && !isMember ? (
            <div className="text-center py-16 px-6 space-y-4 bg-white/[0.02] border border-white/[0.06] rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-amber-500/[0.01] pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-2 animate-pulse">
                <Lock className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">🔒 Private Space</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                This space is restricted to approved campus members. Only approved members can view posts, create posts, or join discussions.
              </p>
              {!isPending ? (
                <button
                  onClick={() => joinSpace(space.id)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-blue-600/10"
                >
                  Request to Join
                </button>
              ) : (
                <span className="inline-block px-4 py-2 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-xl">
                  Waiting for Approval...
                </span>
              )}
            </div>
          ) : (
            <>
              {/* Pinned Announcement */}
              {space.pinnedAnnouncement && (
                <div className="bg-[#FAF7EE] text-[#1F2937] p-5 rounded-3xl border border-[#FACC15] relative text-left shadow-lg">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-2.5 items-start">
                      <Sparkles className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#3B82F6] font-mono block">Pinned Announcement</span>
                        <p className="text-xs font-medium text-gray-700 leading-relaxed mt-1 whitespace-pre-wrap">{space.pinnedAnnouncement}</p>
                      </div>
                    </div>
                    {isMod && (
                      <button
                        onClick={() => pinAnnouncement(space.id, '')}
                        className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                        title="Unpin"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Feed Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06] shadow-xl">
                <span className="text-xs font-bold text-gray-450 uppercase tracking-wider">{spacePosts.length} Posts inside Space</span>
                
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search posts inside space..."
                    value={spaceSearchQuery}
                    onChange={(e) => setSpaceSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-xl text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)]"
                  />
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                </div>
              </div>

              {/* Space Posts */}
              <div className="space-y-4">
                {spacePosts.length === 0 ? (
                  <div className="text-center py-12 space-y-2 bg-white/[0.02] border border-white/[0.06] rounded-3xl">
                    <MessageSquare className="w-8 h-8 text-gray-500 mx-auto" />
                    <p className="text-sm font-semibold text-[var(--text-primary)]">No posts in this space yet</p>
                    <p className="text-xs text-gray-400">Be the first to share academic resources or campus queries!</p>
                  </div>
                ) : (
                  spacePosts.map((post) => (
                    <PostCard key={post.id} post={post} onBack={onBack} />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: MEMBERS VIEW */}
      {activeSubTab === 'members' && (
        <div className="space-y-6 animate-fade-in text-left">
          {space.privacy === 'private' && !isMember ? (
            <p className="text-xs text-gray-400 text-center py-8">Members are hidden for private spaces.</p>
          ) : (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-450 font-mono mb-4">Space Members List ({space.members.length})</h3>
                <div className="divide-y divide-white/[0.04]">
                  {space.members.map(memberId => {
                    const mDetails = users.find(u => u.id === memberId);
                    if (!mDetails) return null;

                    const mIsOwner = space.ownerId === memberId;
                    const mIsAdmin = mIsOwner || (space.admins || []).includes(memberId);
                    const mIsMod = mIsOwner || mIsAdmin || (space.moderators || []).includes(memberId);

                    let roleBadge = "Member";
                    if (mIsOwner) roleBadge = "Owner";
                    else if (mIsAdmin) roleBadge = "Admin";
                    else if (mIsMod) roleBadge = "Moderator";

                    return (
                      <div key={memberId} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={mDetails.avatarUrl} alt={mDetails.name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[var(--text-primary)]">{mDetails.name}</span>
                              <span className="bg-white/5 text-gray-400 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">
                                {roleBadge}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500">@{mDetails.username} • {mDetails.universityName || 'Student'}</p>
                          </div>
                        </div>

                        {/* Owner commands to manage members */}
                        {isOwner && memberId !== currentUser.id && (
                          <div className="flex gap-2">
                            {roleBadge === "Member" && (
                              <>
                                <button
                                  onClick={() => promoteMember(space.id, memberId, 'Admin')}
                                  className="text-[10px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg"
                                >
                                  Make Admin
                                </button>
                                <button
                                  onClick={() => promoteMember(space.id, memberId, 'Moderator')}
                                  className="text-[10px] bg-green-500/10 hover:bg-green-500/20 text-green-400 px-2 py-1 rounded-lg"
                                >
                                  Make Mod
                                </button>
                              </>
                            )}
                            {roleBadge !== "Owner" && (
                              <>
                                {roleBadge !== "Member" && (
                                  <button
                                    onClick={() => promoteMember(space.id, memberId, 'Member')}
                                    className="text-[10px] bg-gray-500/15 hover:bg-gray-500/25 text-gray-400 px-2 py-1 rounded-lg"
                                  >
                                    Demote
                                  </button>
                                )}
                                <button
                                  onClick={() => removeMember(space.id, memberId)}
                                  className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-1 rounded-lg"
                                >
                                  Remove
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SETTINGS & MODERATION (ADMIN ONLY) */}
      {activeSubTab === 'settings' && isAdmin && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* PART A: Pinned Announcements */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-450 font-mono">📌 Pin Announcement</h3>
            <form onSubmit={handlePinAnnouncementSubmit} className="space-y-3">
              <textarea
                value={newAnnounceText}
                onChange={(e) => setNewAnnounceText(e.target.value)}
                placeholder="Type some announcements to pin at the top of the feed (e.g. syllabus updates, deadlines, rules)..."
                rows={2}
                className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.01] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Save Announcement
                </button>
              </div>
            </form>
          </div>

          {/* PART B: Join Requests (For Private Spaces) */}
          {space.privacy === 'private' && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-450 font-mono">Pending Join Requests ({(space.pendingRequests || []).length})</h3>
              
              {(space.pendingRequests || []).length === 0 ? (
                <p className="text-xs text-gray-500">No pending requests to join this private space.</p>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {(space.pendingRequests || []).map(reqId => {
                    const reqUser = users.find(u => u.id === reqId);
                    if (!reqUser) return null;

                    return (
                      <div key={reqId} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={reqUser.avatarUrl} alt={reqUser.name} className="w-9 h-9 rounded-full object-cover" />
                          <div>
                            <span className="text-xs font-bold text-[var(--text-primary)]">{reqUser.name}</span>
                            <p className="text-[10px] text-gray-500">@{reqUser.username} • {reqUser.universityName}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptOrDeclineRequest(space.id, reqId, 'accept')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => acceptOrDeclineRequest(space.id, reqId, 'decline')}
                            className="bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/5"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PART C: Edit Space Info */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-450 font-mono">Edit Space Details</h3>
            <form onSubmit={handleUpdateSpaceSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Space Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.01] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Description</label>
                <textarea
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.01] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Logo Image URL</label>
                  <input
                    type="url"
                    value={editLogoUrl}
                    onChange={(e) => setEditLogoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.01] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Banner Image URL</label>
                  <input
                    type="url"
                    value={editBannerUrl}
                    onChange={(e) => setEditBannerUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-white/[0.01] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-[#1A1E24] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)]"
                  >
                    <option value="General Discussions" className="bg-[#1A1E24]">General Discussions</option>
                    <option value="Degree Group" className="bg-[#1A1E24]">Degree Group</option>
                    <option value="Campus Club" className="bg-[#1A1E24]">Campus Club</option>
                    <option value="Admissions & Scholarships" className="bg-[#1A1E24]">Admissions & Scholarships</option>
                    <option value="Hostel & Accommodation" className="bg-[#1A1E24]">Hostel & Accommodation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Privacy Settings</label>
                  <select
                    value={editPrivacy}
                    onChange={(e) => setEditPrivacy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-white/[0.06] rounded-xl bg-[#1A1E24] text-xs focus:outline-none focus:border-blue-500 text-[var(--text-primary)]"
                  >
                    <option value="public" className="bg-[#1A1E24]">Public Space (Instant Join)</option>
                    <option value="private" className="bg-[#1A1E24]">Private Space (Approval Required)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* PART D: Danger Zone (Owner Only) */}
          {isOwner && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-red-400 font-mono">⚠️ Danger Zone</h3>
              <p className="text-xs text-gray-400">Permanently delete this space and all associated posts. This action is completely irreversible.</p>
              <button
                onClick={() => {
                  if (confirm("Are you absolutely sure you want to DELETE this space permanently? All data and posts will be deleted!")) {
                    deleteSpace(space.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Delete Space Permanently
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// COMPONENT: DETAILED PROFILE PAGE SUBVIEW
interface UserProfileProps {
  userId: string;
  onBack: (() => void) | null;
  onEditProfileClick?: () => void;
}

function UserProfileView({ userId, onBack, onEditProfileClick }: UserProfileProps) {
  const { currentUser, users, posts, spaces, toggleFollow, setActiveSpaceId } = useApp();
  const [profileTab, setProfileTab] = useState<'posts' | 'saved' | 'spaces'>('posts');

  if (!currentUser) return null;
  const user = users.find(u => u.id === userId);
  if (!user) return <p className="text-sm">User not found.</p>;

  const isMe = user.id === currentUser.id;
  const isFollowing = currentUser.interests.includes(`following-${user.id}`);

  const userPosts = posts.filter(p => p.userId === user.id && (!p.isAnonymous || isMe));
  const savedPosts = posts.filter(p => p.bookmarks.includes(user.id));
  const joinedSpaces = spaces.filter(s => s.members.includes(user.id));

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[var(--text-primary)] mb-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden text-left shadow-xl">
        <div className="h-40 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-[var(--bg-surface-2)] relative select-none">
          {user.coverUrl ? (
            <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/45 to-[var(--bg-surface-2)]/90 flex items-center justify-center">
              <span className="text-[10px] font-mono tracking-widest text-[var(--brand-blue)] uppercase">PAKSYNC VERIFIED</span>
            </div>
          )}
        </div>

        <div className="p-6 relative space-y-4">
          <div className="absolute -top-12 left-6">
            <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-[var(--bg-surface-2)] shadow-md bg-[var(--bg-surface-2)]" referrerPolicy="no-referrer" />
          </div>

          <div className="pt-8 flex justify-between items-start">
            <div className="space-y-1 text-left">
              <h2 className="text-xl font-bold tracking-tight leading-none text-[var(--text-primary)] font-display">{user.name}</h2>
              <p className="text-xs text-gray-500 mt-1">@{user.username}</p>
            </div>

            <div>
              {isMe ? (
                <button
                  onClick={onEditProfileClick}
                  className="px-4 py-2 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer text-[var(--text-primary)]"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isFollowing 
                      ? 'bg-white/5 text-gray-400 border border-white/5' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/15'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>

          {user.bio && (
            <p className="text-xs text-gray-300 leading-relaxed pt-1 whitespace-pre-wrap">{user.bio}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            {user.universityName && (
              <div className="flex items-center gap-2 text-gray-400">
                <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  <strong className="text-[var(--text-primary)]">{user.universityStatus}</strong> at {user.universityName} ({user.degree}){user.graduationYear ? ` • Class of ${user.graduationYear}` : ''}
                </span>
              </div>
            )}

            {user.city && (
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Based in <strong className="text-[var(--text-primary)]">{user.city}</strong></span>
              </div>
            )}
          </div>

          {user.interests.filter(i => !i.startsWith('following-')).length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {user.interests.filter(i => !i.startsWith('following-')).map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-white/5 text-gray-300 border border-white/[0.06] rounded-lg text-[10px] font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 select-none">
            <div className="flex space-x-4 text-xs font-semibold text-gray-400">
              <span><strong className="text-[var(--text-primary)]">{user.followersCount}</strong> Followers</span>
              <span><strong className="text-[var(--text-primary)]">{user.followingCount}</strong> Following</span>
            </div>

            <div className="flex items-center space-x-3 text-gray-500">
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {user.instagram && (
                <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {user.linkedIn && (
                <a href={`https://linkedin.com/in/${user.linkedIn}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-white/[0.06] select-none">
        <button
          onClick={() => setProfileTab('posts')}
          className={`flex-grow py-3 text-xs font-semibold transition-all border-b-2 cursor-pointer ${
            profileTab === 'posts' 
              ? 'border-blue-500 text-blue-400 font-bold' 
              : 'border-transparent text-gray-500 hover:text-[var(--text-primary)]'
          }`}
        >
          Posts ({userPosts.length})
        </button>

        {isMe && (
          <button
            onClick={() => setProfileTab('saved')}
            className={`flex-grow py-3 text-xs font-semibold transition-all border-b-2 cursor-pointer ${
              profileTab === 'saved' 
                ? 'border-blue-500 text-blue-400 font-bold' 
                : 'border-transparent text-gray-500 hover:text-[var(--text-primary)]'
          }`}
          >
            Saved ({savedPosts.length})
          </button>
        )}

        <button
          onClick={() => setProfileTab('spaces')}
          className={`flex-grow py-3 text-xs font-semibold transition-all border-b-2 cursor-pointer ${
            profileTab === 'spaces' 
              ? 'border-blue-500 text-blue-400 font-bold' 
              : 'border-transparent text-gray-500 hover:text-[var(--text-primary)]'
          }`}
        >
          Spaces ({joinedSpaces.length})
        </button>
      </div>

      <div className="space-y-4 text-left">
        {profileTab === 'posts' && (
          userPosts.length === 0 ? (
            <div className="text-center py-12 space-y-2 bg-white/[0.02] border border-white/[0.06] rounded-3xl">
              <MessageSquare className="w-8 h-8 text-gray-600 mx-auto" />
              <p className="text-sm text-gray-400 font-medium">No posts shared yet</p>
            </div>
          ) : (
            userPosts.map(post => <PostCard key={post.id} post={post} onBack={onBack || undefined} />)
          )
        )}

        {profileTab === 'saved' && isMe && (
          savedPosts.length === 0 ? (
            <div className="text-center py-12 space-y-2 bg-white/[0.02] border border-white/[0.06] rounded-3xl">
              <Bookmark className="w-8 h-8 text-gray-600 mx-auto" />
              <p className="text-sm text-gray-400 font-medium">Bookmarked posts will show up here</p>
            </div>
          ) : (
            savedPosts.map(post => <PostCard key={post.id} post={post} onBack={onBack || undefined} />)
          )
        )}

        {profileTab === 'spaces' && (
          joinedSpaces.length === 0 ? (
            <div className="text-center py-12 space-y-2 bg-white/[0.02] border border-white/[0.06] rounded-3xl">
              <Users className="w-8 h-8 text-gray-600 mx-auto" />
              <p className="text-sm text-gray-400 font-medium">Not joined any Space yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {joinedSpaces.map(space => (
                <div 
                  key={space.id} 
                  onClick={() => {
                    if (onBack) onBack();
                    setActiveSpaceId(space.id);
                  }}
                  className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl cursor-pointer hover:border-blue-500/20 transition-all flex items-center gap-3"
                >
                  <img src={space.logoUrl} alt={space.name} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/5" referrerPolicy="no-referrer" />
                  <div className="text-left min-w-0">
                    <h5 className="text-xs font-bold leading-tight truncate hover:underline text-[var(--text-primary)]">{space.name}</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5">{space.members.length} members</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
