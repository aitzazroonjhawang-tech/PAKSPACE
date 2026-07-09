/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  universityStatus: 'Current Student' | 'Applying Soon' | 'Graduate' | 'Not in University' | 'Student' | 'Creator' | 'Community' | 'Organization' | '';
  universityName: string;
  degree: string;
  city: string;
  interests: string[];
  website?: string;
  instagram?: string;
  linkedIn?: string;
  graduationYear?: string; // Graduation year of student
  followersCount: number;
  followingCount: number;
  joinedAt: string;
}

export interface Post {
  id: string;
  userId: string;
  title?: string; // Optional: title of post
  content: string;
  imageUrl?: string;
  imageUrls?: string[]; // Supporting multiple images
  aspectRatio?: '1:1' | '4:5' | '16:9' | 'original'; // Aspect ratio select
  linkUrl?: string;
  linkTitle?: string;
  postType: 'text' | 'photo' | 'link' | 'question';
  spaceId?: string; // Optional: associated with a specific Space
  likes: string[]; // List of userIds who liked
  bookmarks: string[]; // List of userIds who bookmarked
  commentsCount: number;
  createdAt: string;
  isAnonymous?: boolean;
  anonymousName?: string; // e.g. "Anonymous Student #4821"
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  isAnonymous?: boolean;
  anonymousName?: string; // e.g. "Anonymous Student #9812"
}

export interface Space {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerUrl: string;
  logoUrl: string;
  members: string[]; // List of userIds
  moderators: string[]; // List of userIds (Admin / Mod etc)
  postsCount: number;
  createdAt: string;
  ownerId?: string; // Creator automatically becomes Owner
  admins?: string[]; // Admin role lists
  category?: string; // Category field
  privacy?: 'public' | 'private'; // Privacy field
  pendingRequests?: string[]; // For private spaces: List of userIds requesting to join
  pinnedAnnouncement?: string; // Pin announcements field
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'space_invite';
  postId?: string;
  spaceId?: string;
  spaceName?: string;
  read: boolean;
  createdAt: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  description: string;
  eligibility: string;
  deadline: string;
  applyUrl: string;
  category: string;
}

export interface University {
  id: string;
  name: string;
  city: string;
  logoUrl: string;
  ranking?: string;
  website: string;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: 'Books' | 'Electronics' | 'Hostel Items' | 'Furniture' | 'Study Material' | 'Other';
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Used';
  campusLocation: string;
  images: string[];
  createdAt: string;
  isReported?: boolean;
  reportedBy?: string[];
  favoritedBy?: string[];
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: { [userId: string]: number };
}
