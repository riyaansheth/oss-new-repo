import fs from 'fs';
import path from 'path';

const BEGINNER_PATTERNS = [
  { regex: /\.md$/i, label: 'Documentation' },
  { regex: /\.test\.(js|ts|jsx|tsx)$/i, label: 'Test file' },
  { regex: /\.spec\.(js|ts|jsx|tsx)$/i, label: 'Test file' },
  { regex: /^(jest|babel|eslint|prettier|tsconfig|webpack|vite|rollup)\.(json|js|cjs|mjs|ts)$/i, label: 'Config file' },
  { regex: /\.json$/i, label: 'JSON config' },
];

function walkDir(dirPath, depth = 0, results = []) {
  if (depth > 3) return results;
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, depth + 1, results);
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

export function analyzeStructure(repoPath) {
  const allFiles = walkDir(repoPath);
  const beginnerZones = [];
  for (const filePath of allFiles) {
    const relativePath = path.relative(repoPath, filePath);
    const fileName = path.basename(filePath);
    for (const pattern of BEGINNER_PATTERNS) {
      if (pattern.regex.test(fileName)) {
        beginnerZones.push({ file: relativePath, type: pattern.label });
        break;
      }
    }
  }
  return { beginnerZones, allFiles: allFiles.map(f => path.relative(repoPath, f)) };
}