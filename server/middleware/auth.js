var jwt = require('jwt-simple');
var secret = require('../keys/apiKey');
var UserMethods = require('../controllers/UserController.js');


var Auth = {
    login: function(req, res) {
      // console.log("Logging in from server: ",req.body);
      var email = req.body.email || '';
      var password = req.body.password || '';
      var orgID = req.body.orgID || '';
      if (email == '' || password == '') {
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid credentials"
        });
        return;
      }
      // Check if email and password credentials are valid
      Auth.validate(email, password, orgID).then(function(dbUserObj){
        if (dbUserObj.error) { // If failed send 401
          res.status(401);
          res.json({
            "status": 401,
            "message": dbUserObj.error
          });
          return;
        }
        if (dbUserObj) {
          //success -> generate and token and send to client
          res.json(genToken(dbUserObj));
        }
      });
    },
    validate: function(email, password,orgID) {
      // spoofing the DB response for simplicity
      return UserMethods.checkPassword(email, password,orgID);
    },
    validateUser: function(email,organization) {
      return UserMethods.validateEmail(email,organization);
    },
  }
  // private method
function genToken(user) {
  var expires = expiresIn(2); // 7 days
  var token = jwt.encode({
    exp: expires
  }, secret());
  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
module.exports = Auth;