// Types pour chaque mode
export interface MCQQuestion {
  id: number
  question: string
  options: { A: string; B: string; C: string; D: string }
  correct: "A" | "B" | "C" | "D"
  explanation: string
}

export interface MCQResult {
  questions: MCQQuestion[]
}

export interface Flashcard {
  id: number
  front: string
  back: string
  hint: string | null
}

export interface FlashcardsResult {
  flashcards: Flashcard[]
}

export interface KeyPoint {
  id: number
  point: string
  detail: string
}

export interface ImportantTerm {
  term: string
  definition: string
}

export interface SummaryResult {
  title: string
  overview: string
  key_points: KeyPoint[]
  important_terms: ImportantTerm[]
  conclusion: string
}

// Fonction principale de parsing
export function parseGenerationResult(
  rawText: string,
  mode: "MCQ" | "FLASHCARDS" | "SUMMARY"
): MCQResult | FlashcardsResult | SummaryResult | null {
  try {
    // Groq peut ajouter du texte avant/après le JSON
    // On extrait seulement le JSON avec une regex
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const cleaned = jsonMatch[0].trim()
    const parsed = JSON.parse(cleaned)

    if (mode === "MCQ" && Array.isArray(parsed.questions)) {
      return parsed as MCQResult
    }

    if (mode === "FLASHCARDS" && Array.isArray(parsed.flashcards)) {
      return parsed as FlashcardsResult
    }

    if (mode === "SUMMARY" && parsed.title && Array.isArray(parsed.key_points)) {
      return parsed as SummaryResult
    }

    return null
  } catch (err) {
    console.error("Parse error:", err)
    return null
  }
}