'use server';

import { aiChatbotTutor, AIChatbotTutorInput } from '@/ai/flows/ai-chatbot-tutor';
import { generateStudyResources, GenerateStudyResourcesInput } from '@/ai/flows/generate-study-resources';

export async function getStudyResources(input: GenerateStudyResourcesInput) {
  try {
    const output = await generateStudyResources(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate study resources.' };
  }
}

export async function getTutorResponse(input: AIChatbotTutorInput) {
  try {
    const output = await aiChatbotTutor(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get a response from the tutor.' };
  }
}
