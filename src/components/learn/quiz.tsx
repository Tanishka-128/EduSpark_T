'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, PartyPopper, XCircle } from 'lucide-react';
import { Card } from '../ui/card';

const quizData = [
  {
    question: 'Which of the following is NOT a primary color in the additive RGB color model?',
    options: ['Red', 'Green', 'Purple', 'Blue'],
    answer: 'Purple',
  },
  {
    question: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Madrid'],
    answer: 'Paris',
  },
  {
    question: 'In what year did the first human land on the moon?',
    options: ['1965', '1969', '1972', '1959'],
    answer: '1969',
  }
];

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quizData[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= quizData.length;

  const handleNext = () => {
    if (!selectedOption) return;

    if (selectedOption === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      setSelectedOption(null);
      setCurrentQuestionIndex(prev => prev + 1);
    }, 1500);
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
  };

  if (isQuizFinished) {
    return (
      <div className='flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center'>
          <PartyPopper className='h-12 w-12 text-primary' />
          <h3 className='text-2xl font-bold font-headline'>Quiz Complete!</h3>
          <p className='text-lg text-muted-foreground'>Your final score is: <span className='font-bold text-foreground'>{score} / {quizData.length}</span></p>
          <Button onClick={handleRestart}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {quizData.length}</p>
        <h3 className="mt-1 text-xl font-semibold">{currentQuestion.question}</h3>
      </div>
      <RadioGroup onValueChange={setSelectedOption} value={selectedOption || ''} disabled={showResult}>
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
             <Label key={option}
              htmlFor={option}
              className={cn("flex items-center space-x-3 rounded-md border p-4 transition-all has-[:checked]:border-primary",
                showResult ? "cursor-not-allowed" : "cursor-pointer hover:bg-accent/20",
                showResult && option === currentQuestion.answer && "border-primary bg-primary/10 text-primary",
                showResult && selectedOption === option && option !== currentQuestion.answer && "border-destructive bg-destructive/10 text-destructive"
              )}
            >
              <RadioGroupItem value={option} id={option} />
              <span className="font-medium flex-1">{option}</span>
              {showResult && option === currentQuestion.answer && <CheckCircle className="ml-auto" />}
              {showResult && selectedOption === option && option !== currentQuestion.answer && <XCircle className="ml-auto" />}
            </Label>
          ))}
        </div>
      </RadioGroup>
      <Button onClick={handleNext} disabled={!selectedOption || showResult}>
        {showResult ? 'Checking...' : (currentQuestionIndex === quizData.length - 1 ? 'Finish' : 'Next Question')}
      </Button>
    </div>
  );
}
