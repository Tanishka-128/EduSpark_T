'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { useDoc, useFirestore, updateDocumentNonBlocking, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { type StudySession, type UserProfile } from '@/lib/types';
import { doc, arrayRemove, collection, query, where } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Clock, LogOut, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const ParticipantList = ({ participantIds }: { participantIds: string[] }) => {
    const firestore = useFirestore();
    const usersQuery = useMemoFirebase(() => {
        if (!firestore || participantIds.length === 0) return null;
        // Use __name__ to query by document ID
        return query(collection(firestore, 'users'), where('__name__', 'in', participantIds));
    }, [firestore, participantIds]);

    const { data: participants, isLoading } = useCollection<UserProfile>(usersQuery);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {participantIds.map(id => <Skeleton key={id} className="h-24 w-full" />)}
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {participants?.map(p => (
                <div key={p.id} className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={p.photoURL || ''} />
                        <AvatarFallback>{p.username?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium truncate w-full">{p.username}</p>
                </div>
            ))}
        </div>
    )
}


export default function SessionDetailsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const firestore = useFirestore();
  const router = useRouter();
  const { user } = useUser();

  const sessionRef = useMemoFirebase(() => {
    if (!firestore || !sessionId) return null;
    return doc(firestore, 'studySessions', sessionId);
  }, [firestore, sessionId]);

  const { data: session, isLoading, error } = useDoc<StudySession>(sessionRef);

  const handleLeave = () => {
    if (!sessionRef || !user) return;
    
    if (session?.ownerId === user.uid) {
      // Owner leaves, session ends for everyone
      updateDocumentNonBlocking(sessionRef, { active: false });
    } else {
      updateDocumentNonBlocking(sessionRef, {
        participants: arrayRemove(user.uid)
      });
    }
    router.push('/study-sessions');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (error || !session) {
    return (
      <AppLayout>
        <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Could not load the study session. It may have ended or you don't have permission to view it.</p>
                <Button asChild variant="outline" className="mt-4">
                    <Link href="/study-sessions">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sessions
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold font-headline">{session.topic}</CardTitle>
                <CardDescription className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Started {session.startTime ? formatDistanceToNow(session.startTime.toDate(), { addSuffix: true }) : 'just now'}
                    </div>
                     <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {session.participants.length} participants
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="rounded-lg bg-green-500/10 p-4 text-center text-green-700">
                    <p className="font-semibold">You have joined the session!</p>
                    <p className="text-sm">The video call feature is currently disabled. You can see who else is in the session below.</p>
                </div>
                <div>
                    <h3 className="mb-4 text-lg font-semibold">Participants</h3>
                    <ParticipantList participantIds={session.participants} />
                </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4 border-t pt-6 sm:flex-row">
                 <Button variant="outline" className="w-full sm:w-auto" onClick={handleLeave}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {session.ownerId === user?.uid ? 'End Session for All' : 'Leave Session'}
                </Button>
                <Button asChild variant="secondary" className="w-full sm:w-auto sm:ml-auto">
                    <Link href="/study-sessions">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Sessions
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    </AppLayout>
  );
}
