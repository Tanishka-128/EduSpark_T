import { type Timestamp } from 'firebase/firestore';

export interface Post {
    id: string;
    userId: string;
    content: string;
    likeCount: number;
    commentCount: number;
    timestamp: Timestamp;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    photoURL?: string;
    points?: number;
    friendIds?: string[];
}

export interface Comment {
    id: string;
    userId: string;
    postId: string;
    content: string;
    timestamp: Timestamp;
}

export interface StudySession {
    id: string;
    topic: string;
    ownerId: string;
    participants: string[];
    startTime: Timestamp;
    active: boolean;
}

export interface FriendRequest {
    id: string;
    fromUserId: string;
    toUserId: string;
    status: 'pending' | 'accepted' | 'declined';
}
