require('dotenv').config();

const Sequelize = require('sequelize');

const Op = Sequelize.Op;

// set up connection and create sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  operatorsAliases: false,
  logging: false,
  dialectOptions: {
    ssl: true,
  },
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
module.exports.Op = Op;
