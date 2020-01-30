class TweetController {
    constructor ({ tweetRepository }) {
        this.tweetRepository = tweetRepository;
    }

    async postTweet (req, res) {
        const { body } = req.body;

        const createdTweet = await this.tweetRepository.createTweet({ body });
        if (!createdTweet) {
            res.status(500).send({ message: 'An error occurred posting tweet. Please try again' });
        }

        res.status(201).send(createdTweet);
    }
}

export default TweetController;
