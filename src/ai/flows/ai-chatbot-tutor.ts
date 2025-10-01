'use server';
/**
 * @fileOverview An AI Chatbot Tutor for doubt resolution and mindmap generation.
 *
 * - aiChatbotTutor - A function that handles the chatbot tutoring process.
 * - AIChatbotTutorInput - The input type for the aiChatbotTutor function.
 * - AIChatbotTutorOutput - The return type for the aiChatbotTutor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatbotTutorInputSchema = z.object({
  query: z.string().describe('The query or doubt the student has.'),
});
export type AIChatbotTutorInput = z.infer<typeof AIChatbotTutorInputSchema>;

const AIChatbotTutorOutputSchema = z.object({
  response: z.string().describe('The response from the AI Chatbot Tutor.'),
  mindmap: z.string().optional().describe('The generated mindmap for the topic, if requested.'),
});
export type AIChatbotTutorOutput = z.infer<typeof AIChatbotTutorOutputSchema>;

export async function aiChatbotTutor(input: AIChatbotTutorInput): Promise<AIChatbotTutorOutput> {
  return aiChatbotTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotTutorPrompt',
  input: {schema: AIChatbotTutorInputSchema},
  output: {schema: AIChatbotTutorOutputSchema},
  prompt: `You are an AI Chatbot Tutor designed to help students with their doubts and generate mindmaps for topics.

  Respond to the following query from the student:
  {{query}}

  If the student asks for a mindmap, generate one for the topic. Otherwise, leave the mindmap field blank.
  Be precise and avoid hallucination.
  `,
});

const aiChatbotTutorFlow = ai.defineFlow(
  {
    name: 'aiChatbotTutorFlow',
    inputSchema: AIChatbotTutorInputSchema,
    outputSchema: AIChatbotTutorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
