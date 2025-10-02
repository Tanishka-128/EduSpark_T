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
- Question: "{{question}}"
  Student's Answer: "{{selectedAnswer}}"
  Correct Answer: "{{correctAnswer}}"
{{/each}}

Based on this, provide the following:
1.  **overallFeedback**: A brief, encouraging summary of the student's performance (1-2 sentences).
2.  **improvementSuggestions**: A list of 2-3 specific, actionable study tips to help them improve on the concepts they struggled with.
3.  **detailedFeedback**: For each incorrect answer, provide a concise explanation ("explanation") for the specific "question" detailing why their answer was wrong and clarifying the correct concept.
`,
});

const analyzeQuizResultsFlow = ai.defineFlow(
  {
    name: 'analyzeQuizResultsFlow',
    inputSchema: AnalyzeQuizResultsInputSchema,
    outputSchema: AnalyzeQuizResultsOutputSchema,
  },
  async (input) => {
    const incorrectAnswers = input.userAnswers.filter(a => !a.isCorrect);

    // If all answers are correct, return a congratulatory message without calling the AI.
    if (incorrectAnswers.length === 0) {
        return {
            overallFeedback: "Excellent work! You answered all questions correctly. You have a solid understanding of this topic.",
            improvementSuggestions: [],
            detailedFeedback: []
        };
    }
    const { output } = await prompt({ topic: input.topic, userAnswers: incorrectAnswers });
    return output!;
  }
);
    