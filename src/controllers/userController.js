import { getPaginationAndSortParams, getPaginatedResult } from '../helpers/paginationHelpers';

class UserController {
    constructor ({ userRepository, followMapRepository }) {
        this.userRepository = userRepository;
        this.followMapRepository = followMapRepository;
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

    async followUser (req, res) {
        const { user } = req.params;
        const map = {
            followed: user,
            follower: req.authUser._id
        };

        if (await this.followMapRepository.mappingExists(map)) {
            return res.status(409).send({ message: 'You are already following this user' });
        }

        const followMap = this.followMapRepository.createMapping(map);
        if (!followMap) {
            return res.status(500).send({ message: 'An error occurred. Please try again' });
        }

        return res.status(200).send({ message: 'Followed successfully' });
    }
}

export default UserController;
