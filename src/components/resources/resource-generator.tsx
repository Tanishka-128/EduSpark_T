'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { getStudyResources } from '@/lib/actions';
import type { GenerateStudyResourcesOutput } from '@/ai/schemas/generate-study-resources-schema';
import { Loader2, Youtube, ExternalLink, BookMarked } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const formSchema = z.object({
  studyGoal: z.string().min(10, {
    message: 'Your study goal must be at least 10 characters.',
  }),
});

export default function ResourceGenerator() {
  const [result, setResult] = useState<GenerateStudyResourcesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studyGoal: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await getStudyResources(values);

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
                name="studyGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Study Goal</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Understand the basics of Quantum Mechanics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Resources
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 font-medium">AI is curating resources for you...</p>
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
        <div className='space-y-8'>
          {result.youtubeVideos && result.youtubeVideos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Youtube /> YouTube Videos
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                {result.youtubeVideos.map((video) => (
                  <div key={video.videoId} className='space-y-3'>
                    <div className="aspect-video overflow-hidden rounded-lg border">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div>
                      <p className='font-semibold'>{video.title}</p>
                      <p className='text-sm text-muted-foreground'>{video.channel}</p>
                      <p className='text-sm mt-1'>{video.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {result.articles && result.articles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked /> Recommended Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.articles.map((article, index) => (
                    <li key={index}>
                      <Link
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">{article.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
