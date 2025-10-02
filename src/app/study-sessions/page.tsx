'use client';

import { AppLayout } from '@/components/layout/app-layout';
import CreateStudySession from '@/components/study-session/create-study-session';
import LiveSessionList from '@/components/study-session/live-session-list';
import { useUser } from '@/firebase';

export default function StudySessionsPage() {
  const { user } = useUser();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Live Study Sessions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Join a session to study with your peers in real-time.
          </p>
        </div>
        {user && <CreateStudySession userId={user.uid} />}
        <LiveSessionList />
      </div>
    </AppLayout>
  );
}
