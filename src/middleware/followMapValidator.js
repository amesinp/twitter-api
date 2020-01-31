import { param } from 'express-validator';

const validationRules = () => {
    return [
        param('user')
            .custom((value, { req }) => {
                if (!value) {
                    return Promise.reject(new Error('User to follow is required'));
                }

                if (value.toString() === req.authUser._id.toString()) {
                    return Promise.reject(new Error('Cannot follow yourself'));
                }

                const userRepository = req.container.cradle.userRepository; // Get DI tweet repository
                return userRepository.getById(value).then(result => {
                    if (!result) {
                        return Promise.reject(new Error('Could not find user to follow'));
                    }
                });
            })
    ];
};

export default validationRules;
