import { createController } from 'awilix-express';

import tweetController from '../controllers/tweetController';

import authenticate from '../middleware/authenticate';
import tweetValidationRules from '../middleware/tweetValidator';
import tweetSearchValidationRules from '../middleware/tweetSearchValidator';
import paginationValidationRules from '../middleware/paginationValidator';
import tweetReplyValidationRules from '../middleware/tweetReplyValidator';
import validate from '../middleware/validate';

export default createController(tweetController)
    .prefix('/api/tweets')
    .before(authenticate)
    .get('/', 'getTweetsPaginated', {
        before: [paginationValidationRules(), tweetSearchValidationRules(), validate]
    })
    .post('/', 'postTweet', {
        before: [tweetValidationRules(), validate]
    })
    .post('/:tweet/reply', 'replyTweet', {
        before: [tweetReplyValidationRules(), validate]
    });
