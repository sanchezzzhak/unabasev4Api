import { Router } from 'express';
const movements = Router();
import ctl from '../controllers/movement';
import auth from '../config/lib/auth';
import logger from '../lib/logger';
// if (process.env.NODE_ENV !== 'test') {
movements.use(auth.sToken);
// }
let module = 'movement';

movements.get(
  '/',
  logger({
    name: 'list movements',
    description: 'get the list of movements',
    module
  }),
  ctl.get
);
movements.get(
  '/personal/:state',
  logger({
    name: 'list movements',
    description: 'get the list of movements',
    module
  }),
  ctl.get
);
movements.get(
  '/business/:state',
  logger({
    name: 'list movements',
    description: 'get the list of movements',
    module
  }),
  ctl.get
);
// movements.get('/', ctl.filter)
movements.get(
  '/findOne',
  logger({
    name: 'create movement',
    description: 'create movement',
    module
  }),
  ctl.findOne
);
movements.get(
  '/find/:q',
  logger({
    name: 'create movement',
    description: 'create movement',
    module
  }),
  ctl.find
);
movements.get(
  '/:id',
  logger({
    name: 'get one movement by id',
    description: 'get one movement by id',
    module
  }),
  ctl.getOne
);
movements.post(
  '/',
  logger({
    name: 'create movement',
    description: 'create movement',
    module
  }),
  ctl.create
);
movements.put('/:id', ctl.updateOne);

export default movements;
