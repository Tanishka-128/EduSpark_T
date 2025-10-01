'use server';
/**
 * @fileOverview An AI Chatbot Tutor for doubt resolution and mindmap generation.
 *
 * - aiChatbotTutor - A function that handles the chatbot tutoring process.
 */

import {ai} from '@/ai/genkit';
import {
    AIChatbotTutorInputSchema,
    AIChatbotTutorOutputSchema,
    type AIChatbotTutorInput,
    type AIChatbotTutorOutput
} from '@/ai/schemas/ai-chatbot-tutor-schema';


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
