// app/api/generate-words/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { WordPair } from "@/types/game";
import { getRandomWordPair } from "@/data/fallbackWords";

type Difficulty = "easy" | "medium" | "hard";

interface GenerateRequestBody {
  difficulty?: Difficulty;
  apiKey?: string;
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
  // Accept JSON body
  let body: GenerateRequestBody = {};
  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    // ignore, we'll validate later
  }

  const difficulty: Difficulty = (body.difficulty || "medium") as Difficulty;
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return NextResponse.json(
      { error: "Invalid difficulty level" },
      { status: 400 }
    );
  }

  // Prefer explicit apiKey in body, then env var(s)
  const geminiApiKey =
    body.apiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;

  console.log("=== GEMINI API DEBUG ===");
  console.log(
    "Body API Key:",
    body.apiKey ? `YES (${body.apiKey.substring(0, 10)}...)` : "NO"
  );
  console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "YES" : "NO");
  console.log(
    "NEXT_PUBLIC_GEMINI_API_KEY:",
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ? "YES" : "NO"
  );
  console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? "YES" : "NO");
  console.log(
    "Final geminiApiKey:",
    geminiApiKey ? `YES (${geminiApiKey.substring(0, 10)}...)` : "NO"
  );
  console.log("========================");

  // If no API key, return local fallback immediately
  if (!geminiApiKey) {
    console.log("⚠️  NO API KEY FOUND - Using fallback words");
    const fallback = getRandomWordPair(difficulty);
    return NextResponse.json({
      wordPair: fallback,
      source: "fallback",
      geminiApiKey: geminiApiKey,
    });
  }

  console.log("✓ API Key found, attempting Gemini API call...");

  // Model selection: allow override via request, then env var, then default
  const modelName =
    body.modelName ||
    process.env.GEMINI_MODEL_NAME ||
    process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME ||
    "gemini-2.5-flash";

  const difficultyPrompts: Record<Difficulty, string> = {
    easy: "common, everyday objects and concepts that everyone knows",
    medium: "moderately familiar concepts requiring some thought",
    hard: "abstract concepts, similar meanings, or subtle differences",
  };

  // IMPORTANT: keep the response strictly JSON only in the prompt so parsing is robust
  const prompt = `You are a helpful assistant that returns ONLY a single JSON object (no markdown, no explanations).
Generate one word pair for an Undercover-style party game.

Rules:
1) Return a JSON object exactly matching the structure below.
2) civilian_word: a single ENGLISH word or short phrase - must be a genuine English word from English vocabulary ONLY (no Hindi, no transliterated words, no other languages)
3) undercover_word: a related but DIFFERENT ENGLISH word (genuine English vocabulary) that is similar enough to be confusing but clearly distinct
4) The two words MUST be related and similar in meaning/category, but they MUST NOT be the same word or synonyms that are too close
5) The words should be close enough that clues could apply to both, creating ambiguity and making the game challenging
6) relationship: 1-line description of how the two words are related and what makes them similar yet different.
7) Both words MUST be from ENGLISH language vocabulary ONLY - no Hindi words, no foreign language words, no transliterations.
8) Use only universal English concepts that would be found in an English dictionary.
9) Words must be safe for all ages and not political, violent, or obscene.

Examples of good pairs:
- "Doctor" and "Nurse" (both medical professionals, similar but different roles)
- "Sea" and "River" (both large water bodies, subtly different)
- "Book" and "Novel" (related reading materials, one more specific)

Output EXACT structure (no extra fields):
{
  "civilian_word": "string",
  "undercover_word": "string",
  "relationship": "string"
}

Difficulty guidance: ${difficultyPrompts[difficulty]}.`;

  try {
    console.log("Initializing GoogleGenAI client...");
    // Initialize client
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    console.log(`Calling Gemini model: ${modelName}...`);
    // Call the generateContent API (docs/examples use `models.generateContent` with `contents`)
    const response = await ai.models.generateContent({
      model: modelName,
      // `contents`/`content` shape is SDK dependent; `contents` (string) is supported in examples.
      contents: prompt,
      // Optionally you can add settings like temperature, maxOutputTokens if supported by your SDK version:
      // temperature: 0.2,
      // maxOutputTokens: 256,
    });

    console.log("✓ Gemini API call successful");
    // The official SDK returns `response.text` (string). Use that.
    const rawText = normalizeText((response as any).text ?? "");
    console.log("Raw response text:", rawText.substring(0, 200));

    // If the SDK returned an array/staged output, also try to resolve it:
    let candidateText = rawText;
    if (!candidateText) {
      // Try alternative common fields (defensive): e.g., response.output[0].content[0].text
      try {
        const maybe = (response as any).output ?? (response as any).candidates;
        if (Array.isArray(maybe) && maybe.length > 0) {
          // drill down for text
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

    // Remove possible markdown fences and stray content
    const cleaned = (candidateText || "")
      .replace(/```(?:json)?\n?/g, "")
      .replace(/<\/?[^>]+(>|$)/g, "") // strip HTML tags if any
      .trim();

    // Try to parse JSON
    let parsed = safeParseJSON<Record<string, unknown>>(cleaned);

    // If parse failed, attempt to extract JSON substring
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

    // If we couldn't parse or validation failed, fallback to local words
    if (!wordPair) {
      console.warn(
        "⚠️  AI response invalid or parse failed. Falling back to local words."
      );
      wordPair = getRandomWordPair(difficulty);
      return NextResponse.json({ wordPair, source: "fallback-parse-error" });
    }

    console.log("✓ Successfully generated word pair from Gemini!");
    console.log("Word pair:", wordPair);
    return NextResponse.json({ wordPair, source: "gemini" });
  } catch (err) {
    console.error("=== ERROR in generate-words handler ===");
    console.error(
      "Error type:",
      err instanceof Error ? err.constructor.name : typeof err
    );
    console.error(
      "Error message:",
      err instanceof Error ? err.message : String(err)
    );
    console.error("Full error:", err);
    console.log("Returning fallback words due to error");
    // On any error return local fallback
    const fallback = getRandomWordPair(difficulty);
    return NextResponse.json({ wordPair: fallback, source: "fallback-error" });
  }
}
