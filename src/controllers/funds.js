const FundModel = require('../models/fundModel');
const { createCrudHandlers } = require('../utils/crudFactory');

const FUND_FIELDS = ['title', 'description', 'website', 'fundingBody'];

const buildFundPayload = (req) => {
  const payload = {};

  if (req.body.id) payload._id = req.body.id;
  FUND_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) payload[field] = req.body[field];
  });

  return payload;
};

const handlers = createCrudHandlers({
  Model: FundModel,
  resource: 'Fund',
  buildPayload: buildFundPayload,
  messages: {
    created: 'Funding post successful!',
    updated: 'Funding updated successfully!',
    deleted: 'Fund deleted!',
    notFound: 'Fund not found.'
  }
});

module.exports = {
  createFund: handlers.create,
  updateFund: handlers.update,
  deleteFund: handlers.remove,
  getOnefund: handlers.getOne,
  getAllFunds: handlers.getAll
};
