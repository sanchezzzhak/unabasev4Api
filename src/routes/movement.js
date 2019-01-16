import { Router } from 'express';
const movements = Router();
import {
  get,
  getPersonal,
  getBusiness,
  create,
  getOne,
  findOne,
  find,
  updateOne
} from '../controllers/movement';
import auth from '../config/lib/auth';
import logger from '../lib/logger';
let module = 'movement';
// if (process.env.NODE_ENV !== 'test') {
movements.get(
  '/:id',
  logger({
    name: 'get one movement by id',
    description: 'get one movement by id',
    module
  }),
  getOne
);

movements.use(auth.sToken);
// }

movements.get(
  '/',
  logger({
    name: 'list movements',
    description: 'get the list of movements',
    module
  }),
  get
);
movements.get(
  '/personal/:state',
  logger({
    name: 'list movements',
    description: 'get the list of movements',
    module
  }),
  getPersonal
);
movements.get(
  '/business/:state',
  logger({
    name: 'list movements',
    description: 'get the list of movements',
    module
  }),
  get
);
// movements.get('/', filter)
movements.get(
  '/findOne',
  logger({
    name: 'create movement',
    description: 'create movement',
    module
  }),
  findOne
);
movements.get(
  '/find/:q',
  logger({
    name: 'create movement',
    description: 'create movement',
    module
  }),
  find
);

movements.post(
  '/',
  logger({
    name: 'create movement',
    description: 'create movement',
    module
  }),
  create
);
movements.put('/:id', updateOne);

export default movements;
