import { runAnalysis } from '../services/analysisService.js';

export async function analyzeRepo(req, res) {
  const { repoUrl } = req.body;

  if (!repoUrl || typeof repoUrl !== 'string') {
    return res.status(400).json({ error: 'Repository URL is required.' });
  }

  const githubRegex = /^https?:\/\/github\.com\/([^/]+)\/([^/\s]+?)(\.git)?\/?$/;
  const match = repoUrl.trim().match(githubRegex);
  if (!match) {
    return res.status(400).json({ error: 'Invalid GitHub URL. Use: https://github.com/owner/repo' });
  }

  const owner = match[1];
  const repo = match[2];

  try {
    const result = await runAnalysis(owner, repo, repoUrl.trim());
    res.json(result);
  } catch (err) {
    console.error('[analyzeController] Error:', err.message);
    res.status(500).json({ error: err.message || 'Analysis failed.' });
  }
}