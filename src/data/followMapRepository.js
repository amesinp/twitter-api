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

    async getUserFollowers (userId) {
        const mappings = await FollowMap.find({ followed: userId });
        return mappings.map(m => m.follower);
    }
}

export default FollowMapRepository;
