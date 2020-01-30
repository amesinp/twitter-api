import FollowMap from '../models/followMap';

class FollowMapRepository {
    async createMapping (map) {
        return FollowMap.create(map);
    }

    async mappingExists (map) {
        return FollowMap.findOne(map);
    }
}

export default FollowMapRepository;
