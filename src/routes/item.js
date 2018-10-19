import { Router } from 'express';
const items = Router();
import {
  get,
  create,
  updateOne,
  findOne,
  getOne,
  find
} from '../controllers/item';

items.get('/', get);
items.post('/', create);
items.put('/:id', updateOne);
items.get('/find', find);
items.get('/:id', getOne);

export default items;
