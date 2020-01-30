import mongoose from 'mongoose';

const followMapSchema = mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    followed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }
});
followMapSchema.index({ follower: 1, followed: 1 }, { unique: true });

export default mongoose.model('FollowMap', followMapSchema);
