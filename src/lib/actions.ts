'use server';

import { aiChatbotTutor } from '@/ai/flows/ai-chatbot-tutor';
import { generateStudyResources } from '@/ai/flows/generate-study-resources';
import { generateLearnMaterial } from '@/ai/flows/generate-learn-material';
import { analyzeQuizResults } from '@/ai/flows/analyze-quiz-results';
import type { GenerateStudyResourcesInput } from '@/ai/schemas/generate-study-resources-schema';
import type { AIChatbotTutorInput } from '@/ai/schemas/ai-chatbot-tutor-schema';
import type { GenerateLearnMaterialInput } from '@/ai/schemas/generate-learn-material-schema';
import type { AnalyzeQuizResultsInput } from '@/ai/schemas/analyze-quiz-results-schema';

export async function getStudyResources(input: GenerateStudyResourcesInput) {
  try {
    const output = await generateStudyResources(input);
    // Basic URL validation and ID extraction
    if (output.youtubeVideos) {
      output.youtubeVideos.forEach(video => {
        if (video.url) {
          try {
            const url = new URL(video.url);
            let videoId = url.searchParams.get('v');
            if (videoId) {
              video.videoId = videoId;
            } else {
              const pathParts = url.pathname.split('/');
              const lastPart = pathParts[pathParts.length - 1];
              if (lastPart) {
                video.videoId = lastPart;
              }
            }
          } catch (e) {
            console.error('Invalid video URL:', video.url);
            // Attempt to extract from malformed URLs
            const videoIdMatch = video.url.match(/(?:v=|youtu\.be\/|\/embed\/|\/shorts\/)([^&?#]+)/);
            if (videoIdMatch && videoIdMatch[1]) {
              video.videoId = videoIdMatch[1];
            }
          }
        }
      });
    }
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate study resources.';
    return { success: false, error: errorMessage };
  }
}

export async function getTutorResponse(input: AIChatbotTutorInput) {
  try {
    const output = await aiChatbotTutor(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get a response from the tutor.';
    return { success: false, error: errorMessage };
  }
}

export async function generateLearnMaterial(input: GenerateLearnMaterialInput) {
    try {
        const output = await generateLearnMaterial(input);
        return { success: true, data: output };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate learning materials.';
        return { success: false, error: errorMessage };
    }
}

export async function analyzeQuizResults(input: AnalyzeQuizResultsInput) {
    try {
        const output = await analyzeQuizResults(input);
        return { success: true, data: output };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to analyze quiz results.';
        return { success: false, error: errorMessage };
    }
}
