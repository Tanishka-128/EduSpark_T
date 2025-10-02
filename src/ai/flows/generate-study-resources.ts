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

export async function generateStudyResources(input: GenerateStudyResourcesInput): Promise<GenerateStudyResourcesOutput> {
  return generateStudyResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyResourcesPrompt',
  input: {schema: GenerateStudyResourcesInputSchema},
  output: {schema: GenerateStudyResourcesOutputSchema},
  prompt: `You are a smart study assistant that fetches YouTube video recommendations. You will act as if you are making a call to the YouTube Data API v3.

For the given topic, find the top 3-4 videos using the following API parameters:
- 'part': 'snippet'
- 'q': '{{{studyGoal}}}'
- 'type': 'video'
- 'videoEmbeddable': 'true'
- 'videoSyndicated': 'true'
- 'maxResults': 4

From the API response, filter out any results that are private or deleted. For each valid video, provide the following details from the 'snippet' object:
- \`title\`: The video title.
- \`channelTitle\`: The name of the channel.
- \`description\`: A short summary of the video.
- \`url\`: The full watch URL (e.g., https://www.youtube.com/watch?v={videoId}).
- \`videoId\`: The ID of the video.

In addition, find **2–3 related articles or blog posts** on the same topic from reputable, high-traffic educational websites (like universities, established learning platforms, or well-known publications).
- Return their title and a valid, clickable URL.
- **Crucially, do not invent, guess, or create URLs. Only return URLs you have verified exist from your training data.**

Output must be structured as JSON with two keys:
- \`youtubeVideos\`: an array of \`{ title, channel, url, description, videoId }\`
- \`articles\`: an array of \`{ title, url }\`

Rules:
- Only include working YouTube URLs and valid article links.
- Do not hallucinate links or video IDs.
- Ensure the output strictly follows the requested JSON format.

Topic: {{{studyGoal}}}
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
