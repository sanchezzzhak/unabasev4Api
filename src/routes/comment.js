import { create, deleteOne, getFrom } from '../controllers/comment';
import { Router } from 'express';
const comment = Router();
let module = 'comment';

comment.post('/', create);
comment.delete('/:id', deleteOne);
comment.get('/:id/:name', getFrom);

export default comment;