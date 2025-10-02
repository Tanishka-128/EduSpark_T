import { z } from 'zod';

// Define a recursive schema for a mind map node.
export const MindMapNodeSchema: z.ZodType<MindMap> = z.object({
  id: z.string().describe('A unique identifier for the node.'),
  title: z.string().describe('The title or main idea of this node.'),
  children: z.array(z.lazy(() => MindMapNodeSchema)).optional().describe('An array of child nodes, representing sub-topics.'),
});

export type MindMap = {
  id: string;
  title: string;
  children?: MindMap[];
};

// This is the top-level schema for the entire mindmap structure.
export const MindMapSchema = MindMapNodeSchema;

export const GenerateMindmapInputSchema = z.object({
    topic: z.string().describe('The central topic for the mindmap.'),
});
export type GenerateMindmapInput = z.infer<typeof GenerateMindmapInputSchema>;
