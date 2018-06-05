require('dotenv').config();

const Sequelize = require('sequelize');

// set up connection and create sequelize instance
const sequelize = new Sequelize('foodFightTest', 'beeb', 'admin', {
  host: 'localhost',
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

// create a models object and import all of our database tables
const models = {
  User: sequelize.import('./user'),
  Room: sequelize.import('./room'),
  Restaurant: sequelize.import('./restaurant'),
};

// create relationships between all the tables that have associations
Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports.models = models;
