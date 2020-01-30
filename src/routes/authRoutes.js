import { createController } from 'awilix-express';

import authController from '../controllers/authController';

import userValidator from '../middleware/userValidator';

export default createController(authController)
    .prefix('/api')
    .post('/login', 'login')
    .post('/register', 'register', {
        before: [userValidator.validationRules(), userValidator.validate]
    });
