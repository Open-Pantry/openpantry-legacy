var models = require('../models/database');
var User = models.User;
var bcrypt = require('bcrypt');
var Email = require("../models/email/email.js");

module.exports.validateEmail = function (email, orgID) {
    var query = {
        where: { email: email, organization_id: orgID },
        raw: true,
    };
    return User.findAll(query).spread(function (user) {
        if (user) {
            return user;
        } else {
            return { error: 'Invalid email' };
        }
    })
        .catch(function (err) {
            return { error: err };
        })
};

module.exports.createUser = function (req, res) {
    var newUser = {
        email: req.body.email,
        name:req.body.name,
        password: req.body.password
    };
    User.create(newUser)
        .then(function (user, create) {
            if (create) {
            }
            res.send(user);
        })
        .catch(function (err) {
            res.send(err);
        });
};

module.exports.createUserWithInvitation = function (req, res) {
    console.log("Body:", req.body);
    var tempPassword = bcrypt.hashSync(req.body.email, 5);
    var newUser = {
        email: req.body.email,
        name:req.body.name,
        password: tempPassword,
        organization_id: req.body.orgID,
        role: "employee",
        adminStatus: 0
    };
    User.create(newUser)
        .then(function (user, create) {
            if (create) {
            }
            res.send(user);
            console.log("Creating email!");
            // Now let's send an email invitation
            var data = {
                tempPassword: tempPassword,
                email: req.body.email,
                orgID:req.body.orgID
            };
            var email = new Email("verification", data);
            console.log("Created email")
            var emailPromise = email.create().then(function (message) {
                console.log("Sending email inside promise.");
                return email.send(message);
            }); //send the email
        })
        .catch(function (err) {
            //res.send(err);
        });
};

module.exports.updateAndLoginUser = function (req, res) {
    console.log("Updating User Body:", req.body);

    User.update({
        password: req.body.password
    }, {
            where: {
                email: req.body.email,
                organization_id: req.body.orgID,
                role: "employee"
            }
        })
        .then(function (user) {
            console.log("Updated User:", user);
            res.send(user);
        })
        .catch(function (err) {
            //res.send(err);
        });
};


module.exports.checkPassword = function (email, password, orgID) {
    return User.findAll({
        where: {
            email: email,
            organization_id: orgID
        },
        raw: true
    }).spread(function (user) {
        if (user) {
            var verified = bcrypt.compareSync(password, user.password);
            if (verified) {
                return user;
            } else {
                return { error: 'email or Password Invalid!' };
            }
        } else {
            return { error: 'email or Password Invalid!' };
        }
    })
        .catch(function (err) {
            return { error: err };
        })
};


