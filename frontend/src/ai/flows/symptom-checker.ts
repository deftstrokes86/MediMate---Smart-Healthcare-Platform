
'use server';

/**
 * @fileOverview This file defines a Genkit flow for an AI-powered symptom checker.
 *
 * The symptom checker allows users to input their symptoms and receive a list of possible ailments with percentage certainty.
 *
 * @exports symptomChecker - The main function to initiate the symptom checker flow.
 * @exports SymptomCheckerInput - The input type for the symptomChecker function.
 * @exports SymptomCheckerOutput - The output type for the symptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the patient\'s symptoms.'),
});

export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const AilmentSchema = z.object({
  ailment: z.string().describe('The name of the possible ailment.'),
  certainty: z
    .number()
    .describe(
      'The percentage certainty (0-100) that the patient has this ailment.'
    ),
});

const SymptomCheckerOutputSchema = z.array(AilmentSchema).describe(
  'A list of possible ailments with percentage certainty.'
);

export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are a medical AI assistant that analyzes patient symptoms and provides a list of possible ailments with percentage certainty.

  Analyze the following symptoms:
  {{symptoms}}

  Provide a list of possible ailments with percentage certainty. The certainty should be a number from 0 to 100. Return a JSON array. For example:
  
  
  [
      {
        "ailment": "Common Cold",
        "certainty": 75
      },
      {
        "ailment": "Influenza",
        "certainty": 60
      }
  ]
  `,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await symptomCheckerPrompt(input);
    return output!;
  }
);
