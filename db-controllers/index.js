const db = require('../database-postgresql/models');

const saveMembers = (members, callback) => {
  members.forEach((user) => {
    db.models.User.create({
      email: user,
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

module.exports.saveMembers = saveMembers;

module.exports.saveRoom = saveRoom;
