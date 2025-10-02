'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getTutorResponse } from '@/lib/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Bot, Loader2, Send, User, GitBranch, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import type { MindMap } from '@/ai/schemas/mind-map-schema';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  mindmap?: MindMap;
}

const formSchema = z.object({
  query: z.string().min(1),
});

const MindMapVisualizer = ({ mindmap }: { mindmap: MindMap }) => (
    <div className="mt-4 rounded-md border bg-card p-4">
      <h4 className="mb-4 font-semibold text-base">Mindmap for: {mindmap.topic}</h4>
      <div className="space-y-4">
        {mindmap.mindmap.map((branch, index) => (
          <div key={index}>
            <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 flex-shrink-0 text-primary" />
                <span className="font-semibold text-lg">{branch.branch}</span>
            </div>
            <ul className="mt-2 ml-4 space-y-2 border-l pl-4">
                {branch.subbranches.map((sub, subIndex) => (
                    <li key={subIndex} className="flex items-start gap-2">
                        <ChevronsRight className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
                        <span>{sub}</span>
                    </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
);


export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: values.query };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    const response = await getTutorResponse({ query: values.query });

    if (response.success && response.data) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response,
        mindmap: response.data.mindmap,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } else {
       toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: response.error || 'Sorry, I was unable to process your request.',
      })
    }
    setIsLoading(false);
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <h1 className="font-headline text-2xl font-bold">AI Tutor</h1>
        <p className="text-muted-foreground">Ask me anything about your studies or request a mindmap!</p>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn('flex items-start gap-4', message.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className='bg-primary text-primary-foreground'>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xl rounded-lg p-3 shadow-sm',
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.mindmap && <MindMapVisualizer mindmap={message.mindmap} />}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8 border">
                   <AvatarFallback className='bg-primary text-primary-foreground'>
                      <Bot />
                    </AvatarFallback>
                </Avatar>
                <div className="flex max-w-xl items-center rounded-lg bg-muted p-3 shadow-sm">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center space-x-2">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="e.g., Explain black holes, or 'create a mindmap on photosynthesis'" {...field} disabled={isLoading} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
