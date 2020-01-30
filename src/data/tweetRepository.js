import Tweet from '../models/tweet';

class TweetRepository {
    async createTweet (tweet) {
        return Tweet.create(tweet);
    }
}

export default TweetRepository;
