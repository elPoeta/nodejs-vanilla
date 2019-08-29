const dataStore = require('../lib/data');
const { isEmpty, hashPassword, verifyToken } = require('../lib/helpers');

module.exports = (data, callback) => {
  const methods = ['get', 'post', 'put', 'delete'];
  const method = methods.indexOf(data.method) > -1 ? data.method : 'default';

  const userGet = () => {
    const phone = !isEmpty(data.query.phone) ? data.query.phone.trim() : false;
    if (!phone) {
      callback(400, { error: 'Error missing phone number' });
      return;
    }
    const tokenHeader = typeof data.headers.token == 'string' ? data.headers.token : false;
    if (!tokenHeader) {
      callback(404, { error: 'Missing Token' });
      return;
    }

    dataStore.read('users', phone, (err, data) => {
      if (err) {
        callback(404, { error: 'Error user not found' });
        return;
      }
      verifyToken(tokenHeader, phone, isValidToken => {
        if (!isValidToken) {
          callback(403, { error: 'Invalid user token' });
          return;
        }
        delete data.password;
        callback(200, data);
      });
    });
  }

  const userPost = () => {
    const { name, email, phone, password, toAgreement } = data.payload;

    if (!toAgreement || isEmpty(name) || isEmpty(email) || isEmpty(password) || isEmpty(phone)) {
      callback(500, { error: "One or more fields are empty" });
      return;
    }

    const hashedPassword = hashPassword(password);
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
    const { name, email, phone, password } = data.payload;
    const isPhone = !isEmpty(phone) ? phone.trim() : false;
    if (!isPhone) {
      callback(400, { error: 'Error missing phone number' });
      return;
    }

    const tokenHeader = typeof data.headers.token == 'string' ? data.headers.token : false;
    if (!tokenHeader) {
      callback(404, { error: 'Missing Token' });
      return;
    }

    dataStore.read('users', phone, (err, data) => {
      if (err) {
        callback(403, { error: 'User not found' });
        return;
      }
      verifyToken(tokenHeader, phone, isValidToken => {
        if (!isValidToken) {
          callback(403, { error: 'Invalid user token' });
          return;
        }
        const userData = data;
        if (name || email || password) {
          if (name) {
            userData.name = name;
          }
          if (email) {
            userData.email = email
          }
          if (password) {
            const hashedPassword = hashPassword(password);
            if (!hashedPassword) {
              callback(500, { error: "Could not hash the password" });
              return;
            }
            userData.password = hashedPassword;
          }
          dataStore.update('users', isPhone, userData, err => {
            if (err) {
              callback(500, { error: "Error to update user" });
            }
            callback(200, userData);
          });
        } else {
          callback(200);
        }
      });
    });

  }

  const userDelete = () => {
    const phone = !isEmpty(data.query.phone) ? data.query.phone.trim() : false;
    if (!phone) {
      callback(400, { error: 'Error missing phone number' });
      return;
    }

    const tokenHeader = typeof data.headers.token == 'string' ? data.headers.token : false;
    if (!tokenHeader) {
      callback(404, { error: 'Missing Token' });
      return;
    }

    dataStore.read('users', phone, (err, data) => {
      if (err) {
        callback(403, { error: 'Error user not found' });
        return;
      }
      verifyToken(tokenHeader, phone, isValidToken => {
        if (!isValidToken) {
          callback(403, { error: 'Invalid user token' });
          return;
        }
        dataStore.delete('users', phone, err => {
          if (err) {
            callback(500, { error: 'Could not delete the user' });
          }
          callback(200, { ok: 'The user was deleted' });
        });
      });
    });
  }

  const verifyToken = (tokenId, phone, callback) => {
    dataStore.read('tokens', tokenId, (err, dataToken) => {
      if (err) {
        callback(false);
        return;
      }

      if (phone != dataToken.phone && dataToken.expires < Date.now()) {
        callback(false);
        return;
      }
      callback(true);
    });
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



