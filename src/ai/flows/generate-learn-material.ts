'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating learning materials (flashcards and a quiz)
 * based on a user-specified topic.
 *
 * - generateLearnMaterial - A function that takes a topic and returns flashcards and quiz questions.
 * - GenerateLearnMaterialInput - The input type for the generateLearnMaterial function.
 * - GenerateLearnMaterialOutput - The return type for the generateLearnMaterial function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateLearnMaterialInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate learning materials.'),
});
export type GenerateLearnMaterialInput = z.infer<typeof GenerateLearnMaterialInputSchema>;

const FlashcardSchema = z.object({
  question: z.string().describe('The question or term for the front of the flashcard.'),
  answer: z.string().describe('The answer or definition for the back of the flashcard.'),
});
export type Flashcard = z.infer<typeof FlashcardSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('A list of 4 multiple-choice options.'),
  answer: z.string().describe('The correct answer to the question.'),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const GenerateLearnMaterialOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe('An array of 4-6 flashcards.'),
  quiz: z.array(QuizQuestionSchema).describe('An array of 10 quiz questions.'),
});
export type GenerateLearnMaterialOutput = z.infer<typeof GenerateLearnMaterialOutputSchema>;

export async function generateLearnMaterial(input: GenerateLearnMaterialInput): Promise<GenerateLearnMaterialOutput> {
  return generateLearnMaterialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearnMaterialPrompt',
  input: { schema: GenerateLearnMaterialInputSchema },
  output: { schema: GenerateLearnMaterialOutputSchema },
  prompt: `You are an AI expert in creating educational content. Generate a set of learning materials based on the following topic.

Topic: {{{topic}}}

Please generate:
1.  A set of 4-6 flashcards with questions and answers covering the key concepts of the topic.
2.  A multiple-choice quiz with exactly 10 questions. Each question should have 4 options, and one of the options must be the correct answer.

Ensure the content is accurate and directly related to the provided topic.
`,
});

const generateLearnMaterialFlow = ai.defineFlow(
  {
    name: 'generateLearnMaterialFlow',
    inputSchema: GenerateLearnMaterialInputSchema,
    outputSchema: GenerateLearnMaterialOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
