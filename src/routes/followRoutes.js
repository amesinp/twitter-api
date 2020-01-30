import { createController } from 'awilix-express';

import followController from '../controllers/followController';

import authenticate from '../middleware/authenticate';
import followMapValidationRules from '../middleware/followMapValidator';
import validate from '../middleware/validate';

export default createController(followController)
    .prefix('/api/follows')
    .before(authenticate)
    .post('/', 'followUser', {
        before: [followMapValidationRules(), validate]
    });
