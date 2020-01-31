class DummyFollowMapRepository {
    constructor () {
        this.mappings = [
            {
                _id: 1,
                followed: 1, // John smith follows john doe
                follower: 3
            },
            {
                _id: 2,
                followed: 2, // John smith follows jane doe
                follower: 3
            },
            {
                _id: 3,
                followed: 2, // Jane smith follows jane doe
                follower: 4
            }
        ];
    }

    async createMapping (map) {
        this.mappings.push(map);
        return map;
    }

    async mappingExists (map) {
        return this.mappings.find(m => m.followed === map.followed && m.follower === map.follower);
    }

    async getUserFollows (userId) {
        const mappings = this.mappings.filter(m => m.follower === userId);
        return mappings.map(m => m.followed);
    }
}

export default DummyFollowMapRepository;
