import { z } from 'zod';

const UserAnswerSchema = z.object({
  question: z.string(),
  selectedAnswer: z.string(),
  isCorrect: z.boolean(),
  correctAnswer: z.string(),
});

export const AnalyzeQuizResultsInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  userAnswers: z.array(UserAnswerSchema).describe("The user's answers to the quiz questions, focusing on the incorrect ones."),
});
export type AnalyzeQuizResultsInput = z.infer<typeof AnalyzeQuizResultsInputSchema>;

const DetailedFeedbackSchema = z.object({
    question: z.string().describe("The question the user got wrong."),
    explanation: z.string().describe("A concise explanation of why the user's answer was incorrect and what the correct concept is.")
});

export const AnalyzeQuizResultsOutputSchema = z.object({
  overallFeedback: z.string().describe('A brief, encouraging summary of the user\'s performance.'),
  improvementSuggestions: z.array(z.string()).describe('A list of 2-3 specific, actionable tips for improvement based on the incorrect answers.'),
  detailedFeedback: z.array(DetailedFeedbackSchema).describe('Personalized feedback for each incorrect answer.'),
});
export type AnalyzeQuizResultsOutput = z.infer<typeof AnalyzeQuizResultsOutputSchema>;
    