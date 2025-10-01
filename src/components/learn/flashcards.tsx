'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const flashcardData = [
  { q: 'What is the powerhouse of the cell?', a: 'Mitochondria' },
  { q: 'What does H2O stand for?', a: 'Water' },
  { q: 'What is the theory of relativity?', a: 'Developed by Albert Einstein, it consists of two parts: special relativity and general relativity.' },
  { q: 'What force keeps planets in orbit around the sun?', a: 'Gravity' },
];

export default function Flashcards() {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const handleFlip = (index: number) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {flashcardData.map((card, index) => (
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
                <p className="font-semibold text-lg">{card.q}</p>
              </Card>
            </div>
            {/* Back of card */}
            <div className="absolute h-full w-full backface-hidden [transform:rotateY(180deg)]">
              <Card className="flex h-full w-full items-center justify-center bg-accent p-4 text-center text-accent-foreground">
                <p className="text-md">{card.a}</p>
              </Card>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
