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
  prompt: `You are a smart study assistant. The student will provide a topic. Based on this topic:

1. Search YouTube and recommend the **top 3–4 videos** with the highest views and likes.
   - Always return a valid working YouTube URL.
   - Also return the video title, channel name, and short description.
   - Make sure the links are clickable and not broken.

2. Find **2–3 related articles/blogs** on the same topic.
   - Return their title and clickable URL.
   - Ensure the links work.

3. Output must be structured as JSON with two keys:
   - \`youtubeVideos\`: an array of \`{ title, channel, url, description, videoId }\`
   - \`articles\`: an array of \`{ title, url }\`

Rules:
- Only include working YouTube URLs and valid article links.
- Do not hallucinate links.
- Ensure the output follows JSON strictly.

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
