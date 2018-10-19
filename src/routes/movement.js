import { Router } from 'express';
const movements = Router();
import ctl from '../controllers/movement';
import auth from '../config/lib/auth';
// if (process.env.NODE_ENV !== 'test') {
movements.use(auth.sToken);
// }

movements.get('/', ctl.get);
// movements.get('/', ctl.filter)
movements.get('/:id', ctl.getOne);
movements.post('/', ctl.create);
movements.put('/:id', ctl.updateOne);
movements.get('/find', ctl.findOne);

export default movements;
