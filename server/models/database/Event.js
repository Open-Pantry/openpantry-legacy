module.exports = function (sequelize, DataTypes) {
  const Event = sequelize.define(
    'Event',
    {
      name: DataTypes.STRING,
      description:DataTypes.TEXT,
      startTime:DataTypes.DATE,
      endTime:DataTypes.DATE,
    }
    ,
    {
      tableName: 'events',
      timestamps: true
    
    }
  );
  Event.associate = function (models) {
          Event.hasMany(models.Tag, { as: 'eventTag', foreignKey: 'event_id', onDelete: 'cascade', hooks: 'true' });
  }
  return Event;
};