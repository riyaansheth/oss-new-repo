import { runAnalysis } from '../services/analysisService.js';

export async function analyzeRepo(req, res) {
  const { repoUrl } = req.body;

  if (!repoUrl || typeof repoUrl !== 'string') {
    return res.status(400).json({ error: 'Repository URL is required.' });
  }

  try {
    const cleaned = repoUrl.trim().replace(/\.git$/, '').replace(/\/$/, '');
    const urlObj = new URL(cleaned);

    if (urlObj.hostname !== 'github.com') {
      return res.status(400).json({ error: 'Only GitHub URLs are supported.' });
    }

    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
      return res.status(400).json({ error: 'Invalid GitHub URL. Use: https://github.com/owner/repo' });
    }

    const owner = parts[0];
    const repo = parts[1];

    const result = await runAnalysis(owner, repo, cleaned);
    res.json(result);

  } catch (err) {
    console.error('[analyzeController] Error:', err.message);
    res.status(500).json({ error: err.message || 'Analysis failed.' });
  }
}