import { Router } from 'express';
const movements = Router();
import ctl from '../controllers/movement';
import auth from '../config/lib/auth';
// if (process.env.NODE_ENV !== 'test') {
movements.use(auth.sToken);
// }

movements.get('/', ctl.get);
// movements.get('/', ctl.filter)
movements.get('/findOne', ctl.findOne);
movements.get('/find/:q', ctl.find);
movements.get('/:id', ctl.getOne);
movements.post('/', ctl.create);
movements.put('/:id', ctl.updateOne);

export default movements;
