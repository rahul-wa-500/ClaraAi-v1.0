// Gemini API service for Clara AI
import { getIdentityResponse } from "../utils/aiIdentity.js";

const getApiKey = () => {
  const rawKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.GEMINI_API_KEY ||
    (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) ||
    "";
  return rawKey.replace(/^["']|["';\s]+$/g, "");
};

// Valid Gemini model names, ordered by preference
const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

/**
 * Build language-aware system instruction.
 * Clara mirrors the user's language/accent/style automatically.
 */
const buildSystemInstruction = (detectedLang = "en") => {
  const langNote =
    detectedLang === "hi" || detectedLang === "hi-Latn"
      ? "The user appears to be communicating in Hindi or Hinglish. Respond in the SAME language and style they are using."
      : detectedLang !== "en"
      ? `The user appears to be communicating in language code: ${detectedLang}. Respond in the SAME language they are using.`
      : "";

  return (
    `You are Clara, an intelligent, friendly, and helpful AI assistant designed and created by Rahulwa.\n` +
    `CRITICAL LANGUAGE RULE: Always detect the language of the user's message and respond in EXACTLY the same language. ` +
    `If they write in Hindi, reply in Hindi. If in Hinglish (Hindi-English mix), reply in Hinglish. ` +
    `If in English, reply in English. Mirror their communication style, tone, and level of formality exactly.\n` +
    (langNote ? langNote + "\n" : "") +
    `If asked about your identity, name, or who made you, always say: "My name is Clara and Rahulwa Designed this AI."\n` +
    `Be concise, accurate, and helpful in all responses.`
  );
};

/**
 * Generates a Gemini AI response.
 *
 * @param {string} prompt - The latest user message
 * @param {Array<{role: string, content: string}>} history - Prior conversation messages
 * @param {string} detectedLang - BCP 47 language hint (e.g. "hi", "en", "hi-Latn")
 * @returns {Promise<string>} - AI reply text
 */
export async function generateGeminiResponse(
  prompt,
  history = [],
  detectedLang = "en"
) {
  // Built-in identity responses (instant, no API call)
  const identityReply = getIdentityResponse(prompt);
  if (identityReply) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return identityReply;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file."
    );
  }

  // Build multi-turn contents array
  const contents = [];

  for (const msg of history) {
    if (msg.role === "user") {
      contents.push({ role: "user", parts: [{ text: msg.content }] });
    } else if (msg.role === "assistant") {
      contents.push({ role: "model", parts: [{ text: msg.content }] });
    }
  }

  // Add the current user prompt
  contents.push({ role: "user", parts: [{ text: prompt }] });

  const systemInstruction = buildSystemInstruction(detectedLang);
  let lastError = "";

  for (const model of MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
            generationConfig: {
              temperature: 0.85,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        lastError = errData?.error?.message || `HTTP ${response.status}`;
        continue;
      }

      const data = await response.json();

      if (data.error) {
        lastError = data.error.message;
        continue;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;

      lastError = "Empty response from model.";
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(
    lastError ||
      "Could not generate a response. Please check your API key and try again."
  );
}

export default generateGeminiResponse;
