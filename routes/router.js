const handlerUser = require('./users');
const handdlerToken = require('./tokens');

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
    'api/token': handdlerToken(data, callback),
    'default': handlerNotFound
  }

  return router[data.trimedPath] || router.default;
}