import { useState } from 'react';

const LOADING_STEPS = [
  'Fetching repository metadata from GitHub...',
  'Cloning repository locally...',
  'Scanning file structure (depth 3)...',
  'Analyzing 200 git commits...',
  'Filtering beginner-safe files...',
  'Generating AI mentor insights...',
];

function RepoCard({ data }) {
  return (
    <div className="repo-card">
      <div className="repo-header">
        <a href={data.url} target="_blank" rel="noreferrer" className="repo-name">
          {data.name}
        </a>
        {data.language && <span className="repo-lang-badge">{data.language}</span>}
      </div>
      <p className="repo-desc">{data.description}</p>
      <div className="repo-stats">
        <div className="stat"><strong>{data.stars?.toLocaleString()}</strong> stars</div>
        <div className="stat"><strong>{data.forks?.toLocaleString()}</strong> forks</div>
        <div className="stat"><strong>{data.openIssues?.toLocaleString()}</strong> open issues</div>
      </div>
    </div>
  );
}

function GeminiInsight({ text }) {
  if (!text) return null;
  return (
    <div className="gemini-card">
      <div className="gemini-label">AI Mentor Insight (Gemini)</div>
      <p className="gemini-text">{text}</p>
    </div>
  );
}

function GroqInsight({ summary, deepAnalysis, community }) {
  if (!summary && !deepAnalysis && !community) return null;
  
  return (
    <div className="groq-insights-container">
      {summary && (
        <div className="groq-card groq-summary">
          <div className="groq-label">🤖 AI Summary (Groq - Llama)</div>
          <p className="groq-text">{summary}</p>
        </div>
      )}
      
      {deepAnalysis && (
        <div className="groq-card groq-deep">
          <div className="groq-label">📊 Technical Deep Dive (Groq)</div>
          <div className="groq-analysis">
            {deepAnalysis.split('\n').map((line, i) => {
              if (line.trim() === '') return null;
              return (
                <p key={i} className="groq-analysis-line">
                  {line.trim()}
                </p>
              );
            })}
          </div>
        </div>
      )}
      
      {community && (
        <div className="groq-card groq-community">
          <div className="groq-label">👥 Community Insights (Groq)</div>
          <p className="groq-text">{community}</p>
        </div>
      )}
    </div>
  );
}

function BeginnerZones({ zones }) {
  if (!zones || zones.length === 0) return <p style={{color:'#484f58',fontSize:'13px'}}>No beginner zones detected.</p>;
  return (
    <div className="file-chips">
      {zones.slice(0, 30).map((z, i) => (
        <div key={i} className="file-chip">
          <span className="chip-type">{z.type}</span>
          {z.file}
        </div>
      ))}
    </div>
  );
}

function SafeFiles({ files }) {
  if (!files || files.length === 0) return <p style={{color:'#484f58',fontSize:'13px'}}>No beginner-safe files found in recent history.</p>;
  return (
    <div className="safe-files">
      {files.map((f, i) => (
        <div key={i} className="safe-file-card">
          <div className="safe-file-top">
            <span className="safe-file-path">{f.file}</span>
            <span className="change-badge">{f.changeCount} change{f.changeCount !== 1 ? 's' : ''}</span>
          </div>
          <p className="safe-file-reason">{f.reason}</p>
        </div>
      ))}
    </div>
  );
}

function OnboardingGuide({ steps }) {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="guide-steps">
      {steps.map((s) => (
        <div key={s.step} className="guide-step">
          <div className="step-number">{s.step}</div>
          <div className="step-content">
            <h3>{s.title}</h3>
            <p>{s.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingState({ stepIndex }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <p>Analyzing repository, please wait...</p>
      <div className="loading-steps">
        {LOADING_STEPS.map((step, i) => (
          <div key={i} className="loading-step">
            <div className={`step-dot ${i === stepIndex ? 'active' : ''}`} />
            <span style={{ color: i <= stepIndex ? '#c9d1d9' : '#484f58' }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    if (!url.trim()) { setError('Please enter a GitHub repository URL.'); return; }
    setError('');
    setResult(null);
    setLoading(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 4000);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed.');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setLoadingStep(0);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAnalyze();
  }

  return (
    <div className="app">
      <div className="header">
        <div className="header-badge">Open Source Intelligence</div>
        <h1>OSS Onboard Intelligence System</h1>
        <p>Your AI-powered mentor for making your first open-source contribution with confidence.</p>
      </div>

      <div className="search-card">
        <label className="search-label">GitHub Repository URL</label>
        <div className="search-row">
          <input
            className="search-input"
            type="text"
            placeholder="https://github.com/owner/repository"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {error && (
          <div className="error-box">
            <span>⚠</span> {error}
          </div>
        )}
      </div>

      {loading && <LoadingState stepIndex={loadingStep} />}

      {result && !loading && (
        <>
          <div className="section">
            <div className="section-title">
              <span className="icon icon-blue"></span>
              Repository Overview
            </div>
            <RepoCard data={result} />
          </div>

          {result.geminiSummary && (
            <div className="section">
              <div className="section-title">
                <span className="icon icon-purple"></span>
                AI Mentor Summary
              </div>
              <GeminiInsight text={result.geminiSummary} />
            </div>
          )}

          {result.aiInsights && (result.aiInsights.groqSummary || result.aiInsights.groqDeepAnalysis || result.aiInsights.groqCommunity) && (
            <div className="section">
              <div className="section-title">
                <span className="icon icon-purple"></span>
                AI-Powered Insights (Groq)
              </div>
              <GroqInsight 
                summary={result.aiInsights.groqSummary}
                deepAnalysis={result.aiInsights.groqDeepAnalysis}
                community={result.aiInsights.groqCommunity}
              />
            </div>
          )}

          <div className="section">
            <div className="section-title">
              <span className="icon icon-green"></span>
              Beginner-Friendly Zones
              <span style={{color:'#484f58',fontWeight:'400',fontSize:'13px'}}>— detected from file structure</span>
            </div>
            <BeginnerZones zones={result.beginnerZones} />
          </div>

          <div className="section">
            <div className="section-title">
              <span className="icon icon-orange"></span>
              Recommended First Contribution Files
              <span style={{color:'#484f58',fontWeight:'400',fontSize:'13px'}}>— from git history</span>
            </div>
            <SafeFiles files={result.beginnerSafeFiles} />
          </div>

          <div className="section">
            <div className="section-title">
              <span className="icon icon-blue"></span>
              Your Onboarding Roadmap
            </div>
            <OnboardingGuide steps={result.onboardingGuide} />
          </div>
        </>
      )}
    </div>
  );
}
