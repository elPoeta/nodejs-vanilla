const handlerUser = require('./users');

module.exports = (data, callback) => {

  const handlerPing = () => {
    callback(200);
  }

  const handlerNotFound = () => {
    callback(404);
  }

  const router = {
    'ping': handlerPing,
    'user': handlerUser(data, callback),
    'default': handlerNotFound
  }

  return router[data.trimedPath] || router.default;
}