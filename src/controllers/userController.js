import { getPaginationAndSortParams, getPaginatedResult } from '../helpers/paginationHelpers';

class UserController {
    constructor ({ userRepository }) {
        this.userRepository = userRepository;
    }

    async getUsersPaginated (req, res) {
        const pageParams = getPaginationAndSortParams(req.query);
        
        const result = await this.userRepository.getUsersPaginated({
            username: req.query.username,
            name: req.query.name,
            search: req.query.search,
            fromDate: req.query.from_date,
            toDate: req.query.to_date
        }, pageParams.sort, pageParams.sortType, pageParams.size, pageParams.page);

        // Get full url from request
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        const finalResult = getPaginatedResult(result, fullUrl, pageParams);
        res.status(200).send(finalResult);
    }
}

export default UserController;
