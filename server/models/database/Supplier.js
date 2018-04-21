module.exports = function (sequelize, DataTypes) {
    const Supplier = sequelize.define(
      'Supplier',
      {
        name: DataTypes.STRING,
        phone_number: DataTypes.STRING,
        email: DataTypes.STRING
      },
  
      {
        tableName: 'suppliers',
        timestamps: true
      
      }
    );
    return Supplier;
  };