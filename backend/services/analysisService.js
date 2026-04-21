import { fetchRepoMetadata } from './githubService.js';
import { cloneRepo, cleanup } from './gitService.js';
import { analyzeStructure } from '../analyzers/structureAnalyzer.js';
import { analyzeGitHistory } from '../analyzers/gitHistoryAnalyzer.js';
import { generateExplanations, generateOnboardingGuide } from '../analyzers/explanationGenerator.js';
import { getGeminiInsights } from './geminiService.js';
import { getGroqInsights, getGroqCommunityInsights } from './groqService.js';

export async function runAnalysis(owner, repo, repoUrl) {
  let repoPath = null;
  try {
    console.log(`[analysisService] Starting analysis for ${owner}/${repo}`);

    const metadata = await fetchRepoMetadata(owner, repo);
    repoPath = await cloneRepo(repoUrl, owner, repo);

    const { beginnerZones } = analyzeStructure(repoPath);
    const activeFiles = await analyzeGitHistory(repoPath);
    const beginnerSafeFiles = generateExplanations(activeFiles);
    const onboardingGuide = generateOnboardingGuide(metadata);

    let geminiSummary = null;
    let groqSummary = null;
    let groqDeepAnalysis = null;
    let groqCommunity = null;

    try {
      geminiSummary = await getGeminiInsights(metadata, beginnerZones, beginnerSafeFiles);
    } catch (geminiErr) {
      console.error('[analysisService] Gemini failed (non-fatal):', geminiErr.message);
    }

    try {
      groqSummary = await getGroqInsights(metadata, beginnerZones, beginnerSafeFiles, 'onboarding');
      groqDeepAnalysis = await getGroqInsights(metadata, beginnerZones, beginnerSafeFiles, 'deep-analysis');
      groqCommunity = await getGroqCommunityInsights(metadata);
    } catch (groqErr) {
      console.error('[analysisService] Groq failed (non-fatal):', groqErr.message);
    }

    return {
      ...metadata,
      beginnerZones,
      beginnerSafeFiles,
      onboardingGuide,
      geminiSummary,
      aiInsights: {
        groqSummary,
        groqDeepAnalysis,
        groqCommunity,
      },
    };
  } finally {
    if (repoPath) await cleanup(repoPath);
  }
}