import { Router } from 'express';
const contact = Router();
import { get, getOne, find, updateOne, create } from '../models/contact';

import auth from '../config/lib/auth';
contact.use(auth.sToken);

contact.post('/', create);
contact.get('/', get);
contact.get('/find/:q', find);
contact.get('/:id', getOne);
contact.put('/:id', updateOne);

export default contact;
