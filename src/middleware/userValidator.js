import { body, validationResult } from 'express-validator';

const validationRules = () => {
    return [
        body('name')
            .not().isEmpty().withMessage('Name is required'),

        body('username')
            .isLength({ min: 5 }).withMessage('Username must be a minimum of 5 characters')
            .custom((value, { req }) => {
                const userRepository = req.container.cradle.userRepository; // Get DI user repository
                return userRepository.checkUsernameExists(value).then(result => {
                    if (result) {
                        return Promise.reject(new Error('Username already exists'));
                    }
                });
            }),

        body('email')
            .not().isEmpty().withMessage('Email address is required')
            .isEmail().withMessage('Email address is not valid')
            .custom((value, { req }) => {
                const userRepository = req.container.cradle.userRepository; // Get DI user repository
                return userRepository.checkEmailExists(value).then(result => {
                    if (result) {
                        return Promise.reject(new Error('Email address already exists'));
                    }
                });
            }),

        body('password')
            .isLength({ min: 8 }).withMessage('Password must be a minimum of 8 characters')
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({
        [err.param]: err.msg
    }));

    return res.status(422).json({
        errors: extractedErrors
    });
};

export default {
    validationRules,
    validate
};
