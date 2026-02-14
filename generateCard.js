import fs from "fs";

const data = JSON.parse(fs.readFileSync("stats.json"));

const topLangs = Object.entries(data.languages)
  .sort((a,b) => b[1] - a[1])
  .slice(0,5);

const maxLang = topLangs[0][1];

const langBars = topLangs.map((l,i) => {
  const width = (l[1] / maxLang) * 120;
  return `
    <text x="200" y="${90 + i*25}" fill="#c9d1d9">${l[0]}</text>
    <rect x="270" y="${80 + i*25}" width="${width}" height="10" rx="5" fill="#58a6ff"/>
  `;
}).join("");

const svg = `
<svg width="420" height="220" xmlns="http://www.w3.org/2000/svg">

  <defs>
    <linearGradient id="grad">
      <stop offset="0%" stop-color="#58a6ff"/>
      <stop offset="100%" stop-color="#bc8cff"/>
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" rx="15" fill="#0d1117"/>

  <text x="20" y="35" fill="url(#grad)" font-size="18" font-weight="bold">
    GitHub Activity
  </text>

  <!-- Score -->
  <text x="20" y="70" fill="#8b949e">Score</text>
  <text x="20" y="95" fill="#ffffff" font-size="24">
    ${data.score}
  </text>

  <!-- Contributions -->
  <text x="20" y="130" fill="#8b949e">Commits</text>
  <rect x="100" y="120" width="${data.contributions.commits/5}" height="8" rx="4" fill="#3fb950"/>

  <text x="20" y="155" fill="#8b949e">PRs</text>
  <rect x="100" y="145" width="${data.contributions.prs*5}" height="8" rx="4" fill="#f2cc60"/>

  <text x="20" y="180" fill="#8b949e">Issues</text>
  <rect x="100" y="170" width="${data.contributions.issues*5}" height="8" rx="4" fill="#ff7b72"/>

  <!-- Languages -->
  <text x="200" y="60" fill="#8b949e">Top Languages</text>
  ${langBars}

</svg>
`;

fs.writeFileSync("card.svg", svg);
