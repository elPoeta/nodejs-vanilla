module.exports = (url, callback) => {

  const handlerSample = () => {
    callback(200, { name: 'Leonardo Tosetto' });
  }

  const handlerNotFound = () => {
    callback(404, {});
  }

  const handlers = {
    'sample': handlerSample,
    'default': handlerNotFound
  }

  return handlers[url] || handlers.default;
}