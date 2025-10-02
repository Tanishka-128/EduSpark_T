'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { google } from 'googleapis';

const YoutubeVideoSchema = z.object({
  title: z.string().describe('The title of the YouTube video.'),
  channel: z.string().describe("The name of the YouTube channel."),
  url: z.string().describe('The URL of the YouTube video.'),
  description: z.string().describe("A short description of the video."),
  videoId: z.string().describe('The ID of the YouTube video.'),
});

export const searchYoutube = ai.defineTool(
    {
        name: 'searchYoutube',
        description: 'Searches YouTube for relevant, embeddable videos.',
        inputSchema: z.object({
            query: z.string().describe('The search query for videos.'),
        }),
        outputSchema: z.object({
            videos: z.array(YoutubeVideoSchema).describe('A list of recommended YouTube videos.'),
        }),
    },
    async (input) => {
        const youtube = google.youtube('v3');
        const apiKey = process.env.YOUTUBE_API_KEY;

        if (!apiKey) {
            console.error('YOUTUBE_API_KEY is not set in the environment variables.');
            return { videos: [] };
        }

        try {
            const response = await youtube.search.list({
                auth: apiKey,
                part: ['snippet'],
                q: input.query,
                type: ['video'],
                videoEmbeddable: 'true',
                videoSyndicated: 'true',
                maxResults: 4,
            });

            if (!response.data.items) {
                return { videos: [] };
            }

            const videos = response.data.items.map(item => {
                const videoId = item.id?.videoId;
                if (!videoId || !item.snippet) {
                    return null;
                }
                return {
                    videoId,
                    title: item.snippet.title || 'No Title',
                    description: item.snippet.description || 'No Description',
                    channel: item.snippet.channelTitle || 'Unknown Channel',
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                };
            }).filter((v): v is NonNullable<typeof v> => v !== null);
            

            return { videos };

        } catch (error) {
            console.error('YouTube API Error:', error);
            // In case of an API error, return an empty array to prevent app crashes.
            return { videos: [] };
        }
    }
);
