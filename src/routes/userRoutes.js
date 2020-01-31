import { createController } from 'awilix-express';

import userController from '../controllers/userController';

import authenticate from '../middleware/authenticate';
import followMapValidationRules from '../middleware/followMapValidator';
import validate from '../middleware/validate';

export default createController(userController)
    .prefix('/api/users')
    .before(authenticate)
    .get('/', 'getUsersPaginated')
    .post('/:user/follow', 'followUser', {
        before: [followMapValidationRules(), validate]
    });
