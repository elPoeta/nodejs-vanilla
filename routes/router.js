const handlerUser = require('./users');
const handlerToken = require('./tokens');
const handlerChecks = require('./checks');

module.exports = (data, callback) => {

  const handlerPing = () => {
    callback(200);
  }

  const handlerNotFound = () => {
    callback(404);
  }

  const router = {
    'ping': handlerPing,
    'api/user': handlerUser(data, callback),
    'api/token': handlerToken(data, callback),
    'api/checks': handlerChecks(data, callback),
    'default': handlerNotFound
  }

  return router[data.trimedPath] || router.default;
}