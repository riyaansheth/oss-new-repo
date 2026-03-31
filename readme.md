# OSS Onboard Intelligence System

A full-stack web based mentor system that analyzes any public GitHub repository and gives beginner contributors a clear, intelligent path to their first pull request.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (CRA) |
| Backend | Node.js + Express |
| Git ops | simple-git |
| GitHub API | Axios |
| AI insights | Google Gemini 1.5 Flash (free tier) |
| File system | fs-extra |

---

## Folder Structure

```
oss-onboard/
  backend/
    routes/
      analyze.js           # POST /api/analyze route
    controllers/
      analyzeController.js # URL validation, route handler
    services/
      analysisService.js   # Orchestrates full pipeline
      githubService.js     # GitHub REST API calls
      gitService.js        # Clone + cleanup via simple-git
      geminiService.js     # Gemini AI insights
    analyzers/
      structureAnalyzer.js     # Recursive file scan (depth 3)
      gitHistoryAnalyzer.js    # 200-commit history analysis
      explanationGenerator.js  # Reasons + onboarding guide
    temp/repos/            # Cloned repos (auto-cleaned)
    .env.example
    package.json
    server.js
  frontend/
    public/
      index.html
    src/
      App.js
      index.js
      index.css
    package.json
```

---

## Setup Instructionsa

### 1. Get a Free Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Create a free API key (no billing required)

### 2. Optional: GitHub Token (avoids 60 req/hr limit)
1. Go to https://github.com/settings/tokens
2. Generate a classic token with no special scopes

### 3. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm install
node server.js
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000 and proxies API calls to http://localhost:3001

---

## How It Works

1. **Validate** — checks URL format (github.com/owner/repo)
2. **Metadata** — fetches stars, forks, language, issues via GitHub REST API
3. **Clone** — shallow clones with --depth 200 into temp/repos/
4. **Structure scan** — walks directories (max depth 3), tags .md, test, config files
5. **Git history** — analyzes last 200 commits, counts per-file changes
6. **Filter** — keeps files with changeCount < 20, commitCount < 15, safe extensions
7. **Explain** — generates human-readable reasons per file type
8. **Gemini** — AI mentor writes a 3-sentence beginner summary
9. **Cleanup** — deletes cloned repo from disk
10. **Return** — structured JSON to frontend

---

## Environment Variables

```
GEMINI_API_KEY=   # Required for AI insights (free)
GITHUB_TOKEN=     # Optional, increases rate limits
PORT=3001         # Default backend port
```
