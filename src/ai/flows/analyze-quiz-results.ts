'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing a user's quiz results and providing personalized feedback.
 *
 * - analyzeQuizResults - A function that takes quiz questions, user answers, and a topic to return feedback.
 * - AnalyzeQuizResultsInput - The input type for the analyzeQuizResults function.
 * - AnalyzeQuizResultsOutput - The return type for the analyzeQuizResults function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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


export async function analyzeQuizResults(input: AnalyzeQuizResultsInput): Promise<AnalyzeQuizResultsOutput> {
  return analyzeQuizResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeQuizResultsPrompt',
  input: { schema: AnalyzeQuizResultsInputSchema },
  output: { schema: AnalyzeQuizResultsOutputSchema },
  prompt: `You are an expert AI tutor. A student has just completed a quiz on the topic "{{topic}}".
Analyze their performance based on the questions they answered incorrectly.

Student's incorrect answers:
{{#each userAnswers}}
  {{#unless isCorrect}}
  - Question: "{{question}}"
    Student's Answer: "{{selectedAnswer}}"
    Correct Answer: "{{correctAnswer}}"
  {{/unless}}
{{/each}}

Based on this, provide personalized, encouraging, and constructive feedback.
- Identify the key concepts or areas where the student is struggling.
- Suggest specific areas to focus on for improvement.
- Keep the feedback concise and actionable (2-3 sentences).
`,
});

const analyzeQuizResultsFlow = ai.defineFlow(
  {
    name: 'analyzeQuizResultsFlow',
    inputSchema: AnalyzeQuizResultsInputSchema,
    outputSchema: AnalyzeQuizResultsOutputSchema,
  },
  async (input) => {
    // If all answers are correct, return a congratulatory message without calling the AI.
    if (input.userAnswers.every(a => a.isCorrect)) {
        return {
            feedback: "Excellent work! You answered all questions correctly. You have a solid understanding of this topic."
        };
    }
    const { output } = await prompt(input);
    return output!;
  }
);
