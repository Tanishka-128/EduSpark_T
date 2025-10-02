import { AppLayout } from '@/components/layout/app-layout';
import GamificationStats from '@/components/dashboard/gamification-stats';
import StudyPlan from '@/components/dashboard/study-roadmap';
import WelcomeHeader from '@/components/dashboard/welcome-header';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <WelcomeHeader />
        <GamificationStats />
        <StudyPlan />
      </div>
    </AppLayout>
  );
}
