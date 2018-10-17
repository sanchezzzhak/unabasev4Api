import { Router } from 'express';
const taxs = Router();
import ctl from '../controllers/tax';
import auth from '../config/lib/auth';
import { isAuth } from '../config/lib/auth';

taxs.use(auth.sToken);

taxs.get('/', ctl.get);
// taxs.get('/', ctl.filter)
taxs.get('/:id', ctl.getOne);
taxs.post('/', ctl.create);
taxs.put('/:id', ctl.updateOne);
taxs.get('/find', ctl.findOne);

export default taxs;
