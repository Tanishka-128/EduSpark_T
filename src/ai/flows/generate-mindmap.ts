'use server';
/**
 * @fileOverview A dedicated flow for generating a hierarchical mindmap for a given topic.
 *
 * - generateMindmap - A function that takes a topic and returns a structured mindmap object.
 */

import { ai } from '@/ai/genkit';
import { 
    GenerateMindmapInputSchema, 
    MindMapSchema,
    type GenerateMindmapInput,
    type MindMap
} from '@/ai/schemas/mind-map-schema';

export async function generateMindmap(input: GenerateMindmapInput): Promise<MindMap> {
  return generateMindmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMindmapPrompt',
  input: { schema: GenerateMindmapInputSchema },
  output: { schema: MindMapSchema },
  prompt: `You are an expert AI developer that generates highly accurate, structured mindmaps for any topic provided by a student.

Generate a detailed mindmap for the topic: "{{topic}}".

The mindmap must be hierarchical with main branches and sub-branches. It should include key concepts, definitions, examples, and connections between topics. Each branch should have 2-5 sub-branches, making it neither too sparse nor too dense. The content must be concise, accurate, and educational.

The output must be a JSON object with the following structure:
{
  "topic": "{{topic}}",
  "mindmap": [
    {"branch": "Main Concept 1", "subbranches": ["sub1", "sub2", "sub3"]},
    {"branch": "Main Concept 2", "subbranches": ["sub1", "sub2"]}
  ]
}
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
