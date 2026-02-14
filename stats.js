import { Octokit } from "@octokit/rest";
import { graphql } from "@octokit/graphql";
import fs from "fs";

const token = process.env.GH_TOKEN;
const username = "1imperador0";

const octokit = new Octokit({ auth: token });

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

async function getLanguages() {
  const repos = await octokit.repos.listForUser({
    username,
    per_page: 100
  });

  let languages = {};

  for (const repo of repos.data) {
    const langs = await octokit.repos.listLanguages({
      owner: username,
      repo: repo.name
    });

    for (const [lang, value] of Object.entries(langs.data)) {
      languages[lang] = (languages[lang] || 0) + value;
    }
  }

  return languages;
}

async function getContributions() {
  const data = await graphqlWithAuth(`
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
        }
      }
    }
  `);

  return data.user.contributionsCollection;
}

async function run() {
  const languages = await getLanguages();
  const contrib = await getContributions();

  const score =
    (contrib.totalCommitContributions * 1) +
    (contrib.totalPullRequestContributions * 3) +
    (contrib.totalIssueContributions * 2);

  const output = {
    languages,
    contributions: {
      total: contrib.contributionCalendar.totalContributions,
      commits: contrib.totalCommitContributions,
      prs: contrib.totalPullRequestContributions,
      issues: contrib.totalIssueContributions
    },
    score
  };

  fs.writeFileSync("stats.json", JSON.stringify(output, null, 2));
}

run();