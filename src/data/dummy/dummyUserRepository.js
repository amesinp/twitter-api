class DummyUserRepository {
    constructor () {
        this.users = [
            {
                _id: '1',
                name: 'John Doe',
                email: 'johndoe@example.com',
                username: 'johndoe',
                password: '$2b$08$bQPN9kxBgEV4SY.Gw7SP6eOWwGxOo6bx80g9KBHsTJLhrn8I0mklu' // hash equivalent of "password"
            }
        ];
    }

    async getByUsernameOrEmail (user) {
        return this.users.find(u => u.email === user.email || u.username === user.username);
    }

    async checkUsernameExists (username) {
        const user = this.users.find(u => u.username === username);
        return user != null;
    }

    async checkEmailExists (email) {
        const user = this.users.find(u => u.email === email);
        return user != null;
    }

    async getById (id) {
        return this.users.find(u => u._id === id);
    }

    async createUser (user) {
        let id = 1;
        if (this.users.length > 0) {
            id = parseInt(this.users[this.users.length - 1]._id) + 1;
        }
        user._id = id;
        this.users.push(user);
        return user;
    }
}

export default DummyUserRepository;
