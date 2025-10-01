import { AppLayout } from '@/components/layout/app-layout';
import ResourceGenerator from '@/components/resources/resource-generator';

export default function ResourcesPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            AI Resource Recommendations
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter your study goal, and our AI will find the best resources and videos for you.
          </p>
        </div>
        <ResourceGenerator />
      </div>
    </AppLayout>
  );
}
