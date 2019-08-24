module.exports = (data, callback) => {
  const methods = ['get', 'post', 'put', 'delete'];
  const method = methods.indexOf(data.method) > -1 ? data.method : 'default';

  const userGet = () => {
    callback(200, { name: 'Leonardo' });
  }
  const invalidMethod = () => {
    callback(400);
  }

  const chosenMethod = {
    get: userGet,
    deafult: invalidMethod
  }

  return chosenMethod[method] || chosenMethod.deafult;
}



