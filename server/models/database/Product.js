module.exports = function (sequelize, DataTypes) {
    const Product = sequelize.define(
      'Product',
      {
        name: DataTypes.STRING,
        unit_description: DataTypes.STRING
      },
  
      {
        tableName: 'products',
        timestamps: true
      
      }
    );
    Product.associate = function (models) {
    Product.hasMany(models.Tag, { as: 'productTag', foreignKey: 'product_id', onDelete: 'cascade', hooks: 'true' });
    }
    return Product;
  };