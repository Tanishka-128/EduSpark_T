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
  prompt: `You are a smart study assistant. Your task is to act as a helpful AI assistant to find relevant articles for a given study goal.

Study Goal: {{{studyGoal}}}

1.  **Find Articles**: Find 2-3 related articles or blog posts. Do not invent or guess URLs; only return URLs you know to be valid from reputable, high-traffic educational domains.

Ensure your output for articles strictly follows the requested JSON format, but leave the youtubeVideos array empty.
  `,
});

const generateStudyResourcesFlow = ai.defineFlow(
  {
    name: 'generateStudyResourcesFlow',
    inputSchema: GenerateStudyResourcesInputSchema,
    outputSchema: GenerateStudyResourcesOutputSchema,
  },
  async input => {
    // Call the YouTube tool and the article-finding prompt in parallel
    const [youtubeResult, llmResponse] = await Promise.all([
        searchYoutube({ query: input.studyGoal }),
        prompt(input),
    ]);
    
    // Combine the results
    const articles = llmResponse.output?.articles || [];
    const youtubeVideos = youtubeResult.videos;

    return {
        youtubeVideos,
        articles,
    };
  }
);
