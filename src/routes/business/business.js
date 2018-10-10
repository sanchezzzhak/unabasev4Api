import { Router } from 'express';
const business = Router();
import ctl from './controller';
import auth from '../../config/lib/auth';
business.use(auth.sToken);

business.get('/', ctl.get);
business.post('/', ctl.gets);
business.post('/create', ctl.create);
business.get('/:_id', ctl.getOne);
business.put('/:_id', ctl.update);
// business

export default business;
