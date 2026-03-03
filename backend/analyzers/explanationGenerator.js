import path from 'path';

function getExtReason(ext) {
  const reasons = {
    '.md': 'Markdown documentation files are perfect for beginners. You can fix typos, improve clarity, or add missing examples without needing to understand the full codebase.',
    '.json': 'JSON config files are low-risk contributions. Adding a missing field or fixing a value is easy to verify and hard to break.',
    '.js': 'This JavaScript file has low churn history, meaning it is stable. A great sandbox for a first bug fix or small enhancement.',
    '.ts': 'This TypeScript file has few recent changes, making it a stable and approachable entry point with minimal conflict risk.',
    '.jsx': 'This React component is stable with low change frequency. UI tweaks or accessibility improvements are well-suited here.',
    '.tsx': 'This React TypeScript component has low activity. A great place to make small UI or a11y contributions.',
    '.yaml': 'YAML workflow or config files have low activity. A safe area to understand the project setup and make small improvements.',
    '.yml': 'YAML workflow or config files have low activity. A safe area to understand the project setup and make small improvements.',
    '.txt': 'Plain text files like changelogs or notes are one of the safest areas to contribute a first edit.',
  };
  return reasons[ext] || 'This file has low recent activity, making it a stable and beginner-friendly area to start contributing.';
}

export function generateExplanations(files) {
  return files.map(entry => ({
    file: entry.file,
    changeCount: entry.changeCount,
    reason: getExtReason(path.extname(entry.file).toLowerCase()),
  }));
}

export function generateOnboardingGuide(repoMeta) {
  return [
    {
      step: 1,
      title: 'Fork the Repository',
      detail: 'Visit ' + repoMeta.url + ' and click the Fork button in the top-right corner. This creates a personal copy of the project under your GitHub account.',
      icon: 'fork',
    },
    {
      step: 2,
      title: 'Clone Your Fork Locally',
      detail: 'Run: git clone https://github.com/YOUR_USERNAME/' + repoMeta.name + '.git — then navigate into the folder with cd ' + repoMeta.name,
      icon: 'clone',
    },
    {
      step: 3,
      title: 'Create a Feature Branch',
      detail: 'Never commit directly to main. Create an isolated branch: git checkout -b my-first-contribution',
      icon: 'branch',
    },
    {
      step: 4,
      title: 'Make a Small, Focused Change',
      detail: 'Pick one beginner-safe file from the list above. Fix a typo, improve a comment, or update a config value. Keep the scope small.',
      icon: 'edit',
    },
    {
      step: 5,
      title: 'Test Your Changes',
      detail: 'Run the project locally to ensure nothing is broken. Check the README or CONTRIBUTING.md for the test command specific to this project.',
      icon: 'test',
    },
    {
      step: 6,
      title: 'Commit with a Clear Message',
      detail: 'Stage and commit: git add . && git commit -m "docs: fix typo in README". Use conventional commit prefixes: docs:, fix:, chore:, feat:',
      icon: 'commit',
    },
    {
      step: 7,
      title: 'Push to Your Fork',
      detail: 'Upload your branch: git push origin my-first-contribution',
      icon: 'push',
    },
    {
      step: 8,
      title: 'Open a Pull Request',
      detail: 'Go to ' + repoMeta.url + ', click "Compare & pull request". Write a clear title and description of what you changed and why. Submit and wait for review!',
      icon: 'pr',
    },
  ];
}