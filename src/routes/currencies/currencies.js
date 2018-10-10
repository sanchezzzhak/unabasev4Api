import { Router } from 'express';
const currencies = Router();
import { get, create, updateOne, findOne, getOne } from './controller';

currencies.get('/', get);
currencies.post('/', create);
currencies.put('/:id', updateOne);
currencies.get('/find', findOne);
currencies.get(':id', getOne);

export default currencies;
