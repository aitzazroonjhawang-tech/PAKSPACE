/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Comment, Space, Notification, Scholarship, University, Product, ChatThread, ChatMessage } from '../types';
import { SEED_USERS, SEED_SPACES, SEED_POSTS, SEED_COMMENTS, SEED_NOTIFICATIONS, SEED_SCHOLARSHIPS, SEED_UNIVERSITIES, SEED_PRODUCTS } from '../data';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  comments: Comment[];
  spaces: Space[];
  notifications: Notification[];
  scholarships: Scholarship[];
  universities: University[];
  products: Product[];
  chatThreads: ChatThread[];
  chatMessages: ChatMessage[];
  currentView: 'landing' | 'auth' | 'onboarding' | 'app';
  appTab: 'home' | 'explore' | 'spaces' | 'market' | 'messages' | 'notifications' | 'profile';
  activeSpaceId: string | null;
  activeUserId: string | null;
  activePostId: string | null;
  searchQuery: string;
  authMode: 'signin' | 'signup';
  darkMode: boolean;
  toastMessage: string;
  triggerToast: (msg: string) => void;
  
  // Auth actions
  signUp: (name: string, username: string, email: string, password?: string) => void;
  signIn: (email: string, password?: string) => boolean;
  finishOnboarding: (profileData: Partial<User>) => void;
  signOut: () => void;
  updateProfile: (profileData: Partial<User>) => void;
  
  // App views
  setView: (view: 'landing' | 'auth' | 'onboarding' | 'app') => void;
  setAppTab: (tab: 'home' | 'explore' | 'spaces' | 'market' | 'messages' | 'notifications' | 'profile') => void;
  setActiveSpaceId: (id: string | null) => void;
  setActiveUserId: (id: string | null) => void;
  setActivePostId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setAuthMode: (mode: 'signin' | 'signup') => void;
  setDarkMode: (dark: boolean) => void;
  
  // Interactive actions
  addPost: (content: string, type: 'text' | 'photo' | 'link' | 'question', options?: { title?: string; imageUrl?: string; imageUrls?: string[]; aspectRatio?: '1:1' | '4:5' | '16:9' | 'original'; linkUrl?: string; linkTitle?: string; spaceId?: string; isAnonymous?: boolean }) => void;
  addComment: (postId: string, content: string, isAnonymous?: boolean) => void;
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  toggleFollow: (targetUserId: string) => void;
  joinSpace: (spaceId: string) => void;
  createSpace: (name: string, description: string, bannerUrl?: string, logoUrl?: string, category?: string, privacy?: 'public' | 'private') => void;
  updateSpace: (spaceId: string, data: Partial<Space>) => void;
  deleteSpace: (spaceId: string) => void;
  deletePost: (postId: string) => void;
  acceptOrDeclineRequest: (spaceId: string, requesterId: string, action: 'accept' | 'decline') => void;
  promoteMember: (spaceId: string, memberId: string, role: 'Admin' | 'Moderator' | 'Member') => void;
  removeMember: (spaceId: string, memberId: string) => void;
  pinAnnouncement: (spaceId: string, content: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  triggerSimulatedInteraction: () => void;

  // Marketplace actions
  addProduct: (product: Omit<Product, 'id' | 'sellerId' | 'createdAt'>) => void;
  toggleFavoriteProduct: (productId: string) => void;
  reportProduct: (productId: string) => void;
  startOrGetChatThread: (productId: string, sellerId: string) => string;
  sendChatMessage: (threadId: string, content: string) => void;
  markChatAsRead: (threadId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Load state from localStorage or seed
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // v3: wipe every demo/seed account, post, comment, space, notification and
    // product that shipped in earlier builds so the live platform starts on a
    // completely clean slate for real user registrations. This runs once per
    // browser and also resets the theme default to light.
    if (!localStorage.getItem('pakspace_v3_initialized')) {
      localStorage.removeItem('pakspace_users');
      localStorage.removeItem('pakspace_current_user');
      localStorage.removeItem('pakspace_posts');
      localStorage.removeItem('pakspace_comments');
      localStorage.removeItem('pakspace_spaces');
      localStorage.removeItem('pakspace_notifications');
      localStorage.removeItem('pakspace_products');
      localStorage.removeItem('pakspace_chat_threads');
      localStorage.removeItem('pakspace_chat_messages');
      localStorage.removeItem('pakspace_dark');
      localStorage.setItem('pakspace_v3_initialized', 'true');
    }
    const saved = localStorage.getItem('pakspace_dark');
    // Default theme is now the solid-yellow light mode.
    return saved ? saved === 'true' : false;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pakspace_users');
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pakspace_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('pakspace_posts');
    return saved ? JSON.parse(saved) : SEED_POSTS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('pakspace_comments');
    return saved ? JSON.parse(saved) : SEED_COMMENTS;
  });

  const [spaces, setSpaces] = useState<Space[]>(() => {
    const saved = localStorage.getItem('pakspace_spaces');
    return saved ? JSON.parse(saved) : SEED_SPACES;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('pakspace_notifications');
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  const [scholarships] = useState<Scholarship[]>(SEED_SCHOLARSHIPS);
  const [universities] = useState<University[]>(SEED_UNIVERSITIES);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pakspace_products');
    return saved ? JSON.parse(saved) : SEED_PRODUCTS;
  });

  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('pakspace_chat_threads');
    return saved ? JSON.parse(saved) : [];
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('pakspace_chat_messages');
    return saved ? JSON.parse(saved) : [];
  });

  // View state
  const [currentView, setView] = useState<'landing' | 'auth' | 'onboarding' | 'app'>(() => {
    const savedUser = localStorage.getItem('pakspace_current_user');
    return savedUser ? 'app' : 'landing';
  });
  
  const [appTab, setAppTab] = useState<'home' | 'explore' | 'spaces' | 'market' | 'messages' | 'notifications' | 'profile'>('home');
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [toastMessage, setToastMessage] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('pakspace_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('pakspace_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('pakspace_current_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pakspace_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('pakspace_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('pakspace_spaces', JSON.stringify(spaces));
  }, [spaces]);

  useEffect(() => {
    localStorage.setItem('pakspace_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pakspace_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pakspace_chat_threads', JSON.stringify(chatThreads));
  }, [chatThreads]);

  useEffect(() => {
    localStorage.setItem('pakspace_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Auth Operations
  const getStoredPasswords = (): Record<string, string> => {
    const saved = localStorage.getItem('pakspace_user_passwords');
    return saved ? JSON.parse(saved) : {};
  };

  const saveStoredPassword = (email: string, password?: string) => {
    if (!password) return;
    const passwords = getStoredPasswords();
    passwords[email.toLowerCase().trim()] = password;
    localStorage.setItem('pakspace_user_passwords', JSON.stringify(passwords));
  };

  const signUp = (name: string, username: string, email: string, password?: string) => {
    const normalizedUsername = username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user already exists
    const existingEmail = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existingEmail) {
      throw new Error('An account with this email address already exists.');
    }

    const existingUsername = users.find(u => u.username === normalizedUsername);
    if (existingUsername) {
      throw new Error('This username is already taken. Please choose another.');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      username: normalizedUsername,
      email: normalizedEmail,
      bio: '',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      coverUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80`,
      universityStatus: '',
      universityName: '',
      degree: '',
      city: '',
      interests: [],
      followersCount: 0,
      followingCount: 0,
      joinedAt: new Date().toISOString().split('T')[0]
    };

    if (password) {
      saveStoredPassword(normalizedEmail, password);
    }

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setView('onboarding');
  };

  const signIn = (email: string, password?: string): boolean => {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
    
    if (existing) {
      const passwords = getStoredPasswords();
      const storedPassword = passwords[normalizedEmail];
      
      // If there is a password stored, verify it.
      if (storedPassword) {
        if (storedPassword !== password) {
          throw new Error('Incorrect password. Please try again.');
        }
      } else if (password) {
        // If there's no password stored yet (e.g. legacy/seed user), set it on first login.
        saveStoredPassword(normalizedEmail, password);
      }
      
      setCurrentUser(existing);
      if (!existing.universityStatus) {
        setView('onboarding');
      } else {
        setView('app');
        setAppTab('home');
      }
      return true;
    }
    
    throw new Error('No account found with this email. Please sign up first.');
  };

  const finishOnboarding = (profileData: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      ...profileData,
    };
    
    // Default values if empty
    if (!updated.avatarUrl) {
      updated.avatarUrl = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;
    }
    if (!updated.coverUrl) {
      updated.coverUrl = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80`;
    }

    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    setCurrentUser(updated);
    setView('app');
    setAppTab('home');
  };

  const signOut = () => {
    setCurrentUser(null);
    setView('landing');
    setAppTab('home');
    setActiveSpaceId(null);
    setActiveUserId(null);
    setActivePostId(null);
  };

  const updateProfile = (profileData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...profileData };
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    setCurrentUser(updated);
  };

  // Posts and Social Activity
  const addPost = (
    content: string, 
    type: 'text' | 'photo' | 'link' | 'question', 
    options?: { title?: string; imageUrl?: string; imageUrls?: string[]; aspectRatio?: '1:1' | '4:5' | '16:9' | 'original'; linkUrl?: string; linkTitle?: string; spaceId?: string; isAnonymous?: boolean }
  ) => {
    if (!currentUser) return;
    
    const isAnonymous = options?.isAnonymous || false;
    const anonymousName = isAnonymous 
      ? `Anonymous Student #${Math.floor(1000 + Math.random() * 9000)}`
      : undefined;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      title: options?.title,
      content,
      postType: type,
      imageUrl: options?.imageUrl,
      imageUrls: options?.imageUrls,
      aspectRatio: options?.aspectRatio,
      linkUrl: options?.linkUrl,
      linkTitle: options?.linkTitle,
      spaceId: options?.spaceId,
      likes: [],
      bookmarks: [],
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      isAnonymous,
      anonymousName
    };

    setPosts(prev => [newPost, ...prev]);

    // Increment space post counts if applicable
    if (options?.spaceId) {
      setSpaces(prev => prev.map(s => s.id === options.spaceId ? { ...s, postsCount: s.postsCount + 1 } : s));
    }
  };

  const addComment = (postId: string, content: string, isAnonymous?: boolean) => {
    if (!currentUser) return;

    const anonymousName = isAnonymous 
      ? `Anonymous Student #${Math.floor(1000 + Math.random() * 9000)}`
      : undefined;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      userId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
      isAnonymous,
      anonymousName
    };

    setComments(prev => [...prev, newComment]);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));

    // Send notification to author if they are not the current user
    const post = posts.find(p => p.id === postId);
    if (post && post.userId !== currentUser.id) {
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        recipientId: post.userId,
        senderId: currentUser.id,
        type: 'comment',
        postId,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const toggleLike = (postId: string) => {
    if (!currentUser) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const liked = p.likes.includes(currentUser.id);
        const newLikes = liked 
          ? p.likes.filter(id => id !== currentUser.id)
          : [...p.likes, currentUser.id];

        // Notify author on like
        if (!liked && p.userId !== currentUser.id) {
          const newNotif: Notification = {
            id: `notif-${Date.now()}`,
            recipientId: p.userId,
            senderId: currentUser.id,
            type: 'like',
            postId,
            read: false,
            createdAt: new Date().toISOString()
          };
          setNotifications(prev => [newNotif, ...prev]);
        }

        return { ...p, likes: newLikes };
      }
      return p;
    }));
  };

  const toggleBookmark = (postId: string) => {
    if (!currentUser) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const bookmarked = p.bookmarks.includes(currentUser.id);
        const newBookmarks = bookmarked
          ? p.bookmarks.filter(id => id !== currentUser.id)
          : [...p.bookmarks, currentUser.id];
        return { ...p, bookmarks: newBookmarks };
      }
      return p;
    }));
  };

  const toggleFollow = (targetUserId: string) => {
    if (!currentUser || currentUser.id === targetUserId) return;

    // We need to update target user followersCount AND current user followingCount
    const isFollowing = users.find(u => u.id === currentUser.id)?.followingCount; // simple local toggle

    setUsers(prev => prev.map(u => {
      if (u.id === targetUserId) {
        const isFollowed = users.find(f => f.id === currentUser.id); // Check context
        // Let's do a reliable calculation. Let's toggle follower count.
        // We can simulate follows nicely. Let's see if we already follow this user in state.
        // We will store follower list or simply increment. For this client-side mockup, let's keep it simple:
        // Let's just toggle follow count +/- 1.
        const alreadyFollowing = prev.find(x => x.id === currentUser.id)?.interests.includes(`following-${targetUserId}`);
        const countDiff = alreadyFollowing ? -1 : 1;
        return { ...u, followersCount: Math.max(0, u.followersCount + countDiff) };
      }
      if (u.id === currentUser.id) {
        const alreadyFollowing = u.interests.includes(`following-${targetUserId}`);
        const updatedInterests = alreadyFollowing
          ? u.interests.filter(i => i !== `following-${targetUserId}`)
          : [...u.interests, `following-${targetUserId}`];
        const countDiff = alreadyFollowing ? -1 : 1;
        return { ...u, followingCount: Math.max(0, u.followingCount + countDiff), interests: updatedInterests };
      }
      return u;
    }));

    // Update currentUser state
    setCurrentUser(prev => {
      if (!prev) return null;
      const alreadyFollowing = prev.interests.includes(`following-${targetUserId}`);
      const updatedInterests = alreadyFollowing
        ? prev.interests.filter(i => i !== `following-${targetUserId}`)
        : [...prev.interests, `following-${targetUserId}`];
      const countDiff = alreadyFollowing ? -1 : 1;
      
      // Notify target user
      if (!alreadyFollowing) {
        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          recipientId: targetUserId,
          senderId: prev.id,
          type: 'follow',
          read: false,
          createdAt: new Date().toISOString()
        };
        setNotifications(notifs => [newNotif, ...notifs]);
      }

      return {
        ...prev,
        followingCount: Math.max(0, prev.followingCount + countDiff),
        interests: updatedInterests
      };
    });
  };

  const joinSpace = (spaceId: string) => {
    if (!currentUser) return;

    setSpaces(prev => prev.map(s => {
      if (s.id === spaceId) {
        const isPrivate = s.privacy === 'private';
        const isMember = s.members.includes(currentUser.id);

        if (isMember) {
          // Leave space
          const newMembers = s.members.filter(id => id !== currentUser.id);
          const newAdmins = (s.admins || []).filter(id => id !== currentUser.id);
          const newMods = s.moderators.filter(id => id !== currentUser.id);
          return { ...s, members: newMembers, admins: newAdmins, moderators: newMods };
        } else {
          if (isPrivate) {
            // Add to pendingRequests
            const pending = s.pendingRequests || [];
            const isPending = pending.includes(currentUser.id);
            const newPending = isPending 
              ? pending.filter(id => id !== currentUser.id)
              : [...pending, currentUser.id];
            
            triggerToast(isPending ? 'Request cancelled' : 'Request to join sent to space owner! 📨');
            return { ...s, pendingRequests: newPending };
          } else {
            // Join directly
            return { ...s, members: [...s.members, currentUser.id] };
          }
        }
      }
      return s;
    }));
  };

  const createSpace = (name: string, description: string, bannerUrl?: string, logoUrl?: string, category?: string, privacy?: 'public' | 'private') => {
    if (!currentUser) return;

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newSpace: Space = {
      id: `space-${Date.now()}`,
      name,
      slug,
      description,
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      logoUrl: logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff&size=128`,
      members: [currentUser.id],
      moderators: [],
      admins: [],
      postsCount: 0,
      createdAt: new Date().toISOString(),
      ownerId: currentUser.id,
      category: category || 'General',
      privacy: privacy || 'public',
      pendingRequests: []
    };

    setSpaces(prev => [...prev, newSpace]);
    setActiveSpaceId(newSpace.id);
    setAppTab('spaces');
  };

  const updateSpace = (spaceId: string, data: Partial<Space>) => {
    setSpaces(prev => prev.map(s => s.id === spaceId ? { ...s, ...data } : s));
    triggerToast("Space updated successfully! 🛠️");
  };

  const deleteSpace = (spaceId: string) => {
    setSpaces(prev => prev.filter(s => s.id !== spaceId));
    setPosts(prev => prev.filter(p => p.spaceId !== spaceId));
    setActiveSpaceId(null);
    setAppTab('spaces');
    triggerToast("Space deleted permanently. 🗑️");
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setComments(prev => prev.filter(c => c.postId !== postId));
    triggerToast("Post deleted permanently.");
  };

  const acceptOrDeclineRequest = (spaceId: string, requesterId: string, action: 'accept' | 'decline') => {
    setSpaces(prev => prev.map(s => {
      if (s.id === spaceId) {
        const pending = s.pendingRequests || [];
        const newPending = pending.filter(id => id !== requesterId);
        
        let newMembers = s.members;
        if (action === 'accept') {
          newMembers = [...s.members, requesterId];
          triggerToast("Member request accepted! 🎉");

          // Send notification to the user who requested
          const newNotif: Notification = {
            id: `notif-${Date.now()}`,
            recipientId: requesterId,
            senderId: s.ownerId || currentUser?.id || '',
            type: 'space_invite',
            spaceId: s.id,
            spaceName: s.name,
            read: false,
            createdAt: new Date().toISOString()
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
        } else {
          triggerToast("Member request declined.");
        }

        return { ...s, pendingRequests: newPending, members: newMembers };
      }
      return s;
    }));
  };

  const promoteMember = (spaceId: string, memberId: string, role: 'Admin' | 'Moderator' | 'Member') => {
    setSpaces(prev => prev.map(s => {
      if (s.id === spaceId) {
        let admins = s.admins || [];
        let moderators = s.moderators || [];

        // Reset
        admins = admins.filter(id => id !== memberId);
        moderators = moderators.filter(id => id !== memberId);

        if (role === 'Admin') {
          admins = [...admins, memberId];
        } else if (role === 'Moderator') {
          moderators = [...moderators, memberId];
        }

        triggerToast(`Member role updated to ${role}! 🎖️`);
        return { ...s, admins, moderators };
      }
      return s;
    }));
  };

  const removeMember = (spaceId: string, memberId: string) => {
    setSpaces(prev => prev.map(s => {
      if (s.id === spaceId) {
        const newMembers = s.members.filter(id => id !== memberId);
        const newAdmins = (s.admins || []).filter(id => id !== memberId);
        const newMods = s.moderators.filter(id => id !== memberId);
        triggerToast("Member removed from space.");
        return { ...s, members: newMembers, admins: newAdmins, moderators: newMods };
      }
      return s;
    }));
  };

  const pinAnnouncement = (spaceId: string, content: string) => {
    setSpaces(prev => prev.map(s => {
      if (s.id === spaceId) {
        triggerToast(content ? "Announcement pinned! 📌" : "Announcement unpinned.");
        return { ...s, pinnedAnnouncement: content || undefined };
      }
      return s;
    }));
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.recipientId === currentUser.id ? { ...n, read: true } : n));
  };

  // Marketplace actions
  const addProduct = (productData: Omit<Product, 'id' | 'sellerId' | 'createdAt'>) => {
    if (!currentUser) return;
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      sellerId: currentUser.id,
      createdAt: new Date().toISOString(),
      favoritedBy: []
    };
    setProducts(prev => [newProduct, ...prev]);
    triggerToast("Listing posted successfully!");
  };

  const toggleFavoriteProduct = (productId: string) => {
    if (!currentUser) return;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const favoritedBy = p.favoritedBy || [];
        const favorited = favoritedBy.includes(currentUser.id);
        const newFavoritedBy = favorited
          ? favoritedBy.filter(id => id !== currentUser.id)
          : [...favoritedBy, currentUser.id];
        return { ...p, favoritedBy: newFavoritedBy };
      }
      return p;
    }));
  };

  const reportProduct = (productId: string) => {
    if (!currentUser) return;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const reportedBy = p.reportedBy || [];
        if (reportedBy.includes(currentUser.id)) return p;
        return { 
          ...p, 
          isReported: true, 
          reportedBy: [...reportedBy, currentUser.id] 
        };
      }
      return p;
    }));
    triggerToast("Listing reported for review. Thank you.");
  };

  const startOrGetChatThread = (productId: string, sellerId: string): string => {
    if (!currentUser) return '';
    const existing = chatThreads.find(t => 
      t.productId === productId && 
      t.buyerId === currentUser.id && 
      t.sellerId === sellerId
    );

    if (existing) {
      return existing.id;
    }

    const newThreadId = `thread-${Date.now()}`;
    const newThread: ChatThread = {
      id: newThreadId,
      productId,
      buyerId: currentUser.id,
      sellerId,
      createdAt: new Date().toISOString(),
      unreadCount: {
        [sellerId]: 1,
        [currentUser.id]: 0
      }
    };

    setChatThreads(prev => [newThread, ...prev]);
    return newThreadId;
  };

  const sendChatMessage = (threadId: string, content: string) => {
    if (!currentUser) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      senderId: currentUser.id,
      content,
      createdAt: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, newMessage]);

    setChatThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const recipientId = t.buyerId === currentUser.id ? t.sellerId : t.buyerId;
        const currentUnread = t.unreadCount ? (t.unreadCount[recipientId] || 0) : 0;
        
        // Notify recipient on message
        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          recipientId,
          senderId: currentUser.id,
          type: 'mention',
          read: false,
          createdAt: new Date().toISOString()
        };
        setNotifications(prevNotifs => [newNotif, ...prevNotifs]);

        return {
          ...t,
          lastMessage: content,
          lastMessageTime: new Date().toISOString(),
          unreadCount: {
            ...t.unreadCount,
            [recipientId]: currentUnread + 1,
            [currentUser.id]: 0
          }
        };
      }
      return t;
    }));
  };

  const markChatAsRead = (threadId: string) => {
    if (!currentUser) return;
    setChatThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          unreadCount: {
            ...t.unreadCount,
            [currentUser.id]: 0
          }
        };
      }
      return t;
    }));
  };

  // Clear simulated interactions for clean platform design
  const triggerSimulatedInteraction = () => {};

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      posts,
      comments,
      spaces,
      notifications,
      scholarships,
      universities,
      products,
      chatThreads,
      chatMessages,
      currentView,
      appTab,
      activeSpaceId,
      activeUserId,
      activePostId,
      searchQuery,
      authMode,
      darkMode,
      toastMessage,
      triggerToast,
      
      signUp,
      signIn,
      finishOnboarding,
      signOut,
      updateProfile,
      
      setView,
      setAppTab,
      setActiveSpaceId,
      setActiveUserId,
      setActivePostId,
      setSearchQuery,
      setAuthMode,
      setDarkMode,
      
      addPost,
      addComment,
      toggleLike,
      toggleBookmark,
      toggleFollow,
      joinSpace,
      createSpace,
      updateSpace,
      deleteSpace,
      deletePost,
      acceptOrDeclineRequest,
      promoteMember,
      removeMember,
      pinAnnouncement,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      triggerSimulatedInteraction,

      addProduct,
      toggleFavoriteProduct,
      reportProduct,
      startOrGetChatThread,
      sendChatMessage,
      markChatAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
