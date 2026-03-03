import simpleGit from 'simple-git';
import path from 'path';

const SAFE_EXTENSIONS = new Set(['.md', '.js', '.json', '.ts', '.jsx', '.tsx', '.yaml', '.yml', '.txt']);

export async function analyzeGitHistory(repoPath) {
  const git = simpleGit(repoPath);
  const fileChangeCounts = {};
  const fileCommitSets = {};

  try {
    const log = await git.log(['--max-count=200', '--name-only', '--pretty=format:%H']);

    for (const commit of log.all) {
      const hash = commit.hash;
      let diff = '';
      try {
        diff = await git.diff(['--name-only', hash + '^', hash]);
      } catch {
        try {
          diff = await git.show(['--name-only', '--pretty=format:', hash]);
        } catch {
          continue;
        }
      }
      const files = diff.split('\n').map(f => f.trim()).filter(Boolean);
      for (const file of files) {
        if (!fileChangeCounts[file]) {
          fileChangeCounts[file] = 0;
          fileCommitSets[file] = new Set();
        }
        fileChangeCounts[file]++;
        fileCommitSets[file].add(hash);
      }
    }
  } catch (err) {
    console.error('[gitHistoryAnalyzer] Error:', err.message);
  }

  const ranked = Object.entries(fileChangeCounts)
    .map(([file, changeCount]) => ({
      file,
      changeCount,
      commitCount: fileCommitSets[file]?.size || 0,
    }))
    .filter(entry => {
      const ext = path.extname(entry.file).toLowerCase();
      return (
        entry.changeCount < 20 &&
        entry.commitCount < 15 &&
        SAFE_EXTENSIONS.has(ext)
      );
    })
    .sort((a, b) => a.changeCount - b.changeCount)
    .slice(0, 10);

  return ranked;
}