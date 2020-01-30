import mongoose from 'mongoose';
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
        if (!mongoose.isValidObjectId(id)) {
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

    async getTweetsForUsersPaginated (userIdList, pageSize, currentPage) {
        return Tweet.find()
            .where('user').in(userIdList)
            .sort('-created_at')
            .skip((pageSize * currentPage) - pageSize)
            .limit(pageSize)
            .populate('user');
    }
}

export default TweetRepository;
