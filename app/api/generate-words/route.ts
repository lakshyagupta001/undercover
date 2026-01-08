// app/api/generate-words/route.ts
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

  // Get API key from environment
  const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  console.log("=== GEMINI API DEBUG ===");
  console.log(
    "NEXT_PUBLIC_GEMINI_API_KEY:",
    geminiApiKey ? "YES" : "NO"
  );
  console.log("========================");

  // If no API key, return error
  if (!geminiApiKey) {
    console.log("⚠️  NO API KEY FOUND - Cannot generate words");
    return NextResponse.json(
      { error: "Gemini API key is required. Please provide an API key to generate words." },
      { status: 400 }
    );
  }

  console.log("✓ API Key found, attempting Gemini API call...");

  // Model selection: allow override via request, then env var, then default
  const modelName =
    process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME ||
    "gemini-2.5-flash";

  const difficultyPrompts: Record<Difficulty, string> = {
    easy: "common, everyday objects and concepts that everyone knows",
    medium: "moderately familiar concepts requiring some thought",
    hard: "abstract concepts, similar meanings, or subtle differences",
  };

  // IMPORTANT: keep the response strictly JSON only in the prompt so parsing is robust
  const prompt = `
You are a helpful assistant that returns ONLY a single JSON object.
Do NOT include markdown, explanations, or extra text.

Your task is to generate ONE word pair for an Undercover-style party game.

====================
LANGUAGE RULES
====================
- Words may be in EITHER English OR Hindi.
- If the civilian_word is English, the undercover_word MUST also be English.
- If the civilian_word is Hindi, the undercover_word MUST also be Hindi.
- Do NOT mix languages in a single pair.
- Use genuine, commonly used words only (no slang, no transliterations).

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

    // If we couldn't parse or validation failed, return error
    if (!wordPair) {
      console.warn(
        "⚠️  AI response invalid or parse failed."
      );
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
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
    
    // Return error response
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate words from Gemini API" },
      { status: 500 }
    );
  }
}
