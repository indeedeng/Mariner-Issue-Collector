const fs = require('fs')
      path = require('path')
      moment = require('moment')

const outputFilePath =
    process.env.MARINER_OUTPUT_FILE_PATH ||
    path.join(__dirname, '..', 'OutputFiles', 'outputData.json');
const htmlFilePath =
    process.env.MARINER_HTML_FILE_PATH ||
    path.join(__dirname, '..', 'OutputFiles', 'Issues.html');

const maxIssuesAge =
    process.env.MARINER_MAX_ISSUES_AGE ||
    30

const now = moment()

var dependencies = {}
    htmlContent = ""


function generateHTML() {
  htmlContent += `<!DOCTYPE html>
  <html>
  <head>
    <title>Issues by Mariner-Issue-Collector</title>
    <style>
      table {
        border-collapse: collapse;
        width: auto;
        max-width: 100%;
        margin-bottom: 20px;
        border: 1px solid #ddd;
      }
      td {
        border: 1px solid #ddd;
        padding: 8px;
      }
      th {
        padding: 8px;
        line-height: 1.4285714;
        border: 1px solid #ddd;
      }
      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      tr:nth-child(even) {
        background-color: #f9f9f9;
      }
    </style>
  </head>
  <body>
  `;

  htmlContent += `<h2 class="code-line" data-line-start=0 data-line-end=1 >
      <a id="Updated_${now.format("LLL")}"></a>
        Updated: ${now.format("LLL")}
  </h2>
  `;

  for(dependency in dependencies) {
    if (!dependencies[dependency].length) continue
    htmlContent += `<h3 class="code-line" data-line-start=3 data-line-end=4 >
      <a id="${dependency}"></a>${dependency}
    </h3>
    `;

    htmlContent += `<table>
      <thead>
        <tr>
          <th style="text-align:left"><strong>Title</strong></th>
          <th style="text-align:left"><strong>Age</strong></th>
        </tr>
      </thead>
      <tbody>
      `;

    for(issue in dependencies[dependency]) {
      var issueAge = now.diff(moment(dependencies[dependency][issue].createdAt), 'days')
      if (issueAge < maxIssuesAge) {
        htmlContent += `<tr>
          <td style="text-align:left">
            <a href="${dependencies[dependency][issue].url}" target="_blank">
              ${dependencies[dependency][issue].title}
            </a>
          </td>
          <td style="text-align:left">${issueAge} days</td>
        </tr>`;
      }
    }
    htmlContent += `</tbody>
    </table>
    `;
  }

  htmlContent += `</body>
  </html>`
}


fs.exists(outputFilePath, (exists) => {
  if (exists) {
    const contents = fs.readFileSync(outputFilePath, {
        encoding: 'utf8',
    })
    dependencies = JSON.parse(contents)
    generateHTML()
    fs.writeFileSync(htmlFilePath, htmlContent)
  } else {
    console.error("Input file does not exist", outputFilePath)
    return
  }
})
