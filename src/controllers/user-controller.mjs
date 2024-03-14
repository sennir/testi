import bcrypt from 'bcryptjs';
import {
  deleteUserById,
  insertUser,
  listAllUsers,
  selectUserById,
  updateUserById,
} from '../models/user-model.mjs';
import {customError} from '../middlewares/error-handler.mjs';

const getUsers = async (req, res, next) => {
  const result = await listAllUsers();
  if (result.error) {
    return next(customError(result, result.error));
  }
  return res.json(result);
};

const getUserById = async (req, res, next) => {
  const result = await selectUserById(req.params.id);
  if (result.error) {
    return next(customError(result, result.error));
  }
  return res.json(result);
};

const postUser = async (req, res, next) => {
  const {username, password, email} = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const result = await insertUser(
    {
      username,
      email,
      password: hashedPassword,
    },
    next,
  );
  return res.status(201).json(result);
};

const putUser = async (req, res, next) => {
  // Get userinfo from req.user object extracted from token
  // Only user authenticated by token can update own data
  // TODO: admin user can update any user (incl. user_level)
  const userId = req.user.user_id;
  const {username, password, email} = req.body;
  // hash password if included in request
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const result = await updateUserById({
    userId,
    username,
    password: hashedPassword,
    email,
  });
  if (result.error) {
    return next(customError(result, result.error));
  }
  return res.status(200).json(result);
};

const deleteUser = async (req, res, next) => {
  // console.log('deleteUser', req.user, req.params.id);
  // admin user can delete any user
  // user authenticated by token can delete itself
  if (
    req.user.user_level !== 'admin' &&
    req.user.user_id !== parseInt(req.params.id)
  ) {
    return next(customError('Unauthorized', 401));
  }
  const result = await deleteUserById(req.params.id);
  if (result.error) {
    return next(customError(result, result.error));
  }
  return res.json(result);
};

export {getUsers, getUserById, postUser, putUser, deleteUser};
