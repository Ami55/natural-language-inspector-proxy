import { FullAnalysisResult } from "../types";

const NLP_PROXY_URL = "https://gemini-proxy-boldstudio.vercel.app/api/natural-language-inspector";

export async function analyzeSentence(sentence: string): Promise<FullAnalysisResult> {
  const response = await fetch(NLP_PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: sentence }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server analysis error (${response.status})`);
  }

  const data = await response.json();
  return data as FullAnalysisResult;
}
