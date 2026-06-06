export const prompts = {

  // ── MCQ ──────────────────────────────────────────────────────────────────
  MCQ: (text: string, language: string) => ({
    system: `You are an expert educator and exam creator.
Generate high-quality multiple choice questions from educational content.
You MUST respond with valid JSON only.
No markdown, no explanation, no extra text before or after the JSON.
Language for questions and answers: ${language === "fr" ? "French" : language === "ar" ? "Arabic" : "English"}.`,

    user: `Generate exactly 10 multiple choice questions based on this content.

CONTENT:
${text}

Return ONLY this JSON structure, nothing else:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": {
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      },
      "correct": "A",
      "explanation": "Why A is correct"
    }
  ]
}

Rules:
- Exactly 10 questions
- Exactly 4 options per question (A, B, C, D)
- One correct answer per question
- Clear explanations
- Return ONLY valid JSON`,
  }),

  // ── FLASHCARDS ───────────────────────────────────────────────────────────
  FLASHCARDS: (text: string, language: string) => ({
    system: `You are an expert educator specializing in active recall learning.
Create effective flashcards from educational content.
You MUST respond with valid JSON only.
No markdown, no explanation, no extra text.
Language: ${language === "fr" ? "French" : language === "ar" ? "Arabic" : "English"}.`,

    user: `Create flashcards for studying based on this content.

CONTENT:
${text}

Return ONLY this JSON structure:
{
  "flashcards": [
    {
      "id": 1,
      "front": "Question or concept",
      "back": "Answer or explanation",
      "hint": "Memory hint or null"
    }
  ]
}

Rules:
- Generate 8 to 15 flashcards
- Front: concise question or concept
- Back: complete answer
- Hint: memory trick (or null)
- Return ONLY valid JSON`,
  }),

  // ── SUMMARY ──────────────────────────────────────────────────────────────
  SUMMARY: (text: string, language: string) => ({
    system: `You are an expert educator and academic writer.
Create structured summaries of educational content.
You MUST respond with valid JSON only.
No markdown, no explanation, no extra text.
Language: ${language === "fr" ? "French" : language === "ar" ? "Arabic" : "English"}.`,

    user: `Create a structured summary of this content.

CONTENT:
${text}

Return ONLY this JSON structure:
{
  "title": "Main topic title",
  "overview": "2-3 sentence overview",
  "key_points": [
    {
      "id": 1,
      "point": "Key point title",
      "detail": "1-2 sentence explanation"
    }
  ],
  "important_terms": [
    {
      "term": "Important term",
      "definition": "Clear definition"
    }
  ],
  "conclusion": "1-2 sentence takeaway"
}

Rules:
- 5 to 8 key points
- 3 to 6 important terms
- Return ONLY valid JSON`,
  }),
}

export type GenerationMode = "MCQ" | "FLASHCARDS" | "SUMMARY"