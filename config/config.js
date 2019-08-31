const environments = {};

environments.dev = {
    httpPort: 4000,
    httpsPort: 4001,
    envName: 'dev',
    hashingSecret: 'thisIsAhasDevSuperSecret',
    maxChecks: 5
}

environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashingSecret: 'thisIsAhasPRODSuperSecret',
    maxChecks: 5
}

const currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
const environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.dev;

module.exports = environmentToExport;