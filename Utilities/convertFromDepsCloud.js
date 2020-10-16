const fs = require('fs')
      path = require('path')

const depsInputPath =
    process.env.MARINER_OUTPUT_FILE_PATH ||
    path.join(__dirname, '..', 'DepsCloud', 'candidate.json');
const depsOutputPath =
    process.env.MARINER_MARKDOWN_FILE_PATH ||
    path.join(__dirname, '..', 'DepsCloud', 'candidate-output.json');

function convert(deps) {
  result = {};
  for(var item in deps) {
    // Format may change?
    var first = deps[item].repository_url;
    var second = deps[item].score;
    // Assuming all URIs would have a double slash, we follow the slashes to get owner and repo
    firstpull = first.split("//")[1];
    cut = firstpull.split("/")[2]
    if (cut.includes(".git")) {
      cut = cut.split(".")[0]
    }
    first = firstpull.split("/")[1] + "/" + cut;
    console.log("** ITEM: " + first);
    result[first] = second;
  }
  //Final JSON Product
  return JSON.stringify(result, null, 4)
}

//Read file, send it out,and get it back
function gather() {
  const depsInput = fs.readFileSync(depsInputPath, {
    encoding: 'utf8',
  })
  deps = JSON.parse(depsInput)
  built = convert(deps)
  fs.writeFileSync(depsOutputPath, built)
  return "Success! The file is in the DepsCloud directory"
}

module.exports = {
  gather
};
