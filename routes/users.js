const dataStore = require('../lib/data');
const { isEmpty, hashPassword } = require('../lib/helpers');

module.exports = (data, callback) => {
  const methods = ['get', 'post', 'put', 'delete'];
  const method = methods.indexOf(data.method) > -1 ? data.method : 'default';

  const userGet = () => {
    const phone = !isEmpty(data.query.phone) ? data.query.phone.trim() : false;
    if (!phone) {
      callback(400, { error: 'Error missing phone number' });
      return;
    }
    dataStore.read('users', phone, (err, data) => {
      if (err) {
        callback(403, { error: 'Error to read user data' });
        return;
      }
      delete data.password;
      callback(200, data);
    });

  }

  const userPost = () => {
    const { name, email, phone, password, toAgreement } = data.payload;
    if (!toAgreement || isEmpty(name) || isEmpty(email) || isEmpty(password) || isEmpty(phone)) {
      callback(500, { error: "One or more fields are empty" });
      return;
    }

    const hashedPassword = hashPassword(password);
    console.log('hash :: ', hashedPassword);
    if (!hashedPassword) {
      callback(500, { error: "Could not hash the password" });
      return;
    }
    dataStore.read('users', phone, (err, ds) => {
      if (!err) {
        console.log('err :: ', err);
        callback(403, { error: "User not create, user already exist" });
        return;
      }
      const userObj = {
        name,
        email,
        phone,
        password: hashedPassword,
        toAgreement
      }
      dataStore.create('users', phone, userObj, err => {
        if (err) {
          callback(403, { error: err });
          return;
        }
        callback(200, { postU: 'CREATE FILE OK' });
      });
    });
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



