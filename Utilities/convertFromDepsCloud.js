const fs = require('fs')
      path = require('path')
      url = require('url')

const depsInputPath =
    process.env.MARINER_DEPSCLOUD_INPUT ||
    path.join(__dirname, '..', 'InputFiles', 'candidate.json');
const depsOutputPath =
    process.env.MARINER_DEPSCLOUD_OUTPUT ||
    path.join(__dirname, '..', 'OutputFiles', 'candidate-converted.json');

function convert(deps) {
  result = {};
  for(var entry in deps) {
    const depsURL = url.parse(deps[entry].repository_url);
    const host = depsURL.host
    const fullPath = depsURL.pathname;
    // Using contains here to give a chance to each URL containing 'github.com'
    if (host.indexOf("github.com") >= 0) {
      var repoScore = deps[entry].score;
      // Count the slashes
      var slashCount = (fullPath.match(/\//ig) || []).length;
      // Check if pathname contains at least two slashes
      if (slashCount >= 2) {
        // We follow the slashes to get owner and repo
        repoPath = fullPath.split("/");
        var owner = repoPath[1];
        var repo = repoPath[2];
        if (repo.endsWith(".git")) {
          repo = repo.replace(/\.git$/, '');
        }
        repoIdentifier = owner + "/" + repo;
        console.log("** REPO: " + repoIdentifier);
        result[repoIdentifier] = repoScore;
      } else {
        console.log("** REPO: " + fullPath + " Skipped - No OWNER REPO pair");
      }
    } else {
      console.log("** REPO: " + fullPath + " Skipped - Not a GitHub URL");
    }
  }
  //Final JSON Product
  return result
}

//Read file, send it out,and get it back
function gather() {
  const depsInput = fs.readFileSync(depsInputPath, {
    encoding: 'utf8',
  })
  deps = JSON.parse(depsInput)
  builtJSON = convert(deps)
  fs.writeFileSync(depsOutputPath, JSON.stringify(builtJSON, null, 4))
}

gather();
