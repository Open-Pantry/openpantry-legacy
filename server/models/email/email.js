var Promise = require("bluebird");
var Mailer = require("./mailer.js");
var filecache = Promise.promisify(require("filecache"));
var TemplateCache = require("../cache/template-cache.js");
var mailcomposer = Promise.promisifyAll(require("mailcomposer"));
var htmlToText = require("html-to-text");
var Mustache = require("mustache");
//var MaiList = require("./mail/mailList.js");
//var subscriber = new MailList('invitation');
var cache = new TemplateCache();


//Constructor function
function Email(type,data) {
  this.type = type;
  this.data = data;
}

Email.prototype = {
  constructor: Email,
  create: function() {
    var self = this;
    console.log("Creating email with type:",self.type);
    switch (self.type) {
      case "verification":
        self.subject = "Email Verification";
        console.log("Getting template from cache",cache);        
        self.template = cache.getTemplate("verification").toString("ascii");
        self.from = "kgray1497@gmail.com";
        console.log("Filling data");
        fillData.call(self);
        console.log("Filled data");        
        break;
      default:
        var error = new Error("No such Email Template");
        return Promise.reject();
    }

    var mail = mailcomposer({
      from: self.from,
      to: self.data.email,
      subject: self.subject,
      body: htmlToText.fromString(self.template),
      html: self.template
    });
    console.log("Built mail composer")
    var buildAsync = Promise.promisify(mail.build);
    console.log("Built async")    
    return buildAsync.call(mail).then(function(messag) {
      var dataToSend = {
        to: self.data.email,// For testing purposes
        message: messag.toString("ascii")
      };
    console.log("resolved promise of  async")          
      return Promise.resolve(dataToSend);
    });
  },
  getData: function() {
    var self = this;
    var data = {
      from: self.from,
      name: self.name
    };
    return data;
  },
  send: function(mime) {
    console.log("creating new mailer");        
    var mailer = new Mailer();
    console.log("Last sending request");            
    return mailer.sendMessage(mime);
  }
};

/**
	Fills the Invitation template with the corespsonding data 
*/
function fillData() {
  var self = this;
  //Sentence replacements
  //HTML replacements
  console.log("mustaching template: ",self.template);
  var newHtml = Mustache.render(self.template, {
    SUBJECT: self.subject,
    EMAIL: self.data.email,
    ORGID:self.data.orgID,
    TEMPPASSWORD: self.data.tempPassword
  });
  console.log("template:", newHtml);
  self.template = newHtml;
} //end fillData

module.exports = Email;
