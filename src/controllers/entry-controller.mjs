import {customError} from '../middlewares/error-handler.mjs';
import {
  findEntryById,
  addEntry,
  deleteEntryById,
  updateEntryById,
  listAllEntriesByUserId,
} from '../models/entry-model.mjs';

const getEntries = async (req, res, next) => {
  // return only logged in user's own entries
  // - get user's id from token (req.user.user_id)
  const result = await listAllEntriesByUserId(req.user.user_id);
  if (!result.error) {
    res.json(result);
  } else {
    next(new Error(result.error));
  }
};

const getEntryById = async (req, res, next) => {
  const entry = await findEntryById(req.params.id, req.user.user_id);
  if (entry) {
    res.json(entry);
  } else {
    next(customError('Entry not found', 404));
  }
};

const postEntry = async (req, res, next) => {
  const userId = req.user.user_id;
  const result = await addEntry(req.body, userId);
  if (result.entry_id) {
    res.status(201);
    res.json({message: 'New entry added.', ...result});
  } else {
    next(new Error(result.error));
  }
};

const putEntry = async (req, res, next) => {
  const entryId = req.params.id;
  const userId = req.user.user_id;
  const result = await updateEntryById(entryId, userId, req.body);
  if (result.error) {
    return next(customError(result.message, result.error));
  }
  return res.status(201).json(result);
};

const deleteEntry = async (req, res, next) => {
  const result = await deleteEntryById(req.params.id, req.user.user_id);
  if (result.error) {
    return next(customError(result.message, result.error));
  }
  return res.json(result);
};

export {getEntries, getEntryById, postEntry, putEntry, deleteEntry};
