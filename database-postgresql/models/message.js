module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Room, {
      foreignKey: 'room_id',
    });
  };

  return Message;
};
