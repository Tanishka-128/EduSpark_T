'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-study-resources';
import '@/ai/flows/ai-chatbot-tutor';
import '@/ai/flows/generate-learn-material';
import '@/ai/flows/analyze-quiz-results';
import '@/ai/flows/generate-mindmap';
import '@/ai/flows/generate-study-roadmap';
