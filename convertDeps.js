const path = require('path')

class FancyLogger {
    info(message) {
        console.log('***INFO: ' + message);
    }
    error(message) {
        console.log('***ERROR: ' + message);
    }
}

const logger = new FancyLogger();

const depsCloudFilePath =
    process.env.MARINER_UTILITY_FILE_PATH ||
    path.join(__dirname, 'Utilities', 'convertFromDepsCloud.js');

const depsCloud = require(depsCloudFilePath)

logger.info(depsCloud.gather());
