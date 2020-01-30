class TimelineController {
    constructor ({ tweetRepository, followMapRepository }) {
        this.tweetRepository = tweetRepository;
        this.followMapRepository = followMapRepository;
    }

    async retrieveTimelinePaginated (req, res) {
        let size = 10;
        let page = 1;

        if (req.query.page && !isNaN(parseInt(req.query.page))) {
            page = parseInt(req.query.page);
        }

        if (req.query.size && !isNaN(parseInt(req.query.size))) {
            size = parseInt(req.query.size);
        }

        const userFollows = await this.followMapRepository.getUserFollows(req.authUser._id);
        if (userFollows.length === 0) {
            return res.status(400).send({ message: 'Follow users to populate timeline' });
        }

        const tweets = await this.tweetRepository.getTweetsForUsersPaginated(userFollows, size, page);
        return res.status(200).send(tweets);
    }
}

export default TimelineController;
