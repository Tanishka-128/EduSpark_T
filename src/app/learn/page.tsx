'use client';

import { AppLayout } from '@/components/layout/app-layout';
import Flashcards from '@/components/learn/flashcards';
import Quiz, { type QuizQuestion } from '@/components/learn/quiz';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, Layers, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { analyzeQuizResults, generateLearnMaterial } from '@/lib/actions';
import type { Flashcard } from '@/ai/flows/generate-learn-material';
import { toast } from '@/hooks/use-toast';
import type { AnalyzeQuizResultsInput } from '@/ai/flows/analyze-quiz-results';

const formSchema = z.object({
  topic: z.string().min(5, { message: 'Topic must be at least 5 characters.' }),
});

export default function LearnPage() {
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setTopic(values.topic);
    setFlashcards([]);
    setQuizQuestions([]);
    setFeedback(null);

    const response = await generateLearnMaterial({ topic: values.topic });

    if (response.success && response.data) {
      setFlashcards(response.data.flashcards);
      setQuizQuestions(response.data.quiz);
    } else {
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: response.error || 'Sorry, I was unable to generate learning materials.',
      });
    }

    setIsLoading(false);
  };
  
  const onQuizComplete = async (userAnswers: AnalyzeQuizResultsInput['userAnswers']) => {
    if (!topic || quizQuestions.length === 0) return;
    setIsLoading(true);
    setFeedback(null);

    const questionsForAnalysis = quizQuestions.map(q => ({ question: q.question, answer: q.answer }));

    const response = await analyzeQuizResults({
      topic,
      questions: questionsForAnalysis,
      userAnswers,
    });

    if (response.success && response.data) {
      setFeedback(response.data.feedback);
    } else {
      toast({
        variant: "destructive",
        title: "Couldn't get feedback",
        description: response.error || 'Failed to analyze quiz results.'
      })
    }
    setIsLoading(false);
  };


  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">Learning Zone</h1>
          <p className="mt-2 text-muted-foreground">Enter a topic to generate AI-powered flashcards and quizzes.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start gap-4 md:flex-row">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormControl>
                        <Input placeholder="e.g., The History of Ancient Rome" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 font-medium">AI is crafting your learning materials...</p>
            <p className="mt-1 text-sm text-muted-foreground">This may take a moment.</p>
          </div>
        )}

        {!isLoading && topic && (
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
                  <CardTitle>Flashcards for: {topic}</CardTitle>
                  <CardDescription>Review key concepts. Click a card to flip it.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Flashcards flashcards={flashcards} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="quiz">
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Check for: {topic}</CardTitle>
                  <CardDescription>Test your understanding with a quick quiz.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Quiz 
                    quizData={quizQuestions} 
                    onQuizComplete={onQuizComplete}
                    feedback={feedback}
                    isLoadingFeedback={isLoading && !feedback}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
}
