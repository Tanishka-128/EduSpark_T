'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating learning materials (flashcards and a quiz)
 * based on a user-specified topic.
 *
 * - generateLearnMaterial - A function that takes a topic and returns flashcards and quiz questions.
 */

import { ai } from '@/ai/genkit';
import {
    GenerateLearnMaterialInputSchema,
    GenerateLearnMaterialOutputSchema,
    type GenerateLearnMaterialInput,
    type GenerateLearnMaterialOutput,
} from '@/ai/schemas/generate-learn-material-schema';


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
