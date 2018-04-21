const models = require('../models/database');

module.exports.createNewEvent = function (req, res) {
    console.log("Event Request Body:",req.body);
  models.Event
    .create({
        name:req.body.name,
        description:req.body.description,
        startTime:req.body.startTime,
        endTime:req.body.endTime,
        organization_id:req.body.orgID
    })
    .then((event, create) => {
      console.log('success');
      res.send(event);
    })
    .catch((err) => {
      console.log(`Error:${err}`);
      res.send('error');
    });
};
