import { query } from 'express-validator';
import moment from 'moment';

const isValidDate = (value) => {
    const date = moment(value, 'YYY-MM-DD H:m');
    return date.isValid();
};

const validationRules = () => {
    return [
        query('size')
            .optional()
            .isNumeric().withMessage('Size must be a number'),

        query('page')
            .optional()
            .isInt().withMessage('Page must be a number'),

        query('sort_type')
            .optional()
            .isIn(['asc', 'desc']).withMessage('Sort type must be one of ["asc", "desc"]'),

        query('from_date')
            .optional()
            .custom(isValidDate).withMessage('From date must be a valid date'),

        query('to_date')
            .optional()
            .custom(isValidDate).withMessage('To date must be a valid date')
    ];
};

export default validationRules;
