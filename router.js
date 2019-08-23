module.exports = (data, callback) => {

  const handlerPing = () => {
    callback(200);
  }

  const handlerNotFound = () => {
    callback(404);
  }

  const router = {
    'ping': handlerPing,
    'default': handlerNotFound
  }

  return router[data.trimedPath] || router.default;
}