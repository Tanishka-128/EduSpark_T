import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Flame, Star } from 'lucide-react';

export default function GamificationStats() {
  const stats = [
    { title: 'Points', value: '1,250', icon: Star },
    { title: 'Streak', value: '5 days', icon: Flame },
    { title: 'Rank', value: '#12', icon: Award },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
