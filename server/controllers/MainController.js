const models = require('../models/database');

module.exports.createUser = function (req, res) {
  models.User
    .create(req)
    .then((user, create) => {
      console.log('success');
      res.send('success');
    })
    .catch((err) => {
      console.log(`Error:${err}`);
      res.send('error');
    });
};
