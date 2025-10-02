
import {z} from 'genkit';
import { YoutubeVideoSchema } from './youtube-search-schema';

export const GenerateStudyResourcesInputSchema = z.object({
  studyGoal: z.string().describe('The study goal specified by the user.'),
});
export type GenerateStudyResourcesInput = z.infer<typeof GenerateStudyResourcesInputSchema>;

export const GenerateStudyResourcesOutputSchema = z.object({
  youtubeVideos: z.array(YoutubeVideoSchema).describe('A list of recommended YouTube videos.'),
});
export type GenerateStudyResourcesOutput = z.infer<typeof GenerateStudyResourcesOutputSchema>;
