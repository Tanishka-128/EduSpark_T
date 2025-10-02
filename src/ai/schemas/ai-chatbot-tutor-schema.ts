import {z} from 'genkit';
import { MindMapSchema } from './mind-map-schema';

export const AIChatbotTutorInputSchema = z.object({
  query: z.string().describe('The query or doubt the student has.'),
});
export type AIChatbotTutorInput = z.infer<typeof AIChatbotTutorInputSchema>;

export const AIChatbotTutorOutputSchema = z.object({
  response: z.string().describe('The response from the AI Chatbot Tutor.'),
  mindmap: MindMapSchema.optional().describe('The generated mindmap for the topic, if requested.'),
});
export type AIChatbotTutorOutput = z.infer<typeof AIChatbotTutorOutputSchema>;
