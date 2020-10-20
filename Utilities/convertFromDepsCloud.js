const fs = require('fs')
      path = require('path')

const depsInputPath =
    process.env.MARINER_DEPSCLOUD_INPUT ||
    path.join(__dirname, '..', 'InputFiles', 'candidate.json');
const depsOutputPath =
    process.env.MARINER_DEPSCLOUD_OUTPUT ||
    path.join(__dirname, '..', 'OutputFiles', 'candidate-converted.json');

function convert(deps) {
  result = {};
  for(var item in deps) {
    var first = deps[item].repository_url;
    var second = deps[item].score;
    // Assuming all URIs would have a double slash, we follow the slashes to get owner and repo
    var pull = first.split("//")[1];
    var owner = pull.split("/")[1];
    var repo = pull.split("/")[2];
    if (repo.includes(".git")) {
      repo = repo.split(".")[0];
    }
    first = owner + "/" + repo;
    console.log("** ITEM: " + first);
    result[first] = second;
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
  built = convert(deps)
  fs.writeFileSync(depsOutputPath, JSON.stringify(built, null, 4))
  return "Success! The file is in the DepsCloud directory"
}

module.exports = {
  gather
};

gather();
