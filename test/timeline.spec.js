import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiThings from 'chai-things';
import jwt from 'jsonwebtoken';
import app from '../src/app';

chai.should()
chai.use(chaiHttp);
chai.use(chaiThings);

describe('Timeline', () => {
    const TEST_SECRET = ('API-TEST');

    describe('/GET timeline', () => {
        it ('it should retrieve timeline (with VALID token)', async () => {
            const token = jwt.sign({ _id: 3 }, TEST_SECRET);

            const res = await chai.request(app)
                .get('/api/timeline')
                .set('authorization', token);

            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.include.keys('data');
            res.body.data.should.be.a('array');
            res.body.data.length.should.not.be.eql(0);
        });

        it ('it should not retrieve timeline (with INVALID token)', async () => {
            const res = await chai.request(app)
                .get('/api/timeline')
                .set('authorization', 'invalidtoken');
            
            res.should.have.status(401);
        });

        it ('it should not return tweets greater than specified size', async () => {
            const token = jwt.sign({ _id: 3 }, TEST_SECRET);

            const res = await chai.request(app)
                .get('/api/timeline')
                .query({ size: 1 })
                .set('authorization', token);

            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.include.keys('data');
            res.body.data.should.be.a('array');
            res.body.data.length.should.equal(1);
        });

        it ('it should not return tweets by a user that the auth user is not following', async () => {
            const token = jwt.sign({ _id: 3 }, TEST_SECRET);

            const res = await chai.request(app)
                .get('/api/timeline')
                .query({ size: 10 })
                .set('authorization', token);

            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.include.keys('data');
            res.body.data.should.be.a('array');

            var userIds = [];
            res.body.data.forEach((tweet) => {
                if (!userIds.includes(tweet.user._id))
                    userIds.push(tweet.user._id);
            });
            userIds.sort();

            userIds.should.eql([1, 2]);
        });
    });
});