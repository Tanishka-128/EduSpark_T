'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { google } from 'googleapis';

const ArticleSchema = z.object({
    title: z.string().describe('The title of the article.'),
    url: z.string().url().describe('The URL of the article.'),
    description: z.string().describe("A short summary or snippet of the article.").optional(),
});

export const searchWebForArticles = ai.defineTool(
    {
        name: 'searchWebForArticles',
        description: 'Searches the web for relevant articles using Google Custom Search.',
        inputSchema: z.object({
            query: z.string().describe('The search query for articles.'),
        }),
        outputSchema: z.object({
            articles: z.array(ArticleSchema).describe('A list of recommended articles.'),
        }),
    },
    async (input) => {
        const customsearch = google.customsearch('v1');

        if (!process.env.GOOGLE_CUSTOM_SEARCH_API_KEY) {
            console.error('Missing GOOGLE_CUSTOM_SEARCH_API_KEY environment variable.');
            return { articles: [] };
        }
        if (!process.env.GOOGLE_CUSTOM_SEARCH_CX) {
            console.error('Missing GOOGLE_CUSTOM_SEARCH_CX environment variable.');
            return { articles: [] };
        }

        try {
            const response = await customsearch.cse.list({
                auth: process.env.GOOGLE_CUSTOM_SEARCH_API_KEY,
                cx: process.env.GOOGLE_CUSTOM_SEARCH_CX,
                q: input.query,
                num: 3, // Fetch 3 articles
            });

            if (!response.data.items) {
                return { articles: [] };
            }
            
            const articles = response.data.items.map(item => ({
                title: item.title || 'No Title',
                url: item.link || '',
                description: item.snippet || 'No description available.',
            })).filter(article => article.url);

            return { articles };

        } catch (error) {
            console.error('Google Custom Search API Error:', error);
            return { articles: [] };
        }
    }
);
