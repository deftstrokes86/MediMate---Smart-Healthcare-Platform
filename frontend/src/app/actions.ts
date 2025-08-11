
"use server";

import { symptomChecker } from "@/ai/flows/symptom-checker";
import type { Ailment } from "@/lib/types";

export async function handleSymptomCheck(
  symptoms: string
): Promise<{ data: Ailment[] | null; error: string | null }> {
  try {
    const results = await symptomChecker({ symptoms });
    // Sort by certainty descending
    results.sort((a, b) => b.certainty - a.certainty);
    return { data: results, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error: `AI analysis failed: ${errorMessage}` };
  }
}
