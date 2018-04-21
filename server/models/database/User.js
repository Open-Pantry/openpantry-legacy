var bcrypt = require('bcrypt');


module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      adminStatus: DataTypes.BOOLEAN,
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        set: function (v) {
          var password = bcrypt.hashSync(v,5);
          return this.setDataValue('password', password);
        }
      },
      name: DataTypes.STRING,
      role: DataTypes.ENUM('employee', 'read_only', 'admin')
    },
    
    {
      classMethods: {
        // associated with userid
        associate(models) { }

      },
      tableName: 'users',
      timestamps: true
    }
  );
  return User;
};
