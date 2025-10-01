import {z} from 'genkit';

export const GenerateStudyResourcesInputSchema = z.object({
  studyGoal: z.string().describe('The study goal specified by the user.'),
});
export type GenerateStudyResourcesInput = z.infer<typeof GenerateStudyResourcesInputSchema>;

const YoutubeVideoSchema = z.object({
  title: z.string().describe('The title of the YouTube video.'),
  channel: z.string().describe("The name of the YouTube channel."),
  url: z.string().describe('The URL of the YouTube video.'),
  description: z.string().describe("A short description of the video."),
  videoId: z.string().describe('The ID of the YouTube video.'),
});

const ArticleSchema = z.object({
    title: z.string().describe('The title of the article.'),
    url: z.string().describe('The URL of the article.'),
});

export const GenerateStudyResourcesOutputSchema = z.object({
  youtubeVideos: z.array(YoutubeVideoSchema).describe('A list of recommended YouTube videos.'),
  articles: z.array(ArticleSchema).describe('A list of recommended articles with clickable links.'),
});
export type GenerateStudyResourcesOutput = z.infer<typeof GenerateStudyResourcesOutputSchema>;
