import { createController } from 'awilix-express';

import timelineController from '../controllers/timelineController';

import authenticate from '../middleware/authenticate';
import paginationValidationRules from '../middleware/paginationValidator';
import validate from '../middleware/validate';

export default createController(timelineController)
    .prefix('/api/timeline')
    .before(authenticate)
    .get('/', 'retrieveTimelinePaginated', {
        before: [paginationValidationRules(), validate]
    })
    .get('/stream', 'getTimelineRealtime');
