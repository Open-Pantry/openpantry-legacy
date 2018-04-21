"use strict";

var debug = require("debug");
var mailgun = require("mailgun-js")({
  apiKey: "key-005e37e7577f2227e52d0aebba3ea38f",
  domain: "sandbox885cb44b0b644cdf96921e60fe2c43cf.mailgun.org"
});

function Mailer() {}

Mailer.prototype = {
  constructor: Mailer,
  sendMessage: function(message) {
    console.log("Emailing the message");
    return mailgun.messages().sendMime(message);
  }
};

module.exports = Mailer;
