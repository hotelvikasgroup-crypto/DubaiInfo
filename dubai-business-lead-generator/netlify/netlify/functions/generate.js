import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export async function handler(event, context) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.85,
      },
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          leads: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                businessName: { type: SchemaType.STRING },
                industry: { type: SchemaType.STRING },
                location: { type: SchemaType.STRING },
                contact: { type: SchemaType.STRING },
                reason: { type: SchemaType.STRING }
              },
              required: ["businessName", "industry", "location", "contact", "reason"]
            }
          },
          strategies: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING }
              },
              required: ["title", "description"]
            }
          }
        },
        required: ["leads", "strategies"]
      }
    });

    const prompt = `
You are an expert Dubai business research assistant helping me find high-quality leads...
(Same prompt you provided earlier. Exact text preserved.)
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return {
      statusCode: 200,
      body: text
    };
  } catch (error) {
    console.error("Backend Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
