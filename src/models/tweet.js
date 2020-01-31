import mongoose from 'mongoose';

const tweetSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: String,
        required: true,
        index: true
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
tweetSchema.index({
    body: 'text'
});

export default mongoose.model('Tweet', tweetSchema);
