import jwt from 'jsonwebtoken';

const checkToken = (req, res, next) => {
    let token = req.headers.authorization || req.headers['x-access-token']; // Get token from header
    if (!token) {
        return res.status(401).send();
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); // Remove "Bearer"
    }

    const secret = req.container.cradle.tokenSecret; // Get DI token secret
    jwt.verify(token, secret, async (err, decoded) => {
        if (err || !decoded._id) {
            return res.status(401).send();
        }
        
        const userRepository = req.container.cradle.userRepository; // Get DI user repository
        const user = await userRepository.getById(decoded._id);
        if (!user) {
            return res.status(401).send();
        }

        req.authUser = user;
        next();
    });
};

export default checkToken;
