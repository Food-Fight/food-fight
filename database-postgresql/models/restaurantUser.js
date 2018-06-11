module.exports = (sequelize, DataTypes) => {
  const RestaurantUser = sequelize.define('restaurant_user', {
    voted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  RestaurantUser.associate = (models) => {
    RestaurantUser.belongsTo(models.Restaurant, {
      through: models.RestaurantUser,
    });
    RestaurantUser.belongsTo(models.User, {
      through: models.RestaurantUser,
    });
  };

  return RestaurantUser;
};
