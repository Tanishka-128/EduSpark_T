'use client';

import { AppLayout } from '@/components/layout/app-layout';
import CreatePostForm from '@/components/community/create-post-form';
import PostList from '@/components/community/post-list';
import { useUser } from '@/firebase';
import { Card, CardContent } from '@/components/ui/card';

export default function CommunityPage() {
  const { user, isUserLoading } = useUser();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">Community Feed</h1>
          <p className="mt-2 text-muted-foreground">
            Ask questions, share insights, and connect with your peers.
          </p>
        </div>
        
        {isUserLoading ? (
          <p>Loading...</p>
        ) : user ? (
          <>
            <CreatePostForm userId={user.uid} />
            <PostList />
          </>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>Please log in to participate in the community.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
