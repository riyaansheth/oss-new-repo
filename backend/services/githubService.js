import axios from 'axios';

export async function fetchRepoMetadata(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  try {
    const { data } = await axios.get(url, { headers, timeout: 10000 });
    return {
      name: data.name,
      description: data.description || 'No description provided.',
      language: data.language || 'Unknown',
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      url: data.html_url,
    };
  } catch (err) {
    console.error('[githubService] Error:', err.message);
    throw new Error('Failed to fetch repo from GitHub. Check the URL or try again later.');
  }
}