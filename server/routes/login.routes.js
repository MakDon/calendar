import { Router } from 'express';
import * as LoginController from '../controllers/login.controller';
const router = new Router();

router.route('/').post(LoginController.login);

export default router;
