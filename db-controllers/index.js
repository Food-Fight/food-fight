const db = require('../database-postgresql/models');
const bcrypt = require('bcrypt');

const saveMember = (email, password, zipcode, callback) => {
  let hashedPW;
  if (password) {
    const salt = bcrypt.genSaltSync(3);
    hashedPW = bcrypt.hashSync(password, salt);
  }
  db.models.User.create({
    email,
    password: hashedPW,
    zipcode,
  })
    .then((result) => {
      callback(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

const saveMembers = (members, callback) => {
  members.forEach((user) => {
    db.models.User.create({
      email: user.email,
      password: user.password,
      zipcode: 78702,
    })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error);
      });
  });
};

const saveRoom = (id, callback) => {
  db.models.Room.create({
    uniqueid: id,
    zipcode: 78702,
  })
    .then((result) => {
      callback(null, result);
    })
    .catch((error) => {
      callback(error);
    });
};

module.exports = { saveMember, saveMembers, saveRoom };
