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

const saveRoomAndMembers = (roomID, members, callback) => {
  const promisedMembers = members.map((memberEmail) => {
    return db.models.User.findOrCreate({
      where: {
        email: memberEmail,
        zipcode: 78702,
      },
    });
  });

  db.models.Room.findOrCreate({
    where: {
      uniqueid: roomID,
      zipcode: 78702,
    },
  })
    .then((room) => {
      Promise.all(promisedMembers)
        .then((users) => {
          users.forEach((user) => {
            room[0].addUser(user[0]);
          });
          callback(null, room, users);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { saveMember, saveRoomAndMembers };
