'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, LogIn, LogOut } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useFirestore, updateDocumentNonBlocking, useCollection } from '@/firebase';
import { doc, query, collection, where, arrayUnion, arrayRemove } from 'firebase/firestore';
import { type StudySession, type UserProfile } from '@/lib/types';
import { useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';

interface SessionCardProps {
  session: StudySession;
  currentUserId?: string;
}

const ParticipantAvatars = ({ participantIds }: { participantIds: string[] }) => {
    const firestore = useFirestore();
    
    const usersQuery = useMemo(() => {
        if (!firestore || participantIds.length === 0) return null;
        return query(collection(firestore, 'users'), where('id', 'in', participantIds));
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
        </div>
    )
}


export default function SessionCard({ session, currentUserId }: SessionCardProps) {
  const firestore = useFirestore();
  const sessionRef = useMemo(() => firestore ? doc(firestore, 'studySessions', session.id) : null, [firestore, session.id]);

  const hasJoined = currentUserId ? session.participants.includes(currentUserId) : false;

  const handleJoin = () => {
    if (!sessionRef || !currentUserId) return;
    updateDocumentNonBlocking(sessionRef, {
      participants: arrayUnion(currentUserId)
    });
  };

  const handleLeave = () => {
    if (!sessionRef || !currentUserId) return;
    if (session.ownerId === currentUserId) {
      // Owner leaves, session ends
      updateDocumentNonBlocking(sessionRef, { active: false });
    } else {
      updateDocumentNonBlocking(sessionRef, {
        participants: arrayRemove(currentUserId)
      });
    }
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
        {currentUserId && (
          hasJoined ? (
            <Button variant="outline" className="w-full" onClick={handleLeave}>
              <LogOut className="mr-2" /> Leave Session
            </Button>
          ) : (
            <Button className="w-full" onClick={handleJoin}>
              <LogIn className="mr-2" /> Join Session
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}
