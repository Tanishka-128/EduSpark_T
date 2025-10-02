import { z } from 'zod';

export const GenerateStudyRoadmapInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate the learning roadmap.'),
});
export type GenerateStudyRoadmapInput = z.infer<typeof GenerateStudyRoadmapInputSchema>;

const RoadmapStepSchema = z.object({
  subtopic: z.string().describe('The specific concept or subtopic to learn in this step.'),
  resources: z.array(z.string().url()).describe('A list of URLs for articles, videos, or exercises.'),
  time: z.string().describe('The estimated time to master the subtopic (e.g., "2h", "1d").'),
  milestone: z.string().describe('The key skill or knowledge achieved at this stage.'),
});

const RoadmapLevelSchema = z.object({
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  steps: z.array(RoadmapStepSchema),
});

export const GenerateStudyRoadmapOutputSchema = z.object({
  topic: z.string().describe('The central topic of the roadmap.'),
  roadmap: z.array(RoadmapLevelSchema).describe('An array of learning levels, each with its own steps.'),
});
export type GenerateStudyRoadmapOutput = z.infer<typeof GenerateStudyRoadmapOutputSchema>;
