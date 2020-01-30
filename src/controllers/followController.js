class FollowController {
    constructor ({ followMapRepository }) {
        this.followMapRepository = followMapRepository;
    }
    
    async followUser (req, res) {
        const { user } = req.body;
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

export default FollowController;
