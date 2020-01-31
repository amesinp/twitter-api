import { createController } from 'awilix-express';

import userController from '../controllers/userController';

import authenticate from '../middleware/authenticate';

export default createController(userController)
    .prefix('/api/users')
    .before(authenticate)
    .get('/', 'getUsersPaginated');
