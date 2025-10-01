import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video } from 'lucide-react';

const friendsData = [
  { name: 'Sam Rivera', avatar: 'https://picsum.photos/seed/103/100/100', hint: 'woman smiling', online: true },
  { name: 'Casey Lee', avatar: 'https://picsum.photos/seed/104/100/100', hint: 'man glasses', online: false },
  { name: 'Jordan Pat', avatar: 'https://picsum.photos/seed/105/100/100', hint: 'person profile', online: true },
  { name: 'Taylor Kim', avatar: 'https://picsum.photos/seed/106/100/100', hint: 'woman glasses', online: false },
];

export default function FriendsList() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {friendsData.map((friend) => (
            <div key={friend.name} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className='h-12 w-12'>
                    <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint={friend.hint}/>
                    <AvatarFallback>{friend.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  {friend.online && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card" style={{ backgroundColor: 'hsl(var(--chart-2))' }}/>}
                </div>
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-sm text-muted-foreground">{friend.online ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled={!friend.online}>
                <Video className="mr-2 h-4 w-4" />
                Study Session
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
