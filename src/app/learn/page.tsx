import { AppLayout } from '@/components/layout/app-layout';
import Flashcards from '@/components/learn/flashcards';
import Quiz from '@/components/learn/quiz';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, Layers } from 'lucide-react';

export default function LearnPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">Learning Zone</h1>
          <p className="mt-2 text-muted-foreground">
            Engage with your study material through quizzes and flashcards.
          </p>
        </div>

        <Tabs defaultValue="flashcards" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="flashcards">
              <Layers className="mr-2 h-4 w-4" /> Flashcards
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <BrainCircuit className="mr-2 h-4 w-4" /> Quiz
            </TabsTrigger>
          </TabsList>
          <TabsContent value="flashcards">
            <Card>
              <CardHeader>
                <CardTitle>Flashcards</CardTitle>
                <CardDescription>Review key concepts. Click a card to flip it.</CardDescription>
              </CardHeader>
              <CardContent>
                <Flashcards />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Check</CardTitle>
                <CardDescription>Test your understanding with a quick quiz.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Quiz />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
