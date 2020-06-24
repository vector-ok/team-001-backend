const FundModel = require('../models/fundModel');

exports.createFund = (req, res) => {
  const fundModel = new FundModel({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    website: req.body.website,
    fundingBody: req.body.fundingBody
  });
  fundModel.save()
    .then(() => {
      res.status(201).json({
        message: 'Funding post successful!'
      });
    })
    .catch((err) => {
      res.status(400).json({
        err
      });
    });
};

exports.updateFund = (req, res) => {
  const fundModel = new FundModel({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    website: req.body.website,
    fundingBody: req.body.fundingBody
  });
  FundModel.updateOne({ _id: req.params.id }, fundModel)
    .then(() => {
      res.status(201).json({
        message: 'Funding updated successfully!'
      });
    })
    .catch((error) => {
      res.status(400).json({
        error
      });
    });
};

exports.deleteFund = (req, res) => {
  FundModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: 'Fund deleted!'
      })
        .catch((error) => {
          res.status(400).json({ error });
        });
    });
};

exports.getOnefund = (req, res) => {
  FundModel.findOne({
    _id: req.params.id
  })
    .then((fundsResponse) => {
      res.status(200).json(fundsResponse);
    })
    .catch((error) => {
      res.status(404).json({
        error
      });
    });
};

exports.getAllFunds = (req, res) => {
  FundModel.find()
    .then((fundsResponse) => {
      res.status(200).json(fundsResponse);
    })
    .catch((error) => {
      res.status(400).json({
        error
      });
    });
};
