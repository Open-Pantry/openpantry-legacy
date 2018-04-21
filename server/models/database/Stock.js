module.exports = function (sequelize, DataTypes) {
    const Stock = sequelize.define(
      'Stock',
      {
        amount: DataTypes.DOUBLE
      },
  
      {
        tableName: 'stocks',
        timestamps: true
      
      }
    );
    Stock.associate = function (models) {
      Stock.belongsTo(models.Product, { as: 'stockProduct', foreignKey: 'product_id'});
      Stock.belongsTo(models.Supplier, { as: 'stockSupplier', foreignKey: 'supplier_id', foreignKeyConstraint:false});
      Stock.belongsTo(models.Organization, {as: 'stockOrganization', foreignKey: 'organization_id'})
    }
    
    return Stock;
  };