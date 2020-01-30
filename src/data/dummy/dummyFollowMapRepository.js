class DummyFollowMapRepository {
    constructor () {
        this.mappings = [];
    }

    async createMapping (map) {
        this.mappings.push(map);
        return map;
    }

    async mappingExists (map) {
        return this.mappings.find(m => m.followed === map.followed && m.follower === map.follower);
    }
}

export default DummyFollowMapRepository;
