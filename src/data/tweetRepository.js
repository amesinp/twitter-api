import Tweet from '../models/tweet';
import TweetReply from '../models/tweetReply';

class TweetRepository {
    async createTweet (tweet) {
        const result = await Tweet.create(tweet);
        if (!result) {
            return null;
        }

        return Tweet.findById(result._id).populate('user');
    }

    async getById (id) {
        if (!id.match(/^[a-f\d]{24}$/i)) { // If the id is not a valid object id
            return null;
        }

        return Tweet.findById(id);
    }

    async replyToTweet (reply) {
        const result = await TweetReply.create(reply);
        if (!result) {
            return null;
        }

        return TweetReply.findById(result._id).populate({
            path: 'tweet',
            populate: {
                path: 'user'
            }
        }).populate('user');
    }
}

export default TweetRepository;
