import { body, param } from 'express-validator';

const validationRules = () => {
    return [
        body('body')
            .isLength({ min: 1, max: 140 }).withMessage('Reply must be between 1 and 140 characters'),

        param('tweet')
            .custom((value, { req }) => {
                const tweetRepository = req.container.cradle.tweetRepository; // Get DI tweet repository
                return tweetRepository.getById(value).then(result => {
                    if (!result) {
                        return Promise.reject(new Error('Could not find tweet to reply'));
                    }
                });
            })
    ];
};

export default validationRules;
