import { createController } from 'awilix-express';

import authController from '../controllers/authController';

import userValidationRules from '../middleware/userValidator';
import validate from '../middleware/validate';

export default createController(authController)
    .prefix('/api')
    .post('/login', 'login')
    .post('/register', 'register', {
        before: [userValidationRules(), validate]
    });
