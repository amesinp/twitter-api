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
        var count = await Tweet.where('user').in(userIdList).countDocuments();

        var tweets = await Tweet.find()
            .where('user').in(userIdList)
            .sort('-created_at')
            .skip((pageSize * currentPage) - pageSize)
            .limit(pageSize)
            .populate('user');

        return {
            data: tweets,
            count
        };
    }

    async getTweetsPaginated (searchParams, sortParam, sortType, pageSize, currentPage) {
        const filter = {};

        if (sortType === 'desc') {
            sortParam = '-' + sortParam;
        }

        // Use mongo index search to search tweet body
        if (searchParams.search) {
            filter.$text = {
                $search: searchParams.search
            };
        }

        if (searchParams.fromDate || searchParams.toDate) {
            filter.created_at = {}; // Intialize created at first to prevent reference error
            if (searchParams.fromDate) {
                filter.created_at.$gte = searchParams.fromDate;
            }
            if (searchParams.toDate) {
                filter.created_at.$lte = searchParams.toDate;
            }
        }

        var count = await Tweet.find(filter).countDocuments();

        var tweets = await Tweet.find(filter)
            .sort(sortParam)
            .skip((pageSize * currentPage) - pageSize)
            .limit(pageSize)
            .populate('user');

        return {
            data: tweets,
            count
        };
    }
}

export default TweetRepository;
