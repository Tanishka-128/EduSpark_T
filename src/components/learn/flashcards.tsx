'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Flashcard } from '@/ai/flows/generate-learn-material';

interface FlashcardsProps {
  flashcards: Flashcard[];
}

export default function Flashcards({ flashcards }: FlashcardsProps) {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const handleFlip = (index: number) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };
  
  if (!flashcards || flashcards.length === 0) {
    return (
        <div className="text-center text-muted-foreground py-10">
            <p>Enter a topic above to generate flashcards.</p>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {flashcards.map((card, index) => (
        <div
          key={index}
          className="perspective group h-48 cursor-pointer"
          onClick={() => handleFlip(index)}
        >
          <div
            className={cn(
              'relative h-full w-full preserve-3d transition-transform duration-700',
              flippedIndex === index ? '[transform:rotateY(180deg)]' : ''
            )}
          >
            {/* Front of card */}
            <div className="absolute h-full w-full backface-hidden">
              <Card className="flex h-full w-full items-center justify-center p-4 text-center">
                <p className="font-semibold text-lg">{card.question}</p>
              </Card>
            </div>
            {/* Back of card */}
            <div className="absolute h-full w-full backface-hidden [transform:rotateY(180deg)]">
              <Card className="flex h-full w-full items-center justify-center bg-accent p-4 text-center text-accent-foreground">
                <p className="text-md">{card.answer}</p>
              </Card>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
