const db = require('../database-postgresql/models');

const saveMember = (email, password, zipcode = 78702, callback) => {
  db.models.User.create({
    email,
    password,
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
