# Mariner Issue Collector

![OSS Lifecycle](https://img.shields.io/osslifecycle/indeedeng/mariner-issue-collector.svg)

Mariner Issue Collector is a live demo that implements the [Mariner](https://github.com/indeedeng/mariner) library. This demo is configured to run automatically as a GitHub Action.

Mariner helps you identify recently opened issues in a list of GitHub repositories that you provide. We use Mariner at Indeed to identify beginner-friendly issues that were recently opened in open source projects that we depend on.

## Getting Started

Running the Mariner Issue Collector requires a few steps.

### Step 1 : Update the list of repos

Update the [inputData](./InputFiles/inputData.json) file with repositories and the [issueLabels](./InputFiles/issueLabels.json) file with issue labels you're interested in. We have successfully tested this file with nearly 10,000 repos, which ran in about 15 minutes. 

The inputData.json file should be a JSON object with "owner/repo" as key, and a numeric value that represents the "weight" of the repository. 

The issueLabels.json file should be a JSON array containing search terms as strings.

The numerical weights assigned to each repo in the inputData.json file determine the order in which the results are listed. Weight should be assigned according to importance to you (e.g. how often a dependency is used in your organization).

The greatest weight appears first, then results continue in descending order. If all weights are equal the results appear in the order they are listed in the inputData.json object.

GitHub paginates results in sets of 30. Different amounts can be specified up to 100.

### Step 2 : Set environment variables

At a minimum, the demo app will expect you to have set a MARINER_GITHUB_TOKEN environment variable, containing an auth token for the GitHub API. Other environment variables, and their default values, are shown below.

```
MARINER_GITHUB_TOKEN: Your Auth Token
MARINER_LABELS_FILE_PATH: "./InputFiles/issueLabels.json"
MARINER_INPUT_FILE_PATH: "./InputFiles/inputData.json"
MARINER_OUTPUT_FILE_PATH: "./OutputFiles/outputData.json"
MARINER_MARKDOWN_FILE_PATH: "./OutputFiles/githubMarkdown.md"
MARINER_MAX_ISSUES_AGE: "30"
```

MARINER_MAX_ISSUES_AGE sets a limit on the age of issues to be returned, measured in days. You can change it to reflect your desired scope.

### Step 3 : Run Mariner

Start by downloading dependencies:

```bash
npm ci
```

Run the findIssues.js script:

```bash
node findIssues.js
```

This will update the [outputData](./OutputFiles/outputData.json) file with any issues that Mariner finds.


Optionally, generate markdown based on the new set of issues:

```bash
node Utilities/generateGitHubMarkdown.js
```

This will parse the outputData.json file and update the [githubMarkdown](./OutputFiles/githubMarkdown.md) with a list of issues that can be easily viewed on GitHub.

Or generate markdown for use in Confluence/Jira:

```bash
node Utilities/generateConfluenceMarkdown.js
```

In Jira, simply copy and paste the contents of [confluenceMarkdown](./OutputFiles/confluenceMarkdown.md) into the text mode of the editor.

Also, generate static HTML file that shows the new issues:

```bash
node Utilities/generateHtml.js
```

This will parse the outputData.json file and update the [Issues.html](./OutputFiles/Issues.html) with the list of issues.

## Mariner Issue Collector As A GitHub Action

Mariner ships with a default GitHub Action that runs every 8 hours to generate a fresh issue list,
and commit that issue list back into the GitHub repository.
Any fork of this repository will automatically include this action,
as it is triggered by the existence of the [action YAML file](./.github/workflows/main.yml).

##Use Mariner Issue Collector In A Private Repo

To use the demo app in a private repo, you will need to add an SSH key to Mariner Issue Collector that has read access to the private repository.

## Getting Help

If you need help or find bugs, please open an issue.

## How To Contribute

If you see an open issue that you would like to work on, please make sure the issue has the "unclaimed" tag, and that there are no open pull requests for the issue.

If an issue has the "unclaimed" tag, and you would like to claim it, comment on the issue. A maintainer will add the "claimed" tag to the issue and indicate to whom it has been assigned.  

If you want to propose a new feature, please open an issue and tell us about the contribution you'd like to make. 

**Regarding Hacktoberfest:** We will only tag pull requests with "hacktoberfest accepted" if:
* The pull request references a claimed issue with the Hacktoberfest label
* The pull request was submitted by the person who claimed the issue

## Project Maintainers

This project is primarily maintained by @DuaneOBrien.

## Code of Conduct
This project is governed by the [Contributor Covenant v 1.4.1](CODE_OF_CONDUCT.md)

## License
This project uses the [MIT](LICENSE) license.
