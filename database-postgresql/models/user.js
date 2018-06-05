module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    zipcode: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Room, {
      through: 'room_users',
      foreignKey: 'user_id',
    });
  };

  return User;
};
