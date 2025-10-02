'use server';
/**
 * @fileOverview A dedicated flow for generating a hierarchical mindmap for a given topic.
 *
 * - generateMindmap - A function that takes a topic and returns a structured mindmap object.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { 
    GenerateMindmapInputSchema, 
    MindMapSchema,
    type GenerateMindmapInput
} from '@/ai/schemas/mind-map-schema';
import type { MindMap } from '@/ai/schemas/mind-map-schema';

export async function generateMindmap(input: GenerateMindmapInput): Promise<MindMap> {
  return generateMindmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMindmapPrompt',
  input: { schema: GenerateMindmapInputSchema },
  output: { schema: MindMapSchema },
  prompt: `You are an expert at creating structured, hierarchical mindmaps for educational purposes.
Generate a mindmap for the topic: "{{topic}}".

The mindmap must be structured as a nested object with the following properties for each node:
- "id": A unique string identifier for the node.
- "title": The name of the concept.
- "children": An array of nested node objects for sub-topics.

The structure should be:
1. A single root node representing the main topic.
2. Several main sub-topics as children of the root node.
3. Each sub-topic should have its own children representing key points or facts.

Ensure the mindmap is clear, accurate, and well-organized to help a student understand the topic's structure and connections.
`,
});

const generateMindmapFlow = ai.defineFlow(
  {
    name: 'generateMindmapFlow',
    inputSchema: GenerateMindmapInputSchema,
    outputSchema: MindMapSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
