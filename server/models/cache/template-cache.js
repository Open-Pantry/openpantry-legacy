var Promise = require("bluebird");
var filecache = Promise.promisify(require("filecache"));
var cache;

function TemplateCache(){}

TemplateCache.prototype = {
  constructor: TemplateCache,
  loadTemplateCache: function() {
    return filecache("./models/email/templates").then(function(
      results
    ) {
      console.log("results of cache init:",results);
      cache = results;
      return Promise.resolve;
    });
  },
  getTemplate: function(name) {
    var template;
    switch (name) {
      case "verification":
        template = cache["/emailVerification.html"].toString("ascii");
        break;
      default:
        var error = new Error("No such template");
        return error;
    } //switch
    return template;
  } //getTemplate
};

module.exports = TemplateCache;
