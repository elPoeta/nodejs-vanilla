const dataStore = require('../lib/data');
const { hashPassword } = require('../lib/helpers');

module.exports = (data, callback) => {
  const methods = ['get', 'post', 'put', 'delete'];
  const method = methods[data.method] > -1 ? data.method : 'default';

  const tokenGet = () => {
    callback(200, { ok: 'Get token' });
  }

  const tokenPost = () => {
    callback(200, { ok: 'Post token' });

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