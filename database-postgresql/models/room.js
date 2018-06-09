module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('room', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uniqueid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
    },
  });

  Room.associate = (models) => {
    Room.belongsToMany(models.User, {
      through: 'room_users',
      foreignKey: 'room_id',
    });
    Room.belongsTo(models.User, {
      foreignKey: 'owner',
    });
  };

  return Room;
};
