const crypto = require('crypto');
const config = require('../config/config');

module.exports = {
    parseJsonObject: str => {
        try {
            const strParsed = JSON.parse(str);
            return strParsed;
        } catch (error) {
            console.log("Parsed Error :: ", error.message);
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
    createRandomString: strLength => {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        let str = '';
        for (let i = 0; i < strLength; i++) {
            const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
            str += randomChar;
        }
        return str;
    },
    isEmpty: value =>
        value === undefined ||
        value === null ||
        (typeof value === "object" && !Object.keys(value).length) ||
        (typeof value === "string" && !value.trim().length)
}