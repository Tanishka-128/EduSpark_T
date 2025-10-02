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
      description: 'Searches YouTube for playable and embeddable videos based on a query.',
      inputSchema: z.object({
        query: z.string().describe('The search query for YouTube.'),
      }),
      outputSchema: z.object({
        youtubeVideos: z.array(YoutubeVideoSchema).describe('A list of recommended YouTube videos.'),
      }),
    },
    async (input) => {
        const youtube = google.youtube({
            version: 'v3',
            auth: process.env.YOUTUBE_API_KEY,
        });

        try {
            const response = await youtube.search.list({
                part: ['snippet'],
                q: input.query,
                type: ['video'],
                videoEmbeddable: 'true',
                videoSyndicated: 'true',
                maxResults: 4,
            });

            if (!response.data.items) {
                return { youtubeVideos: [] };
            }

            const videos = response.data.items.map(item => ({
                title: item.snippet?.title || 'No Title',
                channel: item.snippet?.channelTitle || 'Unknown Channel',
                description: item.snippet?.description || 'No Description',
                videoId: item.id?.videoId || '',
                url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
            })).filter(video => video.videoId);

            return { youtubeVideos: videos };

        } catch (error) {
            console.error('YouTube API Error:', error);
            // In case of API error, return an empty array to prevent app crash
            return { youtubeVideos: [] };
        }
    }
);
