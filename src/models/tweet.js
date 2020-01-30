import mongoose from 'mongoose';

const tweetSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
            delete ret.user_id;
            delete ret.__v;
        }
    }
});

export default mongoose.model('Tweet', tweetSchema);
