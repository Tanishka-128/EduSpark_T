import {z} from 'genkit';

export const YoutubeVideoSchema = z.object({
  title: z.string().describe('The title of the YouTube video.'),
  channel: z.string().describe("The name of the YouTube channel."),
  url: z.string().describe('The URL of the YouTube video.'),
  description: z.string().describe("A short description of the video."),
  videoId: z.string().describe('The ID of the YouTube video.'),
});
