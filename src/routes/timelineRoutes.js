import { createController } from 'awilix-express';

import timelineController from '../controllers/timelineController';

import authenticate from '../middleware/authenticate';

export default createController(timelineController)
    .prefix('/api/timeline')
    .before(authenticate)
    .get('/', 'retrieveTimelinePaginated');
