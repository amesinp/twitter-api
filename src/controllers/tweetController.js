import { getPaginationAndSortParams, getPaginatedResult } from '../helpers/paginationHelpers';

class TweetController {
    constructor ({ tweetRepository, followMapRepository, tweetEventHandler }) {
        this.tweetRepository = tweetRepository;
        this.followMapRepository = followMapRepository;
        this.tweetEventHandler = tweetEventHandler;
    }

    async postTweet (req, res) {
        const { body } = req.body;

        const createdTweet = await this.tweetRepository.createTweet({ body, user: req.authUser._id });
        if (!createdTweet) {
            res.status(500).send({ message: 'An error occurred posting tweet. Please try again' });
        }
        
        // Send response to user first
        res.status(201).send(createdTweet);

        // Send tweet to subscribers
        await this._sendTweetToSubscribers(req.authUser._id, createdTweet);
    }

    async _sendTweetToSubscribers (userId, tweet) {
        const userFollowers = await this.followMapRepository.getUserFollowers(userId);

        this.tweetEventHandler.sendToClients(userFollowers, tweet);
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
