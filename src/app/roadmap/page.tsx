import { AppLayout } from '@/components/layout/app-layout';
import RoadmapGenerator from '@/components/roadmap/roadmap-generator';

export default function RoadmapPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            AI Study Roadmap
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter a topic, and our AI will generate a personalized, step-by-step learning plan for you.
          </p>
        </div>
        <RoadmapGenerator />
      </div>
    </AppLayout>
  );
}
