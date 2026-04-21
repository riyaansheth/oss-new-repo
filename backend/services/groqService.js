import Groq from 'groq-sdk';

export async function getGroqInsights(metadata, beginnerZones, beginnerSafeFiles, analysisType = 'onboarding') {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn('[groqService] No GROQ_API_KEY set, skipping Groq AI insights.');
    return null;
  }

  const groq = new Groq({
    apiKey: apiKey,
  });

  const safeFilesList = beginnerSafeFiles.slice(0, 5).map(f => f.file).join(', ');
  const zonesList = beginnerZones.slice(0, 5).map(z => z.file).join(', ');

  let prompt;

  if (analysisType === 'onboarding') {
    prompt = `
You are an open-source mentoring assistant. Analyze this repository and give a beginner contributor a short, friendly 3-sentence summary of what the project does and how to get started.
Repository: ${metadata.name}
Description: ${metadata.description}
Primary Language: ${metadata.language}
Stars: ${metadata.stars}
Safe files to start with: ${safeFilesList || 'none found'}
Beginner-friendly zones: ${zonesList || 'none found'}
Respond with only the 3-sentence summary. No markdown, no headers.
`;
  } else if (analysisType === 'deep-analysis') {
    prompt = `
You are an expert code reviewer and open-source mentor. Provide a detailed technical analysis of this repository for contributors:

Repository: ${metadata.name}
Description: ${metadata.description}
Primary Language: ${metadata.language}
Stars: ${metadata.stars}

Please provide:
1. Key architectural patterns used in the codebase
2. Main dependencies and why they're important
3. Recommended first contribution areas for beginners
4. Best practices for contributing (testing, code style, etc)
5. Common pitfalls to avoid

Keep the response concise but informative.
`;
  } else if (analysisType === 'tech-stack') {
    prompt = `
Analyze and summarize the technology stack for: ${metadata.name}
Primary Language: ${metadata.language}
Key files: ${safeFilesList}

Provide a brief paragraph explaining what technologies and frameworks this project uses and why they were likely chosen.
`;
  }

  try {
    const message = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const text = message.choices[0]?.message?.content || '';
    return text.trim();
  } catch (err) {
    console.error('[groqService] API error:', err.message);
    throw err;
  }
}

export async function getGroqCommunityInsights(metadata) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }

  const groq = new Groq({
    apiKey: apiKey,
  });

  const prompt = `
Based on this GitHub repository: ${metadata.name}
Stars: ${metadata.stars}
Description: ${metadata.description}
Language: ${metadata.language}

Provide a 2-3 sentence assessment of:
1. How active and welcoming the community likely is
2. The quality of documentation based on repo metrics
3. Suggestion for how new contributors can get involved

Keep it encouraging and actionable.
`;

  try {
    const message = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return message.choices[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error('[groqService] Community insights error:', err.message);
    return null;
  }
}
