module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('restaurant', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    votes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    vetoed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  Restaurant.associate = (models) => {
    Restaurant.belongsTo(models.Room);
    Restaurant.belongsToMany(models.User, {
      through: 'restaurant_user',
      foreignKey: 'restaurant_id',
    });
  };

  return Restaurant;
};
