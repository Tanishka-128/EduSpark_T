'use server';
/**
 * @fileOverview An AI Chatbot Tutor for doubt resolution and mindmap generation.
 *
 * - aiChatbotTutor - A function that handles the chatbot tutoring process.
 */

import {ai} from '@/ai/genkit';
import { z } from 'zod';
import {
    AIChatbotTutorInputSchema,
    AIChatbotTutorOutputSchema,
    type AIChatbotTutorInput,
    type AIChatbotTutorOutput
} from '@/ai/schemas/ai-chatbot-tutor-schema';
import { generateMindmap } from './generate-mindmap';


export async function aiChatbotTutor(input: AIChatbotTutorInput): Promise<AIChatbotTutorOutput> {
  return aiChatbotTutorFlow(input);
}

const mindmapTool = ai.defineTool(
    {
        name: 'createMindmap',
        description: 'Generates a mindmap for a given topic.',
        inputSchema: z.object({ topic: z.string() }),
        outputSchema: z.void(),
    },
    async () => {}
);

const prompt = ai.definePrompt({
  name: 'aiChatbotTutorPrompt',
  input: {schema: AIChatbotTutorInputSchema},
  output: {schema: z.object({
    response: z.string().describe('The response to the student\'s query.'),
  })},
  tools: [mindmapTool],
  prompt: `You are an AI Chatbot Tutor.
  
  Analyze the student's query: "{{query}}".

  If the query is a request to generate a mindmap, use the createMindmap tool with the identified topic.
  
  Otherwise, provide a helpful, text-based answer to the student's question. Be precise and avoid hallucination.
  `,
});

const aiChatbotTutorFlow = ai.defineFlow(
  {
    name: 'aiChatbotTutorFlow',
    inputSchema: AIChatbotTutorInputSchema,
    outputSchema: AIChatbotTutorOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);

    const toolRequest = llmResponse.toolRequests.find(req => req.tool.name === 'createMindmap');

    if (toolRequest) {
        const topic = toolRequest.input.topic;
        const mindmap = await generateMindmap({ topic });
        return {
            response: `Here is a mindmap for "${topic}":`,
            mindmap: mindmap,
        };
    }
    
    const responseText = llmResponse.output?.response || "I'm sorry, I couldn't process your request. Please try again.";

    return {
        response: responseText
    };
  }
);
