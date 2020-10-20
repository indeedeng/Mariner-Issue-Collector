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
    const fullPath = url.parse(deps[entry].repository_url).pathname;
    var repoScore = deps[entry].score;
    // Assuming all URIs would have a double slash, we follow the slashes to get owner and repo
    repoPath = fullPath.split("/");
    var owner = repoPath[1];
    var repo = repoPath[2];
    if (repo.endsWith(".git")) {
      repo = repo.replace(/\.git$/, '');
    }
    repoIdentifier = owner + "/" + repo;
    console.log("** REPO: " + repoIdentifier);
    result[repoIdentifier] = repoScore;
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
