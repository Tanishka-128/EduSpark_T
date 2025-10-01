import { z } from 'zod';

const QuizQuestionSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const UserAnswerSchema = z.object({
  question: z.string(),
  selectedAnswer: z.string(),
  isCorrect: z.boolean(),
  correctAnswer: z.string(),
});

export const AnalyzeQuizResultsInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  questions: z.array(QuizQuestionSchema).describe('The original quiz questions and their correct answers.'),
  userAnswers: z.array(UserAnswerSchema).describe("The user's answers to the quiz questions."),
});
export type AnalyzeQuizResultsInput = z.infer<typeof AnalyzeQuizResultsInputSchema>;

export const AnalyzeQuizResultsOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback and suggestions for improvement for the student.'),
});
export type AnalyzeQuizResultsOutput = z.infer<typeof AnalyzeQuizResultsOutputSchema>;
