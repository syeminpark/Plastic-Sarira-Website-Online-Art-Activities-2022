import express from 'express';
// controllers
import user from '../controllers/user.js';

const router = express.Router();

router
  .get('/', user.onGetAllUsers)
  .post('/', user.onCreateUser)
  .get('/:id', user.onGetUserById)
  .delete('/:id', user.onDeleteUserById)
  .delete('/all/:name', user.onDeleteUsersByName) 

export default router;
