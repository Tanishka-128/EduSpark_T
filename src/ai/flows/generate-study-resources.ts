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
  prompt: `You are a smart study assistant that fetches YouTube video recommendations and relevant articles for a given study goal.

For the given topic, find 3-4 relevant YouTube videos that would be helpful for a student. For each video, provide:
- \`title\`: The video title.
- \`channel\`: The name of the channel.
- \`description\`: A short summary of the video.
- \`url\`: The full watch URL (e.g., https://www.youtube.com/watch?v={videoId}).
- \`videoId\`: The ID of the video.

In addition, find **2–3 related articles or blog posts** on the same topic from reputable educational websites.
- Return their title and a valid, clickable URL.

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
