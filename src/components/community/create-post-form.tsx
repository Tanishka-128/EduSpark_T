'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  content: z.string().min(1, 'Post cannot be empty.').max(500, 'Post cannot exceed 500 characters.'),
});

interface CreatePostFormProps {
  userId: string;
}

export default function CreatePostForm({ userId }: CreatePostFormProps) {
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;
    setIsSubmitting(true);

    const postsCollection = collection(firestore, 'posts');
    const newPost = {
      userId,
      content: values.content,
      likeCount: 0,
      commentCount: 0,
      timestamp: serverTimestamp(),
    };

    try {
      await addDocumentNonBlocking(postsCollection, newPost);
      form.reset();
      toast({
        title: 'Success!',
        description: 'Your post has been shared.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="What's on your mind? Ask a question or share an update..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                <Send className="mr-2" />
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
