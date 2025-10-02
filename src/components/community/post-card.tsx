'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDoc, useUser, useFirestore, updateDocumentNonBlocking, addDocumentNonBlocking, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { doc, collection, increment, query, where, orderBy, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';
import { type Post, type UserProfile, type Comment } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

interface PostCardProps {
  post: Post;
}

const commentSchema = z.object({
    content: z.string().min(1, "Comment can't be empty"),
});

const CommentItem = ({ comment }: { comment: Comment }) => {
    const firestore = useFirestore();
    // Use __name__ to query by document ID
    const userProfileRef = useMemoFirebase(() => firestore ? doc(firestore, `users/${comment.userId}`) : null, [firestore, comment.userId]);
    const { data: author } = useDoc<UserProfile>(userProfileRef);

    return (
        <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={author?.photoURL || ''} />
                <AvatarFallback>{author?.username?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 rounded-md bg-muted/50 p-3 text-sm">
                <div className="flex items-baseline gap-2">
                    <p className="font-semibold">{author?.username || 'User'}</p>
                    <p className="text-xs text-muted-foreground">
                        {comment.timestamp ? formatDistanceToNow(comment.timestamp.toDate(), { addSuffix: true }) : 'just now'}
                    </p>
                </div>
                <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>
            </div>
        </div>
    )
}

export default function PostCard({ post }: PostCardProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [showComments, setShowComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const authorProfileRef = useMemoFirebase(() => firestore ? doc(firestore, `users/${post.userId}`) : null, [firestore, post.userId]);
  const { data: author } = useDoc<UserProfile>(authorProfileRef);
  
  const postRef = useMemoFirebase(() => firestore ? doc(firestore, `posts/${post.id}`) : null, [firestore, post.id]);

  const likesCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, `posts/${post.id}/likes`) : null, [firestore, post.id]);

  const userLikeQuery = useMemoFirebase(() => {
    if (!likesCollectionRef || !user) return null;
    return query(likesCollectionRef, where('userId', '==', user.uid));
  }, [likesCollectionRef, user]);

  const { data: userLikes } = useCollection(userLikeQuery);
  const hasLiked = userLikes ? userLikes.length > 0 : false;
  
  const commentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, `posts/${post.id}/comments`), orderBy('timestamp', 'asc'));
  }, [firestore, post.id]);
  const { data: comments } = useCollection<Comment>(commentsQuery);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const handleLike = async () => {
    if (!firestore || !user || !postRef || !likesCollectionref) return;
  
    if (hasLiked) {
        if (userLikes && userLikes[0]) {
            const likeDocRef = doc(firestore, `posts/${post.id}/likes`, userLikes[0].id);
            deleteDocumentNonBlocking(likeDocRef);
            updateDocumentNonBlocking(postRef, { likeCount: increment(-1) });
        }
    } else {
        addDocumentNonBlocking(likesCollectionRef, { userId: user.uid });
        updateDocumentNonBlocking(postRef, { likeCount: increment(1) });
    }
  };

  const onCommentSubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!firestore || !user || !postRef) return;
    setIsSubmittingComment(true);
    
    const commentsCollection = collection(firestore, `posts/${post.id}/comments`);
    const newComment = {
      userId: user.uid,
      content: values.content,
      timestamp: serverTimestamp(),
    };
    
    // We don't await this, but we can still use .then() for sequential logic
    addDocumentNonBlocking(commentsCollection, newComment).then(() => {
        updateDocumentNonBlocking(postRef, { commentCount: increment(1) });
    });

    form.reset();
    setIsSubmittingComment(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <Avatar>
          <AvatarImage src={author?.photoURL || ''} alt={author?.username} />
          <AvatarFallback>{author?.username ? author.username[0] : 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{author?.username || 'Loading...'}</p>
          <p className="text-xs text-muted-foreground">
            {post.timestamp ? formatDistanceToNow(post.timestamp.toDate(), { addSuffix: true }) : '...'}
          </p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-4">
            <Button variant="ghost" size="sm" onClick={handleLike} disabled={!user}>
                <Heart className={cn("mr-2", hasLiked && 'fill-red-500 text-red-500')} />
                {post.likeCount}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
                <MessageCircle className="mr-2" />
                {post.commentCount}
            </Button>
        </div>
      </CardFooter>
      {showComments && (
        <CardContent className="border-t pt-4">
            <div className="space-y-4">
                {user ? (
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onCommentSubmit)} className="flex items-start gap-2">
                             <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormControl>
                                        <Textarea placeholder="Write a comment..." {...field} rows={1} className="min-h-0"/>
                                    </FormControl>
                                    </FormItem>
                                )}
                                />
                            <Button type="submit" size="sm" disabled={isSubmittingComment}>
                                {isSubmittingComment ? '...' : 'Send'}
                            </Button>
                        </form>
                    </Form>
                ) : <p className="text-center text-sm text-muted-foreground">Please log in to comment.</p>}
               
                {comments && comments.length > 0 ? (
                    comments.map(comment => <CommentItem key={comment.id} comment={comment}/>)
                ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">No comments yet.</p>
                )}
            </div>
        </CardContent>
      )}
    </Card>
  );
}
