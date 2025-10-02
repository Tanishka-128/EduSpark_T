'use client';

import { useCollection, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { type StudySession } from '@/lib/types';
import SessionCard from './session-card';

export default function LiveSessionList() {
  const firestore = useFirestore();
  const { user } = useUser();

  const sessionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'studySessions'), where('active', '==', true));
  }, [firestore]);

  const { data: sessions, isLoading, error } = useCollection<StudySession>(sessionsQuery);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">Error loading sessions: {error.message}</p>;
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground border border-dashed rounded-lg">
        <p>No active study sessions right now. Why not start one?</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map(session => (
        <SessionCard key={session.id} session={session} currentUserId={user?.uid} />
      ))}
    </div>
  );
}
