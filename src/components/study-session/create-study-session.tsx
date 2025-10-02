'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { Video } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters.').max(50, 'Topic cannot exceed 50 characters.'),
});

interface CreateStudySessionProps {
  userId: string;
}

export default function CreateStudySession({ userId }: CreateStudySessionProps) {
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;
    setIsSubmitting(true);

    const sessionsCollection = collection(firestore, 'studySessions');
    const newSession = {
      topic: values.topic,
      ownerId: userId,
      participants: [userId],
      startTime: serverTimestamp(),
      active: true,
    };

    try {
      await addDocumentNonBlocking(sessionsCollection, newSession);
      form.reset();
      toast({
        title: 'Session Created!',
        description: `Your study session on "${values.topic}" is now live.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
                    <Input placeholder="Enter a topic for your study session..." {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              <Video className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Creating...' : 'Create Session'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
