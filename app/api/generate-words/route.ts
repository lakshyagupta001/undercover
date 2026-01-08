import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { WordPair } from "@/types/game";

type Difficulty = "easy" | "medium" | "hard";

interface GenerateRequestBody {
  difficulty?: Difficulty;
  modelName?: string;
}

function safeParseJSON<T = unknown>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeText(raw: unknown): string {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  try {
    return String(raw);
  } catch {
    return "";
  }
}

export async function POST(request: NextRequest) {
  let body: GenerateRequestBody = {};
  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
  }

  const difficulty: Difficulty = (body.difficulty || "medium") as Difficulty;
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return NextResponse.json(
      { error: "Invalid difficulty level" },
      { status: 400 }
    );
  }

  const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!geminiApiKey) {
    return NextResponse.json(
      { error: "Gemini API key is required. Please provide an API key to generate words." },
      { status: 400 }
    );
  }

  const modelName =
    process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME ||
    "gemini-2.5-flash";

  const difficultyPrompts: Record<Difficulty, string> = {
    easy: "common, everyday objects and concepts that everyone knows",
    medium: "moderately familiar concepts requiring some thought",
    hard: "abstract concepts, similar meanings, or subtle differences",
  };

  const selectedLanguage = Math.random() < 0.5 ? "English" : "Hinglish";

  const languageInstructions = selectedLanguage === "English"
    ? `- You MUST use ENGLISH words only.
- Use common English words that are widely understood.
- Both civilian_word and undercover_word must be in English.`
    : `- You MUST use HINGLISH words only.
- Hinglish means Hindi words written using English/Latin alphabet (e.g., "Seb", "Kela", "Paani", "Chai", "Roti").
- Do NOT use Devanagari script. All words must be typeable on an English keyboard.
- Both civilian_word and undercover_word must be in Hinglish.
- Use simple, phonetic spellings that Indians commonly use (e.g., "Paani" not "Pani", "Chai" not "Chay").`;

  const prompt = `
You are a helpful assistant that returns ONLY a single JSON object.
Do NOT include markdown, explanations, or extra text.

Your task is to generate ONE word pair for an Undercover-style party game.

====================
LANGUAGE: ${selectedLanguage.toUpperCase()} (MANDATORY)
====================
${languageInstructions}
- Do NOT mix languages in a single pair.
- Use genuine, commonly used words only (no slang).

====================
WORD RULES
====================
- civilian_word: a single word or short phrase.
- undercover_word: a related but DIFFERENT word or short phrase.
- The two words MUST:
  - Belong to the same category or domain
  - Be similar enough that clues could apply to both
  - Be clearly distinct (NOT the same word)
  - NOT be exact synonyms or near-identical meanings

====================
CONTENT SAFETY
====================
- Words must be safe for all ages.
- No political, violent, adult, or offensive content.

====================
OUTPUT FORMAT (STRICT)
====================
Return EXACTLY this JSON structure and nothing else:

{
  "civilian_word": "string",
  "undercover_word": "string",
  "relationship": "One-line explanation of how the two words are related and why they are similar yet different."
}
====================
WORD PAIR REQUIREMENTS
====================
- Choose words that fit the selected difficulty level.
- Ensure the words are neither too easy nor too obscure.
- Make sure the relationship is clear and logical.

Difficulty guidance: ${difficultyPrompts[difficulty]}.`;

  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    const rawText = normalizeText((response as any).text ?? "");

    let candidateText = rawText;
    if (!candidateText) {
      try {
        const maybe = (response as any).output ?? (response as any).candidates;
        if (Array.isArray(maybe) && maybe.length > 0) {
          const textFromCandidates =
            maybe[0]?.content?.[0]?.text ||
            maybe[0]?.text ||
            maybe[0]?.output_text ||
            "";
          candidateText = normalizeText(textFromCandidates);
        }
      } catch {
        candidateText = "";
      }
    }

    const cleaned = (candidateText || "")
      .replace(/```(?:json)?\n?/g, "")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .trim();

    let parsed = safeParseJSON<Record<string, unknown>>(cleaned);

    if (!parsed) {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = safeParseJSON<Record<string, unknown>>(jsonMatch[0]);
      }
    }

    let wordPair: WordPair | null = null;

    if (parsed) {
      const c = parsed["civilian_word"];
      const u = parsed["undercover_word"];
      const r = parsed["relationship"];

      if (
        typeof c === "string" &&
        typeof u === "string" &&
        typeof r === "string" &&
        c.trim() &&
        u.trim() &&
        r.trim()
      ) {
        wordPair = {
          civilian_word: c.trim(),
          undercover_word: u.trim(),
          relationship: r.trim(),
        } as WordPair;
      }
    }

    if (!wordPair) {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ wordPair, source: "gemini", language: selectedLanguage });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate words from Gemini API" },
      { status: 500 }
    );
  }
}
