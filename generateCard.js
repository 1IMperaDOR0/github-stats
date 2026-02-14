import fs from "fs";

const data = JSON.parse(fs.readFileSync("stats.json"));

const topLangs = Object.entries(data.languages)
  .sort((a,b) => b[1] - a[1])
  .slice(0,5);

const svg = `
<svg width="420" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0d1117"/>

  <text x="20" y="30" fill="#58a6ff" font-size="18">GitHub Activity</text>

  <text x="20" y="60" fill="#c9d1d9">Score: ${data.score}</text>
  <text x="20" y="80" fill="#c9d1d9">Commits: ${data.contributions.commits}</text>
  <text x="20" y="100" fill="#c9d1d9">PRs: ${data.contributions.prs}</text>
  <text x="20" y="120" fill="#c9d1d9">Issues: ${data.contributions.issues}</text>

  <text x="220" y="60" fill="#58a6ff">Top Languages</text>
  ${topLangs.map((l,i) => `<text x="220" y="${80 + i*20}" fill="#c9d1d9">${l[0]}</text>`).join("")}
</svg>
`;

fs.writeFileSync("card.svg", svg);
