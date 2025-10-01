import { z } from 'zod';

export const GenerateLearnMaterialInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate learning materials.'),
});
export type GenerateLearnMaterialInput = z.infer<typeof GenerateLearnMaterialInputSchema>;

const FlashcardSchema = z.object({
  question: z.string().describe('The question or term for the front of the flashcard.'),
  answer: z.string().describe('The answer or definition for the back of the flashcard.'),
});
export type Flashcard = z.infer<typeof FlashcardSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('A list of 4 multiple-choice options.'),
  answer: z.string().describe('The correct answer to the question.'),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const GenerateLearnMaterialOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe('An array of 4-6 flashcards.'),
  quiz: z.array(QuizQuestionSchema).describe('An array of 10 quiz questions.'),
});
export type GenerateLearnMaterialOutput = z.infer<typeof GenerateLearnMaterialOutputSchema>;
