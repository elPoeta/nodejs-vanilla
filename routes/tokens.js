const dataStore = require('../lib/data');
const { hashPassword, createRandomString, isEmpty } = require('../lib/helpers');

module.exports = (data, callback) => {
  const methods = ['get', 'post', 'put', 'delete'];
  const method = methods.indexOf(data.method) > -1 ? data.method : 'default';

  const tokenGet = () => {
    const tokenId = !isEmpty(data.query.tokenId) ? data.query.tokenId.trim() : false;
    if (!tokenId) {
      callback(403, { error: "Missing token" });
      return;
    }

    dataStore.read('tokens', tokenId.trim(), (err, dataToken) => {
      if (err) {
        callback(500, { error: "Token not found" });
        return;
      }
      callback(200, dataToken);
    });
  }

  const tokenPost = () => {
    const { phone, password } = data.payload;
    dataStore.read('users', phone.trim(), (err, userData) => {
      if (err) {
        callback(404, { error: "User not found" });
        return;
      }

      const hashedPassword = hashPassword(password.trim());
      if (hashedPassword != userData.password) {
        callback(403, { error: 'Invalid Password' });
        return;
      }

      const id = createRandomString(20);
      const expires = Date.now() + 1000 * 60 * 60;
      const token = {
        phone: phone.trim(),
        id,
        expires
      };

      dataStore.create('tokens', id, token, err => {
        if (err) {
          callback(500, { error: "Error to create user token" });
          return;
        }

        callback(200, token);
      });



    });
  }

  const tokenPut = () => {
    callback(200, { ok: 'Put token' });

  }

  const tokenDelete = () => {
    callback(200, { ok: 'Delete token' });

  }

  const invalidMethod = () => {
    callback(400);
  }

  chosenMethod = {
    get: tokenGet,
    post: tokenPost,
    put: tokenPut,
    delete: tokenDelete,
    default: invalidMethod
  }

  return chosenMethod[method] || chosenMethod.default;
}