import User from '../models/user';

class UserRepository {
    async getByUsernameOrEmail (user) {
        return User.findOne({
            $or: [
                { email: user.email },
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
        return User.findById(id);
    }

    async createUser (user) {
        return User.create(user);
    }
}

export default UserRepository;
