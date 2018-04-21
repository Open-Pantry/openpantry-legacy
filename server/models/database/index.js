const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize("", "", "", {
  host: '',
  port: 3306,
  dialect: "mysql",
  native: true,
  freezeTableName: true,
  define: {
    timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    idle: 500000,
    acquire: 500000
  }
});

const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf(".") !== 0 && file !== "index.js")
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
