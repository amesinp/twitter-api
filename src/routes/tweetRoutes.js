import { createController } from 'awilix-express';

import tweetController from '../controllers/tweetController';

import authenticate from '../middleware/authenticate';
import tweetValidationRules from '../middleware/tweetValidator';
import validate from '../middleware/validate';

export default createController(tweetController)
    .prefix('/api/tweets')
    .before(authenticate)
    .post('/', 'postTweet', {
        before: [tweetValidationRules(), validate]
    });
