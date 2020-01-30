class DummyTweetRepository {
    constructor () {
        this.tweets = [
            {
                _id: 1,
                body: 'Hello world',
                user: 1
            }
        ];
        this.users = [
            {
                _id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com',
                username: 'johndoe'
            }
        ];
        this.tweetReplies = [];
    }

    async createTweet (tweet) {
        let id = 1;
        if (this.tweets.length > 0) {
            id = parseInt(this.tweets[this.tweets.length - 1]._id) + 1;
        }

        tweet._id = id;
        this.tweets.push(tweet);

        // populate
        tweet.user = this.users.find(u => u._id === tweet.user);
        return tweet;
    }

    async getById (id) {
        const convertedId = parseInt(id);
        if (isNaN(convertedId)) {
            return null;
        }

        return this.tweets.find(t => t._id === convertedId);
    }

    async replyToTweet (reply) {
        let id = 1;
        if (this.tweetReplies.length > 0) {
            id = parseInt(this.tweetReplies[this.tweetReplies.length - 1]._id) + 1;
        }

        reply._id = id;
        this.tweetReplies.push(reply);

        // populate
        reply.tweet = await this.getById(reply.tweet);
        reply.tweet.user = this.users.find(u => u._id === reply.tweet.user);
        reply.user = this.users.find(u => u._id === reply.user);
        return reply;
    }
}

export default DummyTweetRepository;
