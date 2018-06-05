require('dotenv').config();

const Sequelize = require('sequelize');

//
// ─── DB CONNECTION ──────────────────────────────────────────────────────────────
//
// =====UNCOMMENT BELOW, WAS TESTING LOCALLY (TRAVIS)==============================
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  // host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  operatorsAliases: false,
  // dialectOptions: {
  //   ssl: true,
  // },
});

// testing connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });


//
// ─── USERS ──────────────────────────────────────────────────────────────────────
//
// user model
const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING(25),
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  zipcode: {
    type: Sequelize.INTEGER(6),
    allowNull: false,
  },
});

// create user table
User.sync();


//
// ─── ROOMS ──────────────────────────────────────────────────────────────────────
//
// room model
const Room = sequelize.define('room', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  roomname: {
    type: Sequelize.STRING(25),
    allowNull: false,
  },
  zipcode: {
    type: Sequelize.INTEGER(6),
    allowNull: false,
  },
});

// create room table
Room.sync();

// room_users model
const RoomUsers = sequelize.define('room_users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  room_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Room,
      key: 'id',
    },
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

// create room_users table
RoomUsers.sync();


//
// ─── RESTAURANTS ────────────────────────────────────────────────────────────────
//
// restaurant model
const Restaurant = sequelize.define('restaurant', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  room_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Room,
      key: 'id',
    },
  },
  votes: {
    type: Sequelize.INTEGER,
  },
  vetoed: {
    type: Sequelize.BOOLEAN,
  },
});

// create restaurant table
Restaurant.sync();
