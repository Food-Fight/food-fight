const db = require('../database-postgresql/models');
const bcrypt = require('bcrypt');
const uniqueString = require('unique-string');

//
// ─── USER TABLE HELPERS ─────────────────────────────────────────────────────────
//
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

//
// ─── MESSAGE TABLE HELPERS ─────────────────────────────────────────────────────────
//
const saveMessage = (name, message, roomID, callback) => {
  console.log('Saving message', name, message, roomID);
  db.models.Room.findOne({
    where: {
      uniqueid: roomID,
    },
    attributes: ['id'],
    raw: true,
  })
    .then((primaryID) => {
      db.models.Message.create({
        name,
        message,
        room_id: primaryID.id,
      })
        .then((savedMessage) => {
          console.log('CREATED MESSAGE', savedMessage);
          callback(null, savedMessage);
        })
        .catch((error) => {
          callback(error);
        });
    })
    .catch((error) => {
      callback(error);
    });
};

const getMessages = (roomID, callback) => {
  db.models.Message.findAll({
    attributes: ['name', 'message'],
    include: [{
      model: db.models.Room,
      where: { uniqueid: roomID },
      attributes: [],
    }],
    raw: true,
  })
    .then((fetchedMessage) => {
      console.log('FETCHED MESSAGES', fetchedMessage);
      callback(null, fetchedMessage);
    })
    .catch((error) => {
      callback(error);
    });
};

//
// ─── ROOM TABLE HELPERS ─────────────────────────────────────────────────────────
//
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

//
// ─── RESTAURANT TABLE HELPERS ─────────────────────────────────────────────────────────
//
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

const updateVotes = (name, roomId, callback) => {
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

const updateVetoes = (name, roomId, callback) => {
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
      restaurant.update({
        vetoed: true,
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
  updateVotes,
  updateVetoes,
  getScoreboard,
  saveMessage,
  getMessages,
};
