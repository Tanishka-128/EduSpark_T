import { AppLayout } from '@/components/layout/app-layout';
import FriendsList from '@/components/community/friends-list';

export default function CommunityPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">Community</h1>
          <p className="mt-2 text-muted-foreground">
            Connect with friends and start a "Study with Me" session.
          </p>
        </div>
        <FriendsList />
      </div>
    </AppLayout>
  );
}
