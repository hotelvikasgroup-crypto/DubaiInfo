import type { ApiResponse } from "../types";

export async function generateLeadsAndStrategies(prompt: string): Promise<ApiResponse> {
  const response = await fetch("/.netlify/functions/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch AI response from backend.");
  }

  const text = await response.text();

  try {
    return JSON.parse(text) as ApiResponse;
  } catch (err) {
    console.error("Invalid JSON from backend:", text);
    throw new Error("Backend returned invalid JSON.");
  }
}
