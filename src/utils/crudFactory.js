const asyncHandler = require('./asyncHandler');
const HttpError = require('./httpError');

/**
 * Builds the CRUD handlers every collection in this API needs. Controllers stay
 * declarative: they describe how a request maps to a document and which copy to
 * return, the factory owns the plumbing and status codes.
 */
const createCrudHandlers = ({ Model, resource, buildPayload = (req) => req.body, messages = {} }) => {
  const copy = {
    created: `${resource} created.`,
    updated: `${resource} updated.`,
    deleted: `${resource} deleted.`,
    notFound: `${resource} not found.`,
    ...messages
  };

  const create = asyncHandler(async (req, res) => {
    await Model.create(buildPayload(req));
    res.status(201).json({ message: copy.created });
  });

  const update = asyncHandler(async (req, res) => {
    const payload = buildPayload(req);
    const result = await Model.updateOne({ _id: req.params.id }, payload, { runValidators: true });

    if (result.matchedCount === 0) throw new HttpError(404, copy.notFound);
    res.status(200).json({ message: copy.updated });
  });

  const remove = asyncHandler(async (req, res) => {
    const result = await Model.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) throw new HttpError(404, copy.notFound);
    res.status(200).json({ message: copy.deleted });
  });

  const getOne = asyncHandler(async (req, res) => {
    const document = await Model.findById(req.params.id);

    if (!document) throw new HttpError(404, copy.notFound);
    res.status(200).json(document);
  });

  const getAll = asyncHandler(async (req, res) => {
    const documents = await Model.find();
    res.status(200).json(documents);
  });

  return {
    create,
    update,
    remove,
    getOne,
    getAll
  };
};

module.exports = { createCrudHandlers };
