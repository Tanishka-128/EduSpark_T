'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing a user's quiz results and providing personalized feedback.
 *
 * - analyzeQuizResults - A function that takes quiz questions, user answers, and a topic to return feedback.
 */

import { ai } from '@/ai/genkit';
import {
    AnalyzeQuizResultsInputSchema,
    AnalyzeQuizResultsOutputSchema,
    type AnalyzeQuizResultsInput,
    type AnalyzeQuizResultsOutput
} from '@/ai/schemas/analyze-quiz-results-schema';


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
