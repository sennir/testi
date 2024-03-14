import express from 'express';
import {body} from 'express-validator';
import {getMe, postLogin} from '../controllers/auth-controller.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {validationErrorHandler} from '../middlewares/error-handler.mjs';
import { selectUserByUsername, insertUser } from '../models/user-model.mjs';

const authRouter = express.Router();

authRouter
  // user login
  .post(
    '/login',
    body('username').trim().notEmpty(),
    body('password').trim().notEmpty(),
    validationErrorHandler,
    postLogin,
  )
   // user registration
   .post(
    '/register',
    body('username').trim().notEmpty(),
    body('password').trim().notEmpty(),
    body('email').isEmail(),
    validationErrorHandler,
    async (req, res) => {
      const { username, password, email } = req.body;

      try {
        // Tarkista onko käyttäjä jo olemassa
        const existingUser = await selectUserByUsername(username);
        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }

        // Luo uusi käyttäjä tietokantaan
        const newUser = { username, password, email };
        const result = await insertUser(newUser);
        const userId = result.user_id;

        // Palauta vastaus
        res.status(201).json({ message: 'User registered successfully', userId });
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  )
  // get user info
  .get('/me', authenticateToken, getMe);

export default authRouter;
