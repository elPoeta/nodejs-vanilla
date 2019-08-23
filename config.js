const environments = {};

environments.dev = {
    httpPort: 4000,
    httpsPort: 4001,
    envName: 'dev'
}

environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production'
}

const currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
const environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.dev;

module.exports = environmentToExport;