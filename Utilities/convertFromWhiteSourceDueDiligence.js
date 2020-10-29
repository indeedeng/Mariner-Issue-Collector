const fs = require('fs')
      path = require('path')

const whitesourceInputPath =
    process.env.MARINER_WHITESOURCE_INPUT ||
    path.join(__dirname, '..', 'InputFiles', 'whitesource-due-diligence-sample.json');
const whitesourceOutputPath =
    process.env.MARINER_WHITESOURCE_OUTPUT ||
    path.join(__dirname, '..', 'OutputFiles', 'whitesource-due-diligence-report-converted.json');

var cases = {
  "one" : false,
  "two" : false,
  "three" : false,
  "four" : false,
  "five" : false,
  "six" : false
}

function stripProtocol(url) {
  return url.replace(/^(http|https):\/\//, '')
}

function explodeUrl(url) {
  return url.split('/')
}

function convert(deps) {
  result = {}
  sortedOutput = {}
  dependencyList = []

  for (library in deps.licenses) {
    var dependency = false
        occurrences = 0
        homepage = deps.licenses[library].homepage
        reference = deps.licenses[library].reference
        referenceType = deps.licenses[library].reference_type

    // There are several places that a GitHub URL might show up.

    // Try the homepage first
    if(homepage !== undefined && homepage.match(/github/)) {
      // Strip out leading http|https
      homepage = stripProtocol(homepage)
      // Only look at dependencies from GitHub
      if (homepage.includes('api.github.com/repos')) {
        // Handles cases like apis.github.com/repos/GITHUBUSERORORG/GITHUBREPO/zipball/GITHUBBRANCH
        dependency = homepage.replace(/\/zipball\/.+/, '')
        dependency = dependency.replace(/api.github.com\/repos\//, '')
        // Now it's apis.github.com/repos/GITHUBUSERORORG/GITHUBREPO
        if (cases.one === false) {
          cases.one = deps.licenses[library]
        }
        console.log("** REPO CASE 1: " + dependency);
      } else if (homepage.match(/^github.com/)) {
        // Handles cases like github.com/ORG/REPO/MAYBEMORE
        exploded = explodeUrl(homepage)
        // Now it's [ 'github.com', 'GITHUBUSERORORG', 'GITHUBREPO', 'MAYBEOTHERSTUFF' ]
        if (exploded[2] === undefined || exploded[2] === '') {
          // They used a github.com domain but didn't specify a repo
          continue
        }
        dependency = (exploded[1] + '/' + exploded[2]).toLowerCase()
        if (cases.two === false) {
          cases.two = deps.licenses[library]
        }
        console.log("** REPO CASE 2: " + dependency);
      } else if (homepage.match(/(.*)\.github.io/)) {
        // Handles cases like GITHUBUSERORORG.github.io/GITHUBREPO/MAYBEOTHERSTUFF
        exploded = explodeUrl(homepage)
        if (exploded[1] === undefined) {
          // They used a github.io domain but didn't specify a repo
          continue
        }
        // Now it's [ 'GITHUBUSERORORG.github.io', 'GITHUBREPO', 'MAYBEOTHERSTUFF' ]
        exploded[0] = exploded[0].replace(/\.github\.io/, '')
        // Now it's [ 'GITHUBUSERORORG', 'GITHUBREPO', 'MAYBEOTHERSTUFF' ]
        dependency = exploded[0] + '/' + exploded[1]
        if (cases.three === false) {
          cases.three = deps.licenses[library]
        }
        console.log("** REPO CASE 3: " + dependency);
      } else {
        // There is no github in the homepage
        // TODO: We should try the other methods/locations for finding GitHub URLs
        continue
      }
    } else if (referenceType !== undefined && reference !== undefined) {
      if (referenceType === 'Project home page') {
        if (reference.match(/github.com/)) {
          // This coule be improved to handle node_modules and github.io pages but it's a good start.
          homepage = stripProtocol(reference)
          exploded = explodeUrl(homepage)
          if (exploded[2] === undefined || exploded[2] === 'LICENSE') {
            // They used a github.com domain but didn't specify a repo
            continue
          }
          dependency = exploded[1] + '/' + exploded[2]
          if (cases.four === false) {
            cases.four = deps.licenses[library]
          }
          console.log("** REPO CASE 4: " + dependency);
        }
      } else if (referenceType === 'POM file') {
        // To Date, none of the POM file references have had github data in them, but just in case...
        if (reference.match(/.+\/com\/github\/.+/i)) {
          exploded = explodeUrl(reference)
          index = exploded.indexOf('github')
          dependency = exploded[index+1] + '/' + exploded[index+2]
          if (cases.five === false) {
            cases.five = deps.licenses[library]
          }

          console.log("** REPO CASE 5: " + dependency)
        }
      } else if (referenceType === 'License File') {
        if (reference.match(/.+github.+/)) {
          homepage = stripProtocol(reference.replace(/^.+http/, 'http'))
          exploded = explodeUrl(homepage)
          if (exploded[2] === undefined || exploded[2] === 'LICENSE') {
            // They used a github.com domain but didn't specify a repo
            continue
          }
          dependency = exploded[1] + '/' + exploded[2]
          if (cases.six === false) {
            cases.six = deps.licenses[library]
          }
          console.log("** REPO CASE 6: " + dependency);
        }
      } else if (reference.match(/cdnjs/)){
        // TODO: We can get at these by querying the CDNJS API
        // cf https://api.cdnjs.com/libraries?search=bluebird&fields=repository
        // cf https://cdnjs.com/api
      } else {
        // Reference type but no reference, skip this one
        continue
      }
    } else {
      // No homepage and no solid reference, skip this one
      continue
    }
    if (dependency !== false) {
      dependency = dependency.replace(/\#.+$/, '')
      dependency = dependency.replace(/\.git$/, '')
      if (result.hasOwnProperty(dependency)) {
        occurrences = result[dependency] + 1
      } else {
        dependencyList.push(dependency)
        occurrences = 1
      }
      result[dependency] = occurrences
    }
  }

  dependencyList.sort(function (a, b) {
    return result[b] - result[a];
  });

  for (dependency in dependencyList) {
    sortedOutput[dependencyList[dependency]] = result[dependencyList[dependency]]
  }

  return sortedOutput
}

//Read file, send it out,and get it back
async function gather() {
  const whitesourceInput = fs.readFileSync(whitesourceInputPath, {
    encoding: 'utf8'
  })
  const whitesourceReport = JSON.parse(whitesourceInput, {
    compact: true, spaces: 4
  })
  builtJSON = await convert(whitesourceReport)
  fs.writeFileSync(whitesourceOutputPath, JSON.stringify(builtJSON, null, 4))
}

gather();
