const AnnounceModel = require('../models/announceModel');

exports.createAnnouncement = (req, res) => {
  const announceModel = new AnnounceModel({
    _id: req.body.id,
    postedBy: req.body.postedBy,
    title: req.body.title,
    description: req.body.description,
    role: req.body.role,
    createdDate: req.body.createdDate,
    admin: req.body.admin,
    trainee: req.body.trainee,
    organizer: req.body.organizer,
    sponsor: req.body.sponsor,
    linkedEvent: req.body.linkedEvent
  });
  announceModel.save()
    .then(() => {
      res.status(201).json({
        message: 'Announcement post successful!'
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        err
      });
    });
};

exports.updateAnnouncement = (req, res) => {
  const announceModel = new AnnounceModel({
    _id: req.params.id,
    postedBy: req.body.postedBy,
    title: req.body.title,
    description: req.body.description,
    role: req.body.role,
    createdDate: req.body.createdDate,
    admin: req.body.admin,
    trainee: req.body.trainee,
    organizer: req.body.organizer,
    sponsor: req.body.sponsor,
    linkedEvent: req.body.linkedEvent
  });
  AnnounceModel.updateOne({ _id: req.params.id }, announceModel)
    .then(() => {
      res.status(201).json({
        message: 'Announcement updated successfully!'
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
};

exports.deleteAnnouncement = (req, res) => {
  AnnounceModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: 'Announcement deleted!'
      })
        .catch((error) => {
          res.status(400).json({
            message: 'Oops! Something went wrong.',
            error
          });
        });
    });
};

exports.getOneAnnouncement = (req, res) => {
  AnnounceModel.findOne({
    _id: req.params.id
  })
    .then((announceResponse) => {
      res.status(200).json(announceResponse);
    })
    .catch((error) => {
      res.status(404).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
};

exports.getAllAnnouncements = (req, res) => {
  AnnounceModel.find()
    .then((announceResponse) => {
      res.status(200).json(announceResponse);
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
};
