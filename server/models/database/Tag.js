module.exports = function (sequelize, DataTypes) {
  const Tag = sequelize.define(
    'Tag',
    {
      name: DataTypes.STRING
    },

    {
      tableName: 'tags',
      timestamps: true

    }
  );
  Tag.associate = function (models) {
  }
  return Tag;
};