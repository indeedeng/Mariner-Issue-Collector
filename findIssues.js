const fs = require('fs')
      path = require('path')
      moment = require('moment')
      mariner = require('oss-mariner')

function getFromEnvOrThrow(configField) {
    const value = process.env[configField];
    if (!value) {
        throw new Error(`${configField} is required`);
    }

    return value;
}

const token = getFromEnvOrThrow('MARINER_GITHUB_TOKEN');
const inputFilePath =
    process.env.MARINER_INPUT_FILE_PATH ||
    path.join(__dirname, 'InputFiles', 'inputData.json');
const outputFilePath =
    process.env.MARINER_OUTPUT_FILE_PATH ||
    path.join(__dirname, 'OutputFiles', 'outputData.json');

class FancyLogger {
    info(message) {
        console.log('***INFO: ' + message);
    }
    error(message) {
        console.log('***ERROR: ' + message);
    }
}

const logger = new FancyLogger();

logger.info(`Input:  ${inputFilePath}`);
logger.info(`Output: ${outputFilePath}`);

const contents = fs.readFileSync(inputFilePath, {
    encoding: 'utf8',
});
const countsByLibrary = JSON.parse(contents);
const repositoryIdentifiers = Object.keys(countsByLibrary);

const finder = new mariner.IssueFinder(logger);

function convertToRecord(issues) {
    const record = {};
    repositoryIdentifiers
        .sort((a, b) => countsByLibrary[b] - countsByLibrary[a])
        .map(a => record[a] = [])
    issues.forEach((issuesForRepo, repo) => {
        record[repo] = issuesForRepo;
    });
    const jsonFile = outputToJson(record);

    return jsonFile;
}

function outputToJson(record) {
    const noReplacer = undefined;
    const indent = 2;
    const jsonResults = JSON.stringify(record, noReplacer, indent);
    const data = fs.writeFileSync(outputFilePath, jsonResults);

    return data;
}

function formatLabels(labels) {
    return labels.map((label) => label.replace(/\s/g, '+'));
}

const labelsFilePath = 
    process.env.MARINER_LABELS_FILE_PATH ||
    path.join(__dirname, 'InputFiles', 'issueLabels.json');

logger.info(`Labels:  ${labelsFilePath}`);

const labelsJSON = fs.readFileSync(labelsFilePath, {
    encoding: 'utf8',
});
const formattedLabels = formatLabels(JSON.parse(labelsJSON));

finder
    .findIssues(token, formattedLabels, repositoryIdentifiers)
    .then((issues) => {
        let issueCount = 0;
        issues.forEach((issuesForRepo) => {
            issueCount += issuesForRepo.length;
        });

        convertToRecord(issues);
        logger.info(`Found ${issueCount} issues in ${issues.size} projects\n`);
        logger.info(`Saved issue results to: ${outputFilePath}`);
    })
    .catch((err) => {
        logger.error(err.message);
        console.log(err);
    });
