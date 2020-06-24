// const fs = require('fs');
const EventModel = require('../models/eventModel');

exports.createEvent = (req, res) => {
  // const url = `${req.protocol}://${req.get('host')}`;
  // req.body.eventModel = JSON.parse(req.body.eventModel);
  const eventModel = new EventModel({
    organizerId: req.body.organizerId,
    // sponsorId: req.body.eventModel.sponsorId,
    title: req.body.title,
    description: req.body.description,
    // imageUrl: `${url}/images/${req.file.filename}`,
    createdDate: req.body.createdDate,
    dueRegDate: req.body.dueRegDate,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    targetAudience: req.body.targetAudience,
    category: req.body.category,
    amountToPay: req.body.amountToPay,
    paymentDetail: req.body.paymentDetail,
    like: req.body.like,
    location: req.body.location,
    industry: req.body.industry,
    enabled: req.body.enabled
  });
  eventModel.save()
    .then(() => {
      res.status(201).json({
        message: 'Event post successful!'
      });
    })
    .catch((err) => {
      res.status(400).json({
        err
      });
    });
};

exports.updateEvent = (req, res) => {
  let eventModel = new EventModel({ _id: req.params.id });
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`;
    req.body.eventModel = JSON.parse(req.body.eventModel);
    eventModel = {
      _id: req.params.id,
      organizerId: req.body.eventModel.organizerId,
      sponsorId: req.body.eventModel.sponsorId,
      title: req.body.eventModel.title,
      description: req.body.eventModel.description,
      imageUrl: `${url}/images/${req.file.filename}`,
      createdDate: req.body.eventModel.createdDate,
      dueRegDate: req.body.eventModel.dueRegDate,
      startDate: req.body.eventModel.startDate,
      endDate: req.body.eventModel.endDate,
      targetAudience: req.body.eventModel.targetAudience,
      category: req.body.eventModel.category,
      amountToPay: req.body.eventModel.amountToPay,
      paymentDetail: req.body.eventModel.paymentDetail,
      like: req.body.eventModel.like,
      location: req.body.eventModel.location,
      industry: req.body.eventModel.industry,
      enabled: req.body.eventModel.enabled
    };
  } else {
    eventModel = {
      _id: req.params.id,
      organizerId: req.body.organizerId,
      sponsorId: req.body.sponsorId,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      createdDate: req.body.createdDate,
      dueRegDate: req.body.dueRegDate,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      targetAudience: req.body.targetAudience,
      category: req.body.category,
      amountToPay: req.body.amountToPay,
      paymentDetail: req.body.paymentDetail,
      like: req.body.like,
      location: req.body.location,
      industry: req.body.industry,
      enabled: req.body.enabled
    };
  }
  EventModel.updateOne({ _id: req.params.id }, eventModel)
    .then(() => {
      res.status(201).json({
        message: 'Event updated successfully!'
      });
    })
    .catch((error) => {
      res.status(400).json({
        error
      });
    });
};

// exports.deleteEvent = (req, res) => {
//   EventModel.findOne({ _id: req.params.id })
//     .then((eventModel) => {
//       const filename = eventModel.imageUrl.split('/images/')[1];
//       fs.unlink(`images/${filename}`, () => {
//         EventModel.deleteOne({ _id: req.params.id })
//           .then(() => {
//             res.status(200).json({
//               message: 'Event deleted!'
//             })
//               .catch((error) => {
//                 res.status(400).json({ error });
//               });
//           });
//       });
//     });
// };

exports.deleteEvent = (req, res) => {
  EventModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: 'Event deleted!'
      })
        .catch((error) => {
          res.status(400).json({ error });
        });
    });
};

exports.getOneEvent = (req, res) => {
  EventModel.findOne({
    _id: req.params.id
  })
    .then((eventsResponse) => {
      res.status(200).json(eventsResponse);
    })
    .catch((error) => {
      res.status(404).json({
        error
      });
    });
};

exports.getAllEvents = (req, res) => {
  EventModel.find()
    .then((eventsResponse) => {
      res.status(200).json(eventsResponse);
    })
    .catch((error) => {
      res.status(400).json({
        error
      });
    });
};
