import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getGeminiInsights(metadata, beginnerZones, beginnerSafeFiles) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[geminiService] No GEMINI_API_KEY set, skipping AI insights.');
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const safeFilesList = beginnerSafeFiles.slice(0, 5).map(f => f.file).join(', ');
  const zonesList = beginnerZones.slice(0, 5).map(z => z.file).join(', ');

  const prompt = `
You are an open-source mentoring assistant. Analyze this repository and give a beginner contributor a short, friendly 3-sentence summary of what the project does and how to get started.
Repository: ${metadata.name}
Description: ${metadata.description}
Primary Language: ${metadata.language}
Stars: ${metadata.stars}
Safe files to start with: ${safeFilesList || 'none found'}
Beginner-friendly zones: ${zonesList || 'none found'}
Respond with only the 3-sentence summary. No markdown, no headers.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim();
  } catch (err) {
    console.error('[geminiService] API error:', err.message);
    throw err;
  }
}