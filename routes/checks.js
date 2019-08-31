const dataStore = require('../lib/data');

module.exports = (data, callback) => {
  const methods = ['get', 'post', 'put', 'delete'];
  const method = methods.indexOf(data.method) > -1 ? data.method : 'default';

  const checkGet = () => {

  }

  const checkPost = () => {
    const protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    const url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    const method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    const successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    const timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    if (!protocol && !url && !method && !successCodes && !timeoutSeconds) {
      callback(400, { error: 'Missing required field, or field invalid' });
      return;
    }
    const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
    if (!token) {
      callback(403, { error: 'Token is not present' });
    }

    dataStore.read('tokens', token, (err, tokenData) => {
      if (err) {
        callback(403, { error: 'Invalid Token' });
        return;
      }

      const userPhone = tokenData.phone;
      dataStore.read('users', userPhone, (err, userData) => {
        if (err) {
          callback(403, { error: 'Invalid User' });
          return;
        }
        const userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
        if (userChecks.length > config.maxChecks) {
          callback(400, { error: `The user already has the maximum number of checks (${config.maxChecks}).` });
          return;
        }
        const checkId = helpers.createRandomString(20);
        const checkObject = {
          'id': checkId,
          userPhone,
          protocol,
          url,
          method,
          successCodes,
          timeoutSeconds
        };

        dataStore.create('checks', checkId, checkObject, err => {
          if (err) {
            callback(500, { error: 'Could not create the new check' });
            return;
          }
          userData.checks = userChecks;
          userData.checks.push(checkId);

          dataStore.update('users', userPhone, userData, err => {
            if (err) {
              callback(500, { error: 'Could not update the user with the new check.' });
            }
            callback(200, checkObject);
          });
        });
      });
    });

  }

  const checkPut = () => {

  }

  const checkDelete = () => {

  }

  const invalidMethod = () => {
    callback(400);
  }

  const chosenCheck = {
    get: checkGet,
    post: checkPost,
    put: checkPut,
    delete: checkDelete,
    default: invalidMethod
  }

  return chosenCheck[method] || chosenCheck.default;
}