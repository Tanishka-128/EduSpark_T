'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-study-resources.ts';
import '@/ai-chatbot-tutor.ts';
import '@/ai/flows/generate-learn-material.ts';
import '@/ai/flows/analyze-quiz-results.ts';
