import { getPaginationAndSortParams, getPaginatedResult } from '../helpers/paginationHelpers';

class TimelineController {
    constructor ({ tweetRepository, followMapRepository }) {
        this.tweetRepository = tweetRepository;
        this.followMapRepository = followMapRepository;
    }

    async retrieveTimelinePaginated (req, res) {
        const params = getPaginationAndSortParams(req.query);

        const userFollows = await this.followMapRepository.getUserFollows(req.authUser._id);
        if (userFollows.length === 0) {
            return res.status(400).send({ message: 'Follow users to populate timeline' });
        }

        const result = await this.tweetRepository.getTweetsForUsersPaginated(userFollows, params.size, params.page);

        // Get full url from request
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        const finalResult = getPaginatedResult(result, fullUrl, params);
        return res.status(200).send(finalResult);
    }
}

export default TimelineController;
