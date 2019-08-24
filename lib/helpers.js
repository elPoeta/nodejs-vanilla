const crypto = require('crypto');
const config = require('../config/config');

module.exports = {
    parseJsonObject: str => {
        try {
            const strParsed = JSON.parse(str);
            return strParsed;
        } catch (error) {
            console.log("Error :: ", error.message);
            return {};
        }
    },
    hashPassword: pass => {
        if (!typeof (pass) == 'string' && !pass.trim().length) {
            return false;
        }
        const hashPassword = crypto.createHmac('sha256', config.hashingSecret).update(pass).digest('hex');
        return hashPassword;
    },
    isEmpty: value =>
        value === undefined ||
        value === null ||
        (typeof value === "object" && !Object.keys(value).length) ||
        (typeof value === "string" && !value.trim().length)
}