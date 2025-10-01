import {z} from 'genkit';

export const AIChatbotTutorInputSchema = z.object({
  query: z.string().describe('The query or doubt the student has.'),
});
export type AIChatbotTutorInput = z.infer<typeof AIChatbotTutorInputSchema>;

export const AIChatbotTutorOutputSchema = z.object({
  response: z.string().describe('The response from the AI Chatbot Tutor.'),
  mindmap: z.string().optional().describe('The generated mindmap for the topic, if requested.'),
});
export type AIChatbotTutorOutput = z.infer<typeof AIChatbotTutorOutputSchema>;
