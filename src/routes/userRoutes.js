import { createController } from 'awilix-express';

import userController from '../controllers/userController';

import authenticate from '../middleware/authenticate';
import followMapValidationRules from '../middleware/followMapValidator';
import userSearchValidationRules from '../middleware/userSearchValidator';
import paginationValidationRules from '../middleware/paginationValidator';
import validate from '../middleware/validate';

export default createController(userController)
    .prefix('/api/users')
    .before(authenticate)
    .get('/', 'getUsersPaginated', {
        before: [paginationValidationRules(), userSearchValidationRules(), validate]
    })
    .post('/:user/follow', 'followUser', {
        before: [followMapValidationRules(), validate]
    });
