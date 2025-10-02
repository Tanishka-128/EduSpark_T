'use server';

import {z} from 'genkit';
import { YoutubeVideoSchema } from './youtube-search-schema';

export const GenerateStudyResourcesInputSchema = z.object({
  studyGoal: z.string().describe('The study goal specified by the user.'),
});
export type GenerateStudyResourcesInput = z.infer<typeof GenerateStudyResourcesInputSchema>;

const ArticleSchema = z.object({
    title: z.string().describe('The title of the article.'),
    url: z.string().url().describe('The URL of the article.'),
    description: z.string().describe("A short summary or snippet of the article.").optional(),
});

export const GenerateStudyResourcesOutputSchema = z.object({
  youtubeVideos: z.array(YoutubeVideoSchema).describe('A list of recommended YouTube videos.'),
  articles: z.array(ArticleSchema).describe('A list of recommended articles with clickable links.'),
});
export type GenerateStudyResourcesOutput = z.infer<typeof GenerateStudyResourcesOutputSchema>;
