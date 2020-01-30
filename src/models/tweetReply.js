import mongoose from 'mongoose';

const tweetReplySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    body: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
        }
    }
});

export default mongoose.model('TweetReply', tweetReplySchema);
