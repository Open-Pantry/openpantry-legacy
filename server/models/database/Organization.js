module.exports = function (sequelize, DataTypes) {
  const Organization = sequelize.define(
    'Organization',
    {
      name: DataTypes.STRING,
      locationName: DataTypes.TEXT,
      locationLat: DataTypes.STRING,
      locationLong:DataTypes.STRING,
      description: DataTypes.TEXT,
      visibility: DataTypes.BOOLEAN,
      logoName:DataTypes.STRING
    }
    ,
    {
      tableName: 'organizations',
      timestamps: true
    
    }
  );
  Organization.associate = function (models) {
    Organization.hasMany(models.User, { as: 'organizationUser', foreignKey: 'organization_id', onDelete: 'cascade', hooks: 'true' });
    Organization.hasMany(models.Product, { as: 'organizationProduct', foreignKey: 'organization_id', onDelete: 'cascade', hooks: 'true'});
    Organization.hasMany(models.Tag, { as: 'organizationTag', foreignKey: 'organization_id', onDelete: 'cascade', hooks: 'true' });
    Organization.hasMany(models.Event, { as: 'organizationEvent', foreignKey: 'organization_id', onDelete: 'cascade', hooks: 'true' });
  }
  return Organization;
};