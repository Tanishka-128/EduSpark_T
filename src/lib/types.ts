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
}

export interface Comment {
    id: string;
    userId: string;
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
