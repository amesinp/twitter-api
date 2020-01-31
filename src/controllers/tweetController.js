import { getPaginationAndSortParams, getPaginatedResult } from '../helpers/paginationHelpers';

class TweetController {
    constructor ({ tweetRepository }) {
        this.tweetRepository = tweetRepository;
    }

    async postTweet (req, res) {
        const { body } = req.body;

        const createdTweet = await this.tweetRepository.createTweet({ body, user: req.authUser._id });
        if (!createdTweet) {
            res.status(500).send({ message: 'An error occurred posting tweet. Please try again' });
        }

        res.status(201).send(createdTweet);
    }

    async replyTweet (req, res) {
        const { body } = req.body;
        const { tweet } = req.params;
        
        const createdReply = await this.tweetRepository.replyToTweet({ body, tweet, user: req.authUser._id });
        if (!createdReply) {
            res.status(500).send({ message: 'An error occurred replying tweet. Please try again' });
        }

        res.status(201).send(createdReply);
    }

    async getTweetsPaginated (req, res) {
        const pageParams = getPaginationAndSortParams(req.query);
        
        const result = await this.tweetRepository.getTweetsPaginated({
            search: req.query.search,
            fromDate: req.query.from_date,
            toDate: req.query.to_date
        }, pageParams.sort, pageParams.sortType, pageParams.size, pageParams.page);

        // Get full url from request
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        const finalResult = getPaginatedResult(result, fullUrl, pageParams);
        res.status(200).send(finalResult);
    }
}

export default TweetController;
