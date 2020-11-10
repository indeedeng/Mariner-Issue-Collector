const { DateTime } = require('luxon')
      fs = require('fs')
      path = require('path')

const outputFilePath =
    process.env.MARINER_OUTPUT_FILE_PATH ||
    path.join(__dirname, '..', 'OutputFiles', 'outputData.json');
const markdownFilePath =
    process.env.MARINER_MARKDOWN_FILE_PATH ||
    path.join(__dirname, '..', 'OutputFiles', 'confluenceMarkdown.md');

const maxIssuesAge =
    process.env.MARINER_MAX_ISSUES_AGE ||
    30

const now = DateTime.local()

var dependencies = {}
    markdownArray = []

function generateMarkdown() {
  markdownArray.push(`h2. Updated: ${now.toLocaleString(DateTime.DATETIME_FULL)}`)
  for(dependency in dependencies) {
    if (!dependencies[dependency].length) continue
    markdownArray.push('\n')
    markdownArray.push(`h3. ${dependency}`)
    markdownArray.push('||*Title*||*Age*||')
    for(issue in dependencies[dependency]) {
      var issueAge = Math.round(now.diff(DateTime.fromISO(dependencies[dependency][issue].createdAt), 'days').days)
      if (issueAge < maxIssuesAge) {
        markdownArray.push(`|[${dependencies[dependency][issue].title}|${dependencies[dependency][issue].url}]|${issueAge}&nbsp;days|`);
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
