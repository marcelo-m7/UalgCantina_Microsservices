// src/ai/flows/suggest-menu-pairings.ts
'use server';

/**
 * @fileOverview An AI agent for suggesting menu pairings based on existing dishes and side dishes.
 *
 * - suggestMenuPairings - A function that handles the menu pairing suggestion process.
 * - SuggestMenuPairingsInput - The input type for the suggestMenuPairings function.
 * - SuggestMenuPairingsOutput - The return type for the suggestMenuPairings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMenuPairingsInputSchema = z.object({
  mainDish: z
    .string()
    .describe('The name of the main dish for which to suggest a pairing.'),
  availableSideDishes: z
    .array(z.string())
    .describe('A list of available side dishes to choose from.'),
});
export type SuggestMenuPairingsInput = z.infer<typeof SuggestMenuPairingsInputSchema>;

const SuggestMenuPairingsOutputSchema = z.object({
  suggestedSideDish: z
    .string()
    .describe(
      'The name of the suggested side dish that pairs well with the main dish.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested pairing, considering nutritional compatibility and past popularity.'
    ),
});
export type SuggestMenuPairingsOutput = z.infer<typeof SuggestMenuPairingsOutputSchema>;

export async function suggestMenuPairings(
  input: SuggestMenuPairingsInput
): Promise<SuggestMenuPairingsOutput> {
  return suggestMenuPairingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMenuPairingsPrompt',
  input: {schema: SuggestMenuPairingsInputSchema},
  output: {schema: SuggestMenuPairingsOutputSchema},
  prompt: `You are an expert chef specializing in creating delicious and nutritious menu pairings.

  Given a main dish and a list of available side dishes, you will suggest the best side dish pairing based on nutritional compatibility and past popularity.

  Main Dish: {{{mainDish}}}
  Available Side Dishes: {{#each availableSideDishes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Consider the following factors when making your suggestion:
  - Nutritional compatibility: Do the dishes complement each other in terms of nutritional value?
  - Past popularity: Have these dishes been successfully paired together in the past?

  Output your suggestion in the following format:
  {"suggestedSideDish": "[Name of side dish]", "reasoning": "[Reasoning behind the suggestion]"}
  `,
});

const suggestMenuPairingsFlow = ai.defineFlow(
  {
    name: 'suggestMenuPairingsFlow',
    inputSchema: SuggestMenuPairingsInputSchema,
    outputSchema: SuggestMenuPairingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
