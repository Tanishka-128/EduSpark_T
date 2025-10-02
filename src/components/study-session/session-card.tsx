'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, LogIn, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useFirestore, updateDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { doc, query, collection, where, arrayUnion } from 'firebase/firestore';
import { type StudySession, type UserProfile } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';

interface SessionCardProps {
  session: StudySession;
  currentUserId?: string;
}

const ParticipantAvatars = ({ participantIds }: { participantIds: string[] }) => {
    const firestore = useFirestore();
    
    const usersQuery = useMemoFirebase(() => {
        if (!firestore || participantIds.length === 0) return null;
        return query(collection(firestore, 'users'), where('__name__', 'in', participantIds));
    }, [firestore, participantIds]);

    const { data: participants, isLoading } = useCollection<UserProfile>(usersQuery);

    if (isLoading) {
        return <div className="flex -space-x-2 overflow-hidden">
            {participantIds.map(id => <Skeleton key={id} className="inline-block h-8 w-8 rounded-full" />)}
        </div>
    }

    return (
        <div className="flex -space-x-2 overflow-hidden">
            {participants?.map(p => (
                <Avatar key={p.id} className="inline-block h-8 w-8 border-2 border-card">
                    <AvatarImage src={p.photoURL || ''} />
                    <AvatarFallback>{p.username?.[0] || 'U'}</AvatarFallback>
                </Avatar>
            ))}
            {participantIds.length > (participants?.length || 0) &&
             Array.from({ length: participantIds.length - (participants?.length || 0) }).map((_, i) => (
                <Skeleton key={i} className="inline-block h-8 w-8 rounded-full" />
            ))}
        </div>
    )
}


export default function SessionCard({ session, currentUserId }: SessionCardProps) {
  const firestore = useFirestore();
  const sessionRef = useMemoFirebase(() => firestore ? doc(firestore, 'studySessions', session.id) : null, [firestore, session.id]);

  const hasJoined = currentUserId ? session.participants.includes(currentUserId) : false;

  const handleJoin = () => {
    if (!sessionRef || !currentUserId || hasJoined) return;
    updateDocumentNonBlocking(sessionRef, {
      participants: arrayUnion(currentUserId)
    });
  };


  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{session.topic}</CardTitle>
        <CardDescription>
          Started {session.startTime ? formatDistanceToNow(session.startTime.toDate(), { addSuffix: true }) : 'just now'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{session.participants.length} studying</span>
        </div>
        <ParticipantAvatars participantIds={session.participants} />
      </CardContent>
      <CardFooter>
        <Link href={`/study-sessions/${session.id}`} className="w-full">
            <Button className="w-full" onClick={handleJoin} disabled={!currentUserId}>
                {hasJoined ? 'View Session' : 'Join Session'}
                {hasJoined ? <ArrowRight className="mr-2" /> : <LogIn className="mr-2" />}
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
