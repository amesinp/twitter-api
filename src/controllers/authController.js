import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class AuthController {
    constructor ({ userRepository, tokenSecret }) {
        this.userRepository = userRepository;
        this.tokenSecret = tokenSecret;
    }

    async login (req, res) {
        const { username, password } = req.body;

        const user = await this.userRepository.getByUsernameOrEmail({
            username,
            password
        });
        if (user == null || !await this._verifyPassword(req.body.password, user.password)) {
            return res.status(401).send({ message: 'Invalid username or password' });
        }
        
        const token = this._generateUserAuthToken(user);
        return res.status(200).send({ token: token });
    }

    async register (req, res) {
        const { name, username, email, password } = req.body;
        const user = {
            name,
            username,
            email,
            password
        };

        user.password = await this._getHashedPassword(user.password);
        const createdUser = await this.userRepository.createUser(user);
        if (createdUser == null) {
            return res.status(500).send({ message: 'An error occurred during registration. PLease try again' });
        }

        const token = this._generateUserAuthToken(createdUser);
        return res.status(200).send({ token: token });
    }

    async _verifyPassword (plainText, hashed) {
        return bcrypt.compare(plainText, hashed);
    }

    async _getHashedPassword (plainText) {
        return bcrypt.hash(plainText, 8);
    }

    _generateUserAuthToken (user) {
        return jwt.sign({ _id: user._id }, this.tokenSecret);
    }
}

export default AuthController;
