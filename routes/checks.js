module.exports = (data, callback) => {
  const methods = ['get', 'post', 'put', 'delete'];
  const method = methods.indexOf(data.method) > -1 ? data.method : 'default';

  const checkGet = () => {

  }

  const checkPost = () => {

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