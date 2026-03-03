import simpleGit from 'simple-git';
import fsExtra from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.resolve(__dirname, '../temp/repos');

export async function cloneRepo(repoUrl, owner, repo) {
  await fsExtra.ensureDir(TEMP_DIR);
  const repoPath = path.join(TEMP_DIR, `${owner}_${repo}_${Date.now()}`);
  await fsExtra.ensureDir(repoPath);
  try {
    const git = simpleGit();
    await git.clone(repoUrl, repoPath, ['--depth', '200', '--single-branch']);
    return repoPath;
  } catch (err) {
    console.error('[gitService] Clone error:', err.message);
    await fsExtra.remove(repoPath).catch(() => {});
    throw new Error('Failed to clone repository. It may be private or the URL is incorrect.');
  }
}

export async function cleanup(repoPath) {
  try {
    await fsExtra.remove(repoPath);
    console.log('[gitService] Cleaned up:', repoPath);
  } catch (err) {
    console.error('[gitService] Cleanup error:', err.message);
  }
}