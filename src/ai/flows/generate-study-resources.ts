'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending study resources, including YouTube videos and articles,
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

const YoutubeVideoSchema = z.object({
  title: z.string().describe('The title of the YouTube video.'),
  url: z.string().describe('The URL of the YouTube video.'),
  videoId: z.string().describe('The ID of the YouTube video.'),
});

const ArticleSchema = z.object({
    title: z.string().describe('The title of the article.'),
    url: z.string().describe('The URL of the article.'),
});

const GenerateStudyResourcesOutputSchema = z.object({
  youtubeVideos: z.array(YoutubeVideoSchema).describe('A list of recommended YouTube videos.'),
  articles: z.array(ArticleSchema).describe('A list of recommended articles with clickable links.'),
});
export type GenerateStudyResourcesOutput = z.infer<typeof GenerateStudyResourcesOutputSchema>;

export async function generateStudyResources(input: GenerateStudyResourcesInput): Promise<GenerateStudyResourcesOutput> {
  return generateStudyResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyResourcesPrompt',
  input: {schema: GenerateStudyResourcesInputSchema},
  output: {schema: GenerateStudyResourcesOutputSchema},
  prompt: `You are an AI assistant designed to recommend study resources including YouTube videos and articles based on a user's study goal.

  Study Goal: {{{studyGoal}}}

  Recommend a list of relevant YouTube videos and articles that would be helpful for achieving the study goal. For each YouTube video, provide the title, URL, and the video ID. For each article, provide the title and a clickable URL.
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
