import { Router } from 'express';
const items = Router();
import { get, create, updateOne, findOne, getOne } from '../controllers/item';

items.get('/', get);
items.post('/', create);
items.put('/:id', updateOne);
items.get('/find', findOne);
items.get(':id', getOne);

export default items;
