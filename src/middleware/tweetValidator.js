import { body } from 'express-validator';

const validationRules = () => {
    return [
        body('body')
            .isLength({ min: 1, max: 140 }).withMessage('Tweet must be between 1 and 140 characters')
    ];
};

export default validationRules;
