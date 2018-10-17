import { Router } from 'express';
const incomes = Router();
import ctl from '../controllers/income';
import auth from '../config/lib/auth';
// if (process.env.NODE_ENV !== 'test') {
incomes.use(auth.sToken);
// }

incomes.get('/', ctl.get);
// incomes.get('/', ctl.filter)
incomes.get('/:id', ctl.getOne);
incomes.post('/', ctl.create);
incomes.put('/:id', ctl.updateOne);
incomes.get('/find', ctl.findOne);

export default incomes;
