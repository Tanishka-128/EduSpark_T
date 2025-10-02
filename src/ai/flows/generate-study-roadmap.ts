'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a step-by-step learning roadmap for a given topic.
 *
 * - generateStudyRoadmap - A function that takes a topic and returns a structured roadmap.
 */

import { ai } from '@/ai/genkit';
import {
    GenerateStudyRoadmapInputSchema,
    GenerateStudyRoadmapOutputSchema,
    type GenerateStudyRoadmapInput,
    type GenerateStudyRoadmapOutput,
} from '@/ai/schemas/generate-study-roadmap-schema';

export async function generateStudyRoadmap(input: GenerateStudyRoadmapInput): Promise<GenerateStudyRoadmapOutput> {
    return generateStudyRoadmapFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateStudyRoadmapPrompt',
    input: { schema: GenerateStudyRoadmapInputSchema },
    output: { schema: GenerateStudyRoadmapOutputSchema },
    prompt: `You are an AI expert in creating educational roadmaps. For the given topic, generate a step-by-step learning plan structured into "Beginner", "Intermediate", and "Advanced" levels.

Topic: {{{topic}}}

For each level, provide a list of sequential steps. Each step must include:
1. 'subtopic': A clear, concise title for the concept to learn.
2. 'resources': An array of 1-2 high-quality online resources (articles or videos) to learn the subtopic. Ensure links are valid.
3. 'time': A realistic time estimate to master the subtopic (e.g., "2h", "1d").
4. 'milestone': A brief description of the key skill or knowledge gained after completing that step.

The output must be a valid JSON object strictly following this structure:
{
  "topic": "topic_name",
  "roadmap": [
    {"level": "Beginner", "steps": [{"subtopic": "...", "resources": ["..."], "time": "...", "milestone": "..."}]},
    {"level": "Intermediate", "steps": [...]},
    {"level": "Advanced", "steps": [...]}
  ]
}
`,
});


const generateStudyRoadmapFlow = ai.defineFlow(
    {
        name: 'generateStudyRoadmapFlow',
        inputSchema: GenerateStudyRoadmapInputSchema,
        outputSchema: GenerateStudyRoadmapOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
