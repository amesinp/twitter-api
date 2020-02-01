import { query } from 'express-validator';
// import paginationRules from './paginationValidator';

const validationRules = () => {
    return [
        query('sort')
            .optional()
            .isIn(['created_at', 'name', 'username']).withMessage('Sort property must be one of ["created_at", "name", "username"]')

        // ...paginationRules
    ];
};

export default validationRules;
