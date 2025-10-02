'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { generateStudyRoadmap } from '@/lib/actions';
import type { GenerateStudyRoadmapOutput } from '@/ai/schemas/generate-study-roadmap-schema';
import { Loader2, Sparkles, Map, Flag, ExternalLink, Clock, Award } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters.',
  }),
});

export default function RoadmapGenerator() {
  const [result, setResult] = useState<GenerateStudyRoadmapOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await generateStudyRoadmap(values);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic of Interest</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Deep Learning for Beginners" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Roadmap
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 font-medium">AI is building your learning roadmap...</p>
          <p className="mt-1 text-sm text-muted-foreground">This may take a moment.</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-8">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-foreground md:text-3xl flex items-center gap-2">
                <Map className="w-8 h-8 text-primary" />
                Your Roadmap for: {result.topic}
            </h2>
            {result.roadmap.map((level, levelIndex) => (
                <div key={levelIndex} className="relative pl-8">
                    <div className="absolute left-0 top-0 flex h-full w-8 items-start justify-center">
                        <div className="h-full w-px bg-border"></div>
                        <Flag className="absolute top-1 h-6 w-6 -translate-x-1/2 rounded-full border-2 border-background bg-primary text-primary-foreground p-1 z-10" />
                    </div>
                    <div className="space-y-6">
                        <Badge variant="secondary" className="text-lg font-bold">{level.level}</Badge>
                        {level.steps.map((step, stepIndex) => (
                            <Card key={stepIndex} className="ml-4 overflow-hidden">
                                <CardContent className="p-4 space-y-4">
                                    <h4 className="font-bold text-lg">{step.subtopic}</h4>
                                    
                                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            <span>{step.time}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Award className="w-4 h-4" />
                                            <span className="flex-1">{step.milestone}</span>
                                        </div>
                                    </div>
                                    
                                    <Separator />

                                    <div className='space-y-3'>
                                        <h5 className="font-semibold">Recommended Resources</h5>
                                        <ul className="space-y-2">
                                        {step.resources.map((resource, resIndex) => (
                                            <li key={resIndex}>
                                                <Link
                                                    href={resource}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center gap-2 text-primary hover:underline text-sm"
                                                >
                                                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                                                    <span className="font-medium truncate">{resource}</span>
                                                </Link>
                                            </li>
                                        ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
