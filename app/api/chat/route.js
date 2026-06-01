import { GoogleGenerativeAI }
from "@google/generative-ai";

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

export async function POST(req) {
  try {
    const body = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are RXCroma AI medical assistant.

Rules:
- Give general medicine guidance
- Do not act like a doctor
- Keep answers short
- Suggest doctor consultation

User Question:
${body.message}
`;

    const result =
      await model.generateContent(prompt);

    const response =
      result.response.text();

    return Response.json({
      reply: response,
    });
  } catch (error) {
    console.log(error);

    return Response.json({
      reply:
        "AI service temporarily unavailable",
    });
  }
}