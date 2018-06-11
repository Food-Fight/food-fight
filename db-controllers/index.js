const db = require('../database-postgresql/models');
const bcrypt = require('bcrypt');
const uniqueString = require('unique-string');

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

const saveRoomAndMembers = (roomName, zip, members, callback) => {
  const promisedMembers = members.map(memberEmail => db.models.User.findOne({
    where: {
      email: memberEmail,
    },
  }));

  db.models.Room.findOrCreate({
    where: {
      name: roomName,
      uniqueid: uniqueString(),
      zipcode: zip,
    },
  })
    .then((room) => {
      Promise.all(promisedMembers)
        .then((users) => {
          users.forEach((user) => {
            room[0].addUser(user);
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

// const saveMessage = (name, message, roomID, callback) => {
//   console.log('Saving message', name, message, roomID);
//   db.models.Message.create({
//     name,
//     message,
//     room_id: roomID,
//   })
//     .then(() => {
//       callback(null);
//     })
//     .catch((error) => {
//       callback(error);
//     });
// };

// const getMessages = (roomID, callback) => {
//   db.models.Message.findAll({
//     where: { room_id: roomID },
//   })
//     .then((results) => {
//       callback(null, results);
//     })
//     .catch((error) => {
//       callback(error);
//     });
// };

const getRoomMembers = (roomID, callback) => {
  db.models.User.findAll({
    attributes: ['email', 'zipcode'],
    include: [{
      model: db.models.Room,
      where: { uniqueid: roomID },
      attributes: ['name', 'zipcode'],
      through: { attributes: [] },
    }],
  })
    .then((users) => {
      // console.log('Success getting users', users);
      callback(null, users);
    })
    .catch((error) => {
      callback(error);
    });
};

const saveRestaurant = (name, roomID, callback) => {
  const promisedRoom = db.models.Room.findOne({
    where: {
      uniqueid: roomID,
    },
    attributes: ['id'],
    raw: true,
  });

  db.models.Restaurant.create({
    name,
  })
    .then((restaurant) => {
      Promise.all([promisedRoom])
        .then((room) => {
          restaurant.setRoom(room[0].id);
          callback(null, restaurant);
        })
        .catch((error) => {
          callback(error);
        });
    })
    .catch((error) => {
      callback(error);
    });
};

const updateRestaurant = (name, roomId, callback) => {
  db.models.Restaurant.findOne({
    where: {
      name,
    },
    include: [{
      model: db.models.Room,
      where: {
        uniqueid: roomId,
      },
    }],
  })
    .then((restaurant) => {
      const currentVotes = restaurant.dataValues.votes;
      restaurant.update({
        votes: currentVotes + 1,
      })
        .then((result) => {
          callback(null, result);
        })
        .catch((error) => {
          callback(error);
        });
    })
    .catch((error) => {
      callback(error);
    });
};

const getScoreboard = (roomID, callback) => {
  db.models.Restaurant.findAll({
    attributes: ['name', 'votes', 'vetoed'],
    include: [{
      model: db.models.Room,
      where: { uniqueid: roomID },
      attributes: [],
    }],
    raw: true,
  })
    .then((scores) => {
      // console.log('SCOREBOARD', scores);
      callback(null, scores);
    })
    .catch((error) => {
      callback(error);
    });
};

module.exports = {
  saveMember,
  saveRoomAndMembers,
  getRoomMembers,
  saveRestaurant,
  updateRestaurant,
  getScoreboard,
};
