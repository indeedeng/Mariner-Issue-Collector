# Mariner Issue Collector

![OSS Lifecycle](https://img.shields.io/osslifecycle/indeedeng/mariner-issue-collector.svg)

Mariner Issue Collector is a live demo that implements the [Mariner](https://github.com/indeedeng/mariner) library. This demo is configured to run automatically as a GitHub Action.

Mariner helps you identify recently opened issues in a list of GitHub repositories that you provide. We use Mariner at Indeed to identify beginner-friendly issues that were recently opened in open source projects that we depend on.

## Getting Started

Running the Mariner Issue Collector requires a few steps.

### Step 1 : Update the list of repos

Update the [inputData](./InputFiles/inputData.json) file with repositories you're interested in. We have successfully tested this file with nearly 10,000 repos, which ran in about 15 minutes. The inputData.json file should be a JSON object with "owner/repo" as key, and a numeric value that represents the "weight" of the repository. Weight is not currently used, but could be used to put the issues in order of importance to you (e.g. how often a dependency is used in your organization).

### Step 2 : Set environment variables

At a minimum, the demo app will expect you to have set a MARINER_GITHUB_TOKEN environment variable, containing an auth token for the GitHub API. Other environment variables, and their default values, are shown below.

```
MARINER_GITHUB_TOKEN: Your Auth Token
MARINER_INPUT_FILE_PATH: "./InputFiles/inputData.json"
MARINER_OUTPUT_FILE_PATH: "./OutputFiles/outputData.json"
MARINER_MARKDOWN_FILE_PATH: "./OutputFiles/githubMarkdown.md"
MARINER_MAX_ISSUES_AGE: "30"
```

### Step 3 : Run Mariner

Start by installing.

```
npm install
```

Run the findIssues.js script

```
node findIssues.js
```

This will update the [outputData](./OutputFiles/outputData.json) file with any issues that Mariner finds.


Optionally, generate markdown based on the new set of issues.

```
node Utilities/generateGitHubMarkdown.js
```

This will parse the outputData.json file and update the [githubMarkdown](./OutputFiles/githubMarkdown.md) with a list of issues that can be easily viewed on GitHub.

## Mariner Issue Collector As A GitHub Action

Mariner ships with a default GitHub Action that runs every 8 hours to generate a fresh issue list. Details are in the [action YAML file](./.github/workflows/main.yml)

## Getting Help

If you need help or find bugs, please open an issue.

## How To Contribute

Before starting any new work, please open an issue and tell us about the contribution you'd like to make.

## Project Maintainers

This project is primarily maintained by @DuaneOBrien.

## Code of Conduct
This project is governed by the [Contributor Covenant v 1.4.1](CODE_OF_CONDUCT.md)

## License
This project uses the [MIT](LICENSE) license.
