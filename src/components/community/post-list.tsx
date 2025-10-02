'use client';

import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import PostCard from './post-card';
import { Skeleton } from '@/components/ui/skeleton';
import { type Post } from '@/lib/types';

export default function PostList() {
  const firestore = useFirestore();

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'posts'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: posts, isLoading, error } = useCollection<Post>(postsQuery);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">Error loading posts: {error.message}</p>;
  }
  
  if (!posts || posts.length === 0) {
    return (
        <div className="text-center text-muted-foreground py-10 border border-dashed rounded-lg">
            <p>No posts yet. Be the first to share something!</p>
        </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
