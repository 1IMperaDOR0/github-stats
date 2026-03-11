import fs from "fs";

const data = JSON.parse(fs.readFileSync("stats.json"));

const langs = Object.entries(data.languages)
  .sort((a,b)=>b[1]-a[1])
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
  const widthBar = 340;

  const rect = `
  <rect x="${offset}" y="0" width="${widthBar}" height="12"
  fill="${colors[i]}" rx="6"/>
  `;

  offset += percent;
  return rect;

}).join("");

const langLegend = langs.map((l,i)=>`
<g transform="translate(20, ${120 + i*28})">
  <circle r="6" fill="${colors[i]}"/>
  <text x="12" y="5">${l[0]} ${(l[1]/total*100).toFixed(2)}%</text>
</g>
`).join("");

/* ---------- STATS CARD ---------- */

const statsSVG = `
<svg width="360" height="240" xmlns="http://www.w3.org/2000/svg">

  <style>
    text{
      font-family:monospace;
      letter-spacing:.6px;
    }

    .label{
      fill:#8b949e;
      font-size:14px;
    }

    .value{
      fill:#c9d1d9;
      font-size:15px;
      font-weight:bold;
    }

    .score{
      fill:#58a6ff;
      font-weight:bold;
    }

    .title{
      font-size:22px;
      font-weight:700;
    }
  </style>

  <defs>
    <linearGradient id="titleGrad">
      <stop offset="0%" stop-color="#ff4ecd"/> 
      <stop offset="100%" stop-color="#8f8cff"/> 
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" rx="18" fill="#010409"/>

  <text x="20" y="40" class="title" fill="url(#titleGrad)">
    GitHub Stats
  </text>

  <line x1="20" y1="55" x2="340" y2="55" stroke="#30363d"/>

  <text x="20" y="80" class="label">Stars</text>
  <text x="150" y="80" class="value">${data.stars}</text>

  <text x="20" y="110" class="label">Commits</text>
  <text x="150" y="110" class="value">${data.contributions.commits}</text>

  <text x="20" y="140" class="label">PRs</text>
  <text x="150" y="140" class="value">${data.contributions.prs}</text>

  <text x="20" y="170" class="label">Issues</text>
  <text x="150" y="170" class="value">${data.contributions.issues}</text>

  <text x="20" y="200" class="label">Score</text>
  <text x="150" y="200" class="score">${data.score}</text>

</svg>
`;

/* ---------- LANGUAGE CARD ---------- */

const langSVG = `
<svg width="360" height="260" xmlns="http://www.w3.org/2000/svg">

  <style>
    text{
      font-family:monospace;
      letter-spacing:.6px;
    }

    .title{
      font-size:22px;
      font-weight:700;
    }
  </style>

  <defs>
    <linearGradient id="titleGrad">
      <stop offset="0%" stop-color="#ff4ecd"/> 
      <stop offset="100%" stop-color="#8f8cff"/> 
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" rx="18" fill="#010409"/>

  <text x="20" y="40" class="title" fill="url(#titleGrad)">
    Top Languages
  </text>

  <line x1="20" y1="55" x2="340" y2="55" stroke="#30363d"/>

  <g transform="translate(20,70)">
    ${langBar}
  </g>

  ${langLegend}

</svg>
`;

fs.mkdirSync("generated", {recursive:true});

fs.writeFileSync("generated/stats.svg", statsSVG);
fs.writeFileSync("generated/languages.svg", langSVG);