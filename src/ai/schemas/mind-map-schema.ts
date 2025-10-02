import { z } from 'zod';

const MindMapBranchSchema = z.object({
    branch: z.string().describe("The name of the main concept or branch."),
    subbranches: z.array(z.string()).describe("An array of key points, facts, or sub-topics related to the main branch.")
});

export const MindMapSchema = z.object({
    topic: z.string().describe("The main topic of the mindmap."),
    mindmap: z.array(MindMapBranchSchema).describe("An array of main branches, each with its own sub-branches.")
});
export type MindMap = z.infer<typeof MindMapSchema>;


export const GenerateMindmapInputSchema = z.object({
    topic: z.string().describe('The central topic for the mindmap.'),
});
export type GenerateMindmapInput = z.infer<typeof GenerateMindmapInputSchema>;
