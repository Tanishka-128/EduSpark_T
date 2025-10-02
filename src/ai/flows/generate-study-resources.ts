'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending study resources, including YouTube videos and articles,
 * based on a user-specified study goal.
 *
 * - generateStudyResources - A function that takes a study goal as input and returns a list of study resources.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateStudyResourcesInputSchema,
    GenerateStudyResourcesOutputSchema,
    type GenerateStudyResourcesInput,
    type GenerateStudyResourcesOutput,
} from '@/ai/schemas/generate-study-resources-schema';
import { searchYoutube } from '../tools/youtube';


export async function generateStudyResources(input: GenerateStudyResourcesInput): Promise<GenerateStudyResourcesOutput> {
  return generateStudyResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyResourcesPrompt',
  input: {schema: GenerateStudyResourcesInputSchema},
  output: {schema: GenerateStudyResourcesOutputSchema},
  tools: [searchYoutube],
  prompt: `You are a smart study assistant. Your task is to find relevant articles and YouTube videos for a given study goal.

Study Goal: {{{studyGoal}}}

1.  **Find YouTube Videos**: Use the \`searchYoutube\` tool with a concise, relevant query based on the study goal to find 3-4 helpful videos.
2.  **Find Articles**: Find 2-3 related articles or blog posts. Do not invent or guess URLs; only return URLs you know to be valid from reputable, high-traffic educational domains.

Ensure the output strictly follows the requested JSON format.
  `,
});

const generateStudyResourcesFlow = ai.defineFlow(
  {
    name: 'generateStudyResourcesFlow',
    inputSchema: GenerateStudyResourcesInputSchema,
    outputSchema: GenerateStudyResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
