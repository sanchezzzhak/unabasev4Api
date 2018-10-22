import { Router } from 'express';
const currencies = Router();

import { body } from 'express-validator/check';
import { get, create, updateOne, find, getOne } from '../controllers/currency';

import auth from '../config/lib/auth';
currencies.use(auth.sToken);

currencies.get('/', get);
currencies.get('/:id', getOne);
currencies.post('/', create);
currencies.put('/:id', updateOne);
currencies.get('/find/:q', find);

export default currencies;
