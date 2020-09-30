const fs = require('fs')
      path = require('path')
      moment = require('moment')

const outputFilePath =
    process.env.MARINER_OUTPUT_FILE_PATH ||
    path.join(__dirname, '..', 'OutputFiles', 'outputData.json');
const markdownFilePath =
    process.env.MARINER_MARKDOWN_FILE_PATH ||
    path.join(__dirname, '..', 'OutputFiles', 'githubMarkdown.md');

const maxIssuesAge =
    process.env.MARINER_MAX_ISSUES_AGE ||
    30

const now = moment()

var dependencies = {}
    markdownArray = []

function generateMarkdown() {
  markdownArray.push('|**Repo**|**Title**|**Age**|')
  markdownArray.push('|:----|:----|:----|')
  for (dependency in dependencies) {
    for (issue in dependencies[dependency]) {
      var issueAge = now.diff(moment(dependencies[dependency][issue].createdAt), 'days')
      if (issueAge < maxIssuesAge) {
        markdownArray.push(`|**${dependency}**|[${dependencies[dependency][issue].title}](${dependencies[dependency][issue].url})|${issueAge}&nbsp;days|`);
      }
    }
  }
}

fs.exists(outputFilePath, (exists) => {
  if (exists) {
    const contents = fs.readFileSync(outputFilePath, {
        encoding: 'utf8',
    })
    dependencies = JSON.parse(contents)
    generateMarkdown()
    fs.writeFileSync(markdownFilePath, markdownArray.join('\n'))
  } else {
    console.error("Input file does not exist", outputFilePath)
    return
  }
})
