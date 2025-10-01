'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending study resources, including YouTube videos,
 * based on a user-specified study goal.
 *
 * - generateStudyResources - A function that takes a study goal as input and returns a list of study resources.
 * - GenerateStudyResourcesInput - The input type for the generateStudyResources function.
 * - GenerateStudyResourcesOutput - The return type for the generateStudyResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyResourcesInputSchema = z.object({
  studyGoal: z.string().describe('The study goal specified by the user.'),
});
export type GenerateStudyResourcesInput = z.infer<typeof GenerateStudyResourcesInputSchema>;

const GenerateStudyResourcesOutputSchema = z.object({
  resources: z.array(z.string()).describe('A list of recommended study resources.'),
  youtubeVideos: z.array(z.string()).describe('A list of recommended YouTube video URLs.'),
});
export type GenerateStudyResourcesOutput = z.infer<typeof GenerateStudyResourcesOutputSchema>;

export async function generateStudyResources(input: GenerateStudyResourcesInput): Promise<GenerateStudyResourcesOutput> {
  return generateStudyResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyResourcesPrompt',
  input: {schema: GenerateStudyResourcesInputSchema},
  output: {schema: GenerateStudyResourcesOutputSchema},
  prompt: `You are an AI assistant designed to recommend study resources and YouTube videos based on a user's study goal.

  Study Goal: {{{studyGoal}}}

  Recommend a list of study resources and relevant YouTube video URLs that would be helpful for achieving the study goal.  The resources and URLs should be returned as simple lists.
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
