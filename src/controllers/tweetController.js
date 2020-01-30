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
}

export default TweetController;
