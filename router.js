module.exports = (data, callback) => {

  const handlerSample = () => {
    callback(200, { name: 'Sample Handler' });
  }

  const handlerNotFound = () => {
    callback(404);
  }

  const router = {
    'sample': handlerSample,
    'default': handlerNotFound
  }

  return router[data.trimedPath] || router.default;
}