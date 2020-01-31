import mongoose from 'mongoose';
import User from '../models/user';

class UserRepository {
    async getByUsernameOrEmail (user) {
        return User.findOne({
            $or: [
                { email: user.username },
                { username: user.username }
            ]
        });
    }

    async checkUsernameExists (username) {
        const user = await User.findOne({ username: username });
        return user != null;
    }

    async checkEmailExists (email) {
        const user = await User.findOne({ email: email });
        return user != null;
    }

    async getById (id) {
        if (!mongoose.isValidObjectId(id)) {
            return null;
        }

        return User.findById(id);
    }

    async createUser (user) {
        return User.create(user);
    }

    async getUsersPaginated (searchParams, sortParam, sortType, pageSize, currentPage) {
        const filter = {};

        if (sortType === 'desc') {
            sortParam = '-' + sortParam;
        }

        // Exact username search
        if (searchParams.username) {
            filter.username = searchParams.username;
        }

        // Exact name search
        if (searchParams.name) {
            filter.name = searchParams;
        }

        // Regex is used for user search despite being slower because mongodb index search only matches whole words
        if (searchParams.search) {
            const regexExp = new RegExp('.*' + searchParams.search + '.*', 'i');
            filter.$or = [
                { name: regexExp },
                { username: regexExp }
            ];
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

        var count = await User.find(filter).countDocuments();

        var users = await User.find(filter)
            .sort(sortParam)
            .skip((pageSize * currentPage) - pageSize)
            .limit(pageSize);

        return {
            data: users,
            count
        };
    }
}

export default UserRepository;
