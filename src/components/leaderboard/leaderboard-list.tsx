import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award } from 'lucide-react';

const leaderboardData = [
  { rank: 1, user: 'Alex Morgan', score: 15200, avatar: 'https://picsum.photos/seed/102/100/100', hint: 'person face' },
  { rank: 2, user: 'Sam Rivera', score: 14800, avatar: 'https://picsum.photos/seed/103/100/100', hint: 'woman smiling' },
  { rank: 3, user: 'Casey Lee', score: 14750, avatar: 'https://picsum.photos/seed/104/100/100', hint: 'man glasses' },
  { rank: 4, user: 'Alex Johnson', score: 12500, avatar: 'https://picsum.photos/seed/101/100/100', hint: 'person portrait' },
  { rank: 5, user: 'Jordan Pat', score: 11900, avatar: 'https://picsum.photos/seed/105/100/100', hint: 'person profile' },
  { rank: 6, user: 'Taylor Kim', score: 11200, avatar: 'https://picsum.photos/seed/106/100/100', hint: 'woman glasses' },
];

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Award style={{ color: 'hsl(var(--chart-4))' }} />;
  if (rank === 2) return <Award style={{ color: 'hsl(var(--chart-1))' }} />;
  if (rank === 3) return <Award style={{ color: 'hsl(var(--chart-5))' }} />;
  return <span className="w-8 text-center font-mono text-muted-foreground">{rank}</span>;
}

export default function LeaderboardList() {
  return (
    <Card>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((entry) => (
              <TableRow key={entry.rank} className={entry.user === 'Alex Johnson' ? 'bg-secondary' : ''}>
                <TableCell className="font-medium">
                  <div className="flex h-8 w-8 items-center justify-center">
                    <RankIcon rank={entry.rank} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={entry.avatar} alt={entry.user} data-ai-hint={entry.hint} />
                      <AvatarFallback>{entry.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{entry.user}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">{entry.score.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
