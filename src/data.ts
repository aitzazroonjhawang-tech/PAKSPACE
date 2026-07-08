/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Post, Comment, Space, Notification, Scholarship, University, Product } from './types';

export const SEED_UNIVERSITIES: University[] = [
  {
    id: 'univ-1',
    name: 'National University of Sciences & Technology (NUST)',
    city: 'Islamabad',
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80',
    ranking: '#1 in Engineering',
    website: 'https://nust.edu.pk'
  },
  {
    id: 'univ-2',
    name: 'Government College University (GCU)',
    city: 'Lahore',
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80',
    ranking: '#1 in Liberal Arts & Heritage',
    website: 'https://gcu.edu.pk'
  },
  {
    id: 'univ-3',
    name: 'FAST NUCES',
    city: 'Islamabad',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&auto=format&fit=crop&q=80',
    ranking: '#1 in Computer Science',
    website: 'https://nu.edu.pk'
  }
];

export const SEED_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'schol-1',
    title: 'HEC Need-Based Scholarship Program',
    provider: 'Higher Education Commission (HEC)',
    description: 'Financial assistance for deserving Pakistani students seeking undergraduate/graduate admissions in designated public-sector institutions.',
    eligibility: 'All students enrolled in public universities with household income below 45,000 PKR/month.',
    deadline: '2026-10-15',
    applyUrl: 'https://hec.gov.pk/scholarships',
    category: 'Local Need-Based'
  },
  {
    id: 'schol-2',
    title: 'Commonwealth Scholarship Program 2026',
    provider: 'Commonwealth Scholarship Commission',
    description: 'Fully-funded Master\'s and PhD fellowships in top UK universities for Pakistani citizens with outstanding academic profiles.',
    eligibility: 'Pakistani citizens with a completed 4-year Bachelor\'s degree or equivalent.',
    deadline: '2026-09-01',
    applyUrl: 'https://cscuk.fcdo.gov.uk',
    category: 'International Fully-Funded'
  }
];

export const SEED_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Aitzaz Ahmed',
    username: 'aitzaz',
    email: 'aitzaz@gmail.com',
    bio: 'Software Engineering student at NUST. Passionate about community building, Notion workspaces, and digital publishing.',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    universityStatus: 'Current Student',
    universityName: 'NUST, Islamabad',
    degree: 'BS Software Engineering',
    city: 'Islamabad',
    interests: ['Engineering', 'Freelancing', 'HEC Guides', 'Study Spaces'],
    followersCount: 142,
    followingCount: 98,
    joinedAt: '2026-01-10'
  },
  {
    id: 'user-2',
    name: 'Zainab Fatima',
    username: 'zainab_f',
    email: 'zainab@gcu.edu',
    bio: 'GCU Lahore Literature major. Collector of vintage books, chai enthusiast, and editor of GCU Chronicle.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    universityStatus: 'Student',
    universityName: 'Government College University (GCU), Lahore',
    degree: 'BA English Literature',
    city: 'Lahore',
    interests: ['HEC Guides', 'Writing', 'Admissions', 'Books'],
    followersCount: 389,
    followingCount: 156,
    joinedAt: '2026-02-15'
  },
  {
    id: 'user-3',
    name: 'Hamza Khan',
    username: 'hamzadev',
    email: 'hamza@nu.edu',
    bio: 'FAST Islamabad CS Junior. Building tech products, teaching peers, and hunting for hostel electronics.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
    universityStatus: 'Current Student',
    universityName: 'FAST NUCES, Islamabad',
    degree: 'BS Computer Science',
    city: 'Islamabad',
    interests: ['Engineering', 'Coding', 'Freelancing', 'Tech'],
    followersCount: 215,
    followingCount: 112,
    joinedAt: '2026-03-01'
  }
];

export const SEED_SPACES: Space[] = [
  {
    id: 'space-1',
    name: 'HEC Scholarships Support',
    slug: 'hec-scholarships',
    description: 'Community space for sharing guidelines on Local Need-Based, Overseas, and Indigenous scholarships offered by HEC.',
    bannerUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
    members: ['user-admin', 'user-2', 'user-3'],
    moderators: ['user-admin'],
    postsCount: 14,
    createdAt: '2026-01-11'
  },
  {
    id: 'space-2',
    name: 'GCU Ravians Circle',
    slug: 'gcu-ravians',
    description: 'A quiet place for GCU Lahore students to talk literature, share historical archives, host debates, and coordinate events.',
    bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80',
    members: ['user-2', 'user-admin'],
    moderators: ['user-2'],
    postsCount: 8,
    createdAt: '2026-02-16'
  },
  {
    id: 'space-3',
    name: 'FAST Hostel Hacks',
    slug: 'fast-hostel-hacks',
    description: 'Hostel item trades, mini electronics, mess reviews, study materials, and late-night coding session coordinates in FAST Islamabad.',
    bannerUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=150&auto=format&fit=crop&q=80',
    members: ['user-3', 'user-admin'],
    moderators: ['user-3'],
    postsCount: 12,
    createdAt: '2026-03-02'
  }
];

export const SEED_POSTS: Post[] = [
  {
    id: 'post-1',
    userId: 'user-2',
    content: 'Has anyone submitted their documents for the HEC Need-Based Scholarship this semester? Does GCU require the original electricity bills or do photocopies work fine? Some peers say they need attested utility bills of the last 3 months.',
    postType: 'question',
    spaceId: 'space-1',
    likes: ['user-admin', 'user-3'],
    bookmarks: ['user-admin'],
    commentsCount: 2,
    createdAt: '2026-07-01T10:00:00.000Z'
  },
  {
    id: 'post-2',
    userId: 'user-admin',
    content: 'Absolutely thrilled to share that NUST DevClub is hosting a 24-hour hackathon this month! Registration is free for all STEM degrees. Attaching the full guideline packet below.',
    postType: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    likes: ['user-2', 'user-3'],
    bookmarks: [],
    commentsCount: 1,
    createdAt: '2026-07-02T12:00:00.000Z'
  },
  {
    id: 'post-anon-1',
    userId: 'user-3',
    content: 'Anonymous opinion: The GPA standard in computer science at FAST is getting insanely strict compared to other universities. Are grades really the ultimate indicator of success in the industry, or should we focus 100% on open source projects and remote contracts? Realistically asking.',
    postType: 'question',
    isAnonymous: true,
    anonymousName: 'Anonymous Student #3842',
    likes: ['user-admin', 'user-2'],
    bookmarks: ['user-admin'],
    commentsCount: 1,
    createdAt: '2026-07-04T15:30:00.000Z'
  }
];

export const SEED_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    postId: 'post-1',
    userId: 'user-admin',
    content: 'For NUST they required last 3 months attested copies of utility bills (electricity, water, gas) along with salary slips. I believe GCU follows the exact same standard since it’s HEC-approved.',
    createdAt: '2026-07-01T11:15:00.000Z'
  },
  {
    id: 'comm-2',
    postId: 'post-1',
    userId: 'user-2',
    content: 'Thank you Aitzaz! That is very helpful. I will get them attested by our section officer tomorrow.',
    createdAt: '2026-07-01T11:45:00.000Z'
  },
  {
    id: 'comm-3',
    postId: 'post-anon-1',
    userId: 'user-admin',
    content: 'As someone currently interviewing devs, skills override GPA completely. However, having a GPA above 3.0 keeps you in the resume shortlist for local enterprise positions. Focus on a balanced mix!',
    createdAt: '2026-07-04T16:00:00.000Z'
  }
];

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    recipientId: 'user-admin',
    senderId: 'user-2',
    type: 'like',
    postId: 'post-2',
    read: false,
    createdAt: '2026-07-02T12:05:00.000Z'
  }
];

export const SEED_PRODUCTS: Product[] = [];
