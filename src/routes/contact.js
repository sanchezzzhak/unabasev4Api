import { Router } from 'express';
const contacts = Router();
import {
  get,
  getOne,
  find,
  updateOne,
  create,
  findSelf
} from '../controllers/contact';

import auth from '../config/lib/auth';
contacts.use(auth.sToken);

contacts.post('/', create);
contacts.get('/', get);
contacts.get('/find/:q', find);
contacts.get('/find/self/:q', findSelf);
contacts.get('/:id', getOne);
contacts.put('/:id', updateOne);

export default contacts;
