import express from 'express';
// controllers
import sarira from '../controllers/sarira.js';

const router = express.Router();

router
    .post('/:id', sarira.onPostSariraById)
    .get('/:id', sarira.onGetSariraById)
    .get('/', sarira.onGetAllSarira)
    .delete('/:id',sarira.onDeleteSariraById)
    .delete('/all/:name',sarira.onDeleteSarirasByName)

export default router;