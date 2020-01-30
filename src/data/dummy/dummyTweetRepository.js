class DummyTweetRepository {
    constructor () {
        this.tweets = [];
        this.users = [
            {
                _id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com',
                username: 'johndoe'
            }
        ];
    }

    async createTweet (tweet) {
        let id = 1;
        if (this.tweets.length > 0) {
            id = parseInt(this.tweets[this.tweets.length - 1]._id) + 1;
        }

        tweet._id = id;
        tweet.user = this.users.find(u => u._id === tweet.user);
        this.tweets.push(tweet);
        return tweet;
    }
}

export default DummyTweetRepository;
