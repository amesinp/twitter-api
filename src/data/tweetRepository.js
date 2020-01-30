import Tweet from '../models/tweet';

class TweetRepository {
    async createTweet (tweet) {
        const result = await Tweet.create(tweet);
        if (!result) {
            return null;
        }

        return Tweet.findById(result._id).populate('user');
    }
}

export default TweetRepository;
