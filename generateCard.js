import fs from "fs";

const data = JSON.parse(fs.readFileSync("stats.json"));

const langs = Object.entries(data.languages)
  .sort((a,b) => b[1]-a[1])
  .slice(0,5);

const total = langs.reduce((acc,l)=>acc+l[1],0);

const colors = [
  "#f1e05a",
  "#3178c6",
  "#b07219",
  "#4F5D95",
  "#e34c26"
];

let offset = 0;

const langBar = langs.map((l,i)=>{
  const percent = (l[1]/total)*300;
  const rect = `
    <rect x="${offset}" y="0" width="${percent}" height="12"
    fill="${colors[i]}" rx="6"/>
  `;
  offset += percent;
  return rect;
}).join("");

const langLegend = langs.map((l,i)=>`
  <g transform="translate(${20 + (i%2)*180}, ${300 + Math.floor(i/2)*28})">
    <circle r="6" fill="${colors[i]}"/>
    <text x="12" y="5" fill="#c9d1d9" font-size="13">
      ${l[0]} ${(l[1]/total*100).toFixed(2)}%
    </text>
  </g>
`).join("");

const svg = `
<svg width="375" height="380" xmlns="http://www.w3.org/2000/svg">

  <defs>
    <linearGradient id="titleGrad">
      <stop offset="0%" stop-color="#ff4ecd"/>
      <stop offset="100%" stop-color="#8f8cff"/>
    </linearGradient>

    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="100%" height="100%" rx="18" fill="#0d1117"/>

  <!-- Title -->
  <text x="20" y="40"
    font-size="22"
    font-weight="bold"
    fill="url(#titleGrad)">
    GitHub Stats
  </text>

  <!-- Stats -->
  <g fill="#c9d1d9" font-size="15">
    <text x="20" y="80">★ Stars</text>
    <text x="150" y="80">${data.stars}</text>

    <text x="20" y="110">↻ Commits</text>
    <text x="150" y="110">${data.contributions.commits}</text>

    <text x="20" y="140">⇄ PRs</text>
    <text x="150" y="140">${data.contributions.prs}</text>

    <text x="20" y="170">⚠ Issues</text>
    <text x="150" y="170">${data.contributions.issues}</text>

    <text x="20" y="200">Score</text>
    <text x="150" y="200" fill="#58a6ff">${data.score}</text>
  </g>

  <!-- Divider -->
  <line x1="20" y1="215" x2="400" y2="215" stroke="#30363d"/>

  <!-- Languages Title -->
  <text x="20" y="245"
    fill="url(#titleGrad)"
    font-size="18"
    font-weight="bold">
    Most Used Languages
  </text>

  <!-- Bar -->
  <g transform="translate(20,260)" filter="url(#glow)">
    ${langBar}
  </g>

  <!-- Legend -->
  ${langLegend}

</svg>
`;

fs.writeFileSync("card.svg", svg);
