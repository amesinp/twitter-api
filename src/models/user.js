import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        index: true
    },
    password: {
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
            delete ret.password;
            delete ret.__v;
        }
    }
});
userSchema.index({
    name: 'text',
    username: 'text'
});

export default mongoose.model('User', userSchema);
