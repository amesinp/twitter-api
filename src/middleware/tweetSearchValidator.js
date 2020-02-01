import { query } from 'express-validator';
// import paginationRules from './paginationValidator';

const validationRules = () => {
    return [
        query('sort')
            .optional()
            .isIn(['created_at']).withMessage('Sort property must be one of ["created_at"]')
        
        // ...paginationRules
    ];
};

export default validationRules;
