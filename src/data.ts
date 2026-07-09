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

export const SEED_USERS: User[] = [];

export const SEED_SPACES: Space[] = [
  {
    id: 'space-1',
    name: 'HEC Scholarships Support',
    slug: 'hec-scholarships',
    description: 'Community space for sharing guidelines on Local Need-Based, Overseas, and Indigenous scholarships offered by HEC.',
    bannerUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
    members: [],
    moderators: [],
    postsCount: 0,
    createdAt: '2026-01-11'
  },
  {
    id: 'space-2',
    name: 'GCU Ravians Circle',
    slug: 'gcu-ravians',
    description: 'A quiet place for GCU Lahore students to talk literature, share historical archives, host debates, and coordinate events.',
    bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80',
    members: [],
    moderators: [],
    postsCount: 0,
    createdAt: '2026-02-16'
  },
  {
    id: 'space-3',
    name: 'FAST Hostel Hacks',
    slug: 'fast-hostel-hacks',
    description: 'Hostel item trades, mini electronics, mess reviews, study materials, and late-night coding session coordinates in FAST Islamabad.',
    bannerUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=150&auto=format&fit=crop&q=80',
    members: [],
    moderators: [],
    postsCount: 0,
    createdAt: '2026-03-02'
  }
];

export const SEED_POSTS: Post[] = [];

export const SEED_COMMENTS: Comment[] = [];

export const SEED_NOTIFICATIONS: Notification[] = [];

export const SEED_PRODUCTS: Product[] = [];
