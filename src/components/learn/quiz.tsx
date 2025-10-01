'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Loader2, PartyPopper, Sparkles, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface UserAnswer {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface QuizProps {
  quizData: QuizQuestion[];
  onQuizComplete: (userAnswers: UserAnswer[]) => void;
  feedback: string | null;
  isLoadingFeedback: boolean;
}

export default function Quiz({ quizData, onQuizComplete, feedback, isLoadingFeedback }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  
  const isQuizFinished = currentQuestionIndex >= quizData.length;
  const currentQuestion = quizData[currentQuestionIndex];

  useEffect(() => {
    // When a new quiz is loaded, reset the state
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setUserAnswers([]);
  }, [quizData]);

  const handleNext = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQuestion.answer;
    setUserAnswers(prev => [...prev, {
      question: currentQuestion.question,
      selectedAnswer: selectedOption,
      correctAnswer: currentQuestion.answer,
      isCorrect,
    }]);
    
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      setSelectedOption(null);
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      if (nextIndex >= quizData.length) {
        onQuizComplete([...userAnswers, {
            question: currentQuestion.question,
            selectedAnswer: selectedOption,
            correctAnswer: currentQuestion.answer,
            isCorrect,
        }]);
      }
    }, 1500);
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setUserAnswers([]);
  };

  if (!quizData || quizData.length === 0) {
    return (
        <div className="text-center text-muted-foreground py-10">
            <p>Enter a topic above to generate a quiz.</p>
        </div>
    )
  }

  if (isQuizFinished) {
    const score = userAnswers.filter(a => a.isCorrect).length;
    const percentage = Math.round((score / quizData.length) * 100);
    const incorrectAnswers = userAnswers.filter(a => !a.isCorrect);

    return (
      <div className='flex flex-col items-center justify-center gap-6 rounded-lg border border-dashed p-8 text-center'>
          <PartyPopper className='h-12 w-12 text-primary' />
          <div className='space-y-2'>
            <h3 className='text-2xl font-bold font-headline'>Quiz Complete!</h3>
            <p className='text-lg text-muted-foreground'>
                Your final score is: <span className='font-bold text-foreground'>{score} / {quizData.length}</span> ({percentage}%)
            </p>
          </div>

          {feedback && (
            <div className="mt-4 w-full rounded-md border-l-4 border-primary bg-primary/10 p-4 text-left">
              <h4 className="mb-2 flex items-center gap-2 font-bold text-primary">
                <Sparkles className="h-5 w-5" /> Personalized Feedback
              </h4>
              <p className="text-sm text-primary/90">{feedback}</p>
            </div>
          )}
          {isLoadingFeedback && (
             <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing your results...</span>
             </div>
          )}

          {incorrectAnswers.length > 0 && (
            <div className='w-full text-left space-y-4 pt-4'>
                <h4 className='font-semibold text-lg'>Review Your Mistakes:</h4>
                {incorrectAnswers.map((answer, index) => (
                    <div key={index} className="space-y-2">
                        <p className='font-medium'>{answer.question}</p>
                        <div className='flex items-center gap-2 text-sm text-destructive'>
                            <XCircle className='h-4 w-4 flex-shrink-0' /> Your answer: {answer.selectedAnswer}
                        </div>
                        <div className='flex items-center gap-2 text-sm' style={{ color: 'hsl(var(--chart-2))'}}>
                            <CheckCircle className='h-4 w-4 flex-shrink-0' /> Correct answer: {answer.correctAnswer}
                        </div>
                        {index < incorrectAnswers.length - 1 && <Separator className="mt-4" />}
                    </div>
                ))}
            </div>
          )}
          
          <Button onClick={handleRestart} className="mt-4">Take Another Quiz</Button>
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
