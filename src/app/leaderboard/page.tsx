import { AppLayout } from '@/components/layout/app-layout';
import LeaderboardList from '@/components/leaderboard/leaderboard-list';

export default function LeaderboardPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Community Leaderboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            See who's at the top of the study game. Keep learning to climb the ranks!
          </p>
        </div>
        <LeaderboardList />
      </div>
    </AppLayout>
  );
}
