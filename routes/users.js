module.exports = (data, callback) => {
  const methods = ['get', 'post', 'put', 'delete'];
  const method = methods.indexOf(data.method) > -1 ? data.method : 'default';

  const userGet = () => {
    callback(200, { getU: 'READ OK' });
  }

  const userPost = () => {
    callback(200, { postU: 'CREATE OK' });
  }

  const userPut = () => {
    callback(200, { putU: 'UPDATE OK' });
  }

  const userDelete = () => {
    callback(200, { delU: 'DELETE OK' });
  }

  const invalidMethod = () => {
    callback(400);
  }

  const chosenMethod = {
    get: userGet,
    post: userPost,
    put: userPut,
    delete: userDelete,
    deafult: invalidMethod
  }

  return chosenMethod[method] || chosenMethod.deafult;
}



