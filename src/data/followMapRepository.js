import FollowMap from '../models/followMap';

class FollowMapRepository {
    async createMapping (map) {
        return FollowMap.create(map);
    }

    async mappingExists (map) {
        return FollowMap.findOne(map);
    }

    async getUserFollows (userId) {
        const mappings = await FollowMap.find({ follower: userId });
        return mappings.map(m => m.followed);
    }
}

export default FollowMapRepository;
