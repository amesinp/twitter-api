import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiTHings from 'chai-things';
import jwt from 'jsonwebtoken';
import app from '../src/app';

chai.should()
chai.use(chaiHttp);
chai.use(chaiTHings);

describe('Tweets', () => {
    const TEST_SECRET = ('API-TEST');

    describe('/POST tweets', () => {
        it ('it should post tweet with valid body (with VALID token)', async () => {
            const token = jwt.sign({ _id: 1 }, TEST_SECRET);

            const res = await chai.request(app)
                .post('/api/tweets')
                .set('authorization', token)
                .send({
                    'body': 'Hello world'
                });

            res.should.have.status(201);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.include.keys('_id');
            res.body.should.include.keys('user');
            res.body.user.should.include.keys('_id');
            res.body.user._id.should.equal(1);
        });

        it ('it should not post tweet with valid body (with INVALID token)', async () => {
            const res = await chai.request(app)
                .post('/api/tweets')
                .set('authorization', 'invalidtoken')
                .send({
                    'body': 'Hello world'
                });

            res.should.have.status(401);
        });

        it ('it should not post tweet with valid body (without token)', async () => {
            const res = await chai.request(app)
                .post('/api/tweets')
                .send({
                    'body': 'Hello world'
                });

            res.should.have.status(401);
        });

        it ('it should not post tweet with invalid body', async () => {
            const token = jwt.sign({ _id: 1 }, TEST_SECRET);

            const res = await chai.request(app)
                .post('/api/tweets')
                .set('authorization', token)
                .send({
                    'body': ''
                });

            res.should.have.status(400);
            res.type.should.equal('application/json');
            res.body.should.include.keys('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.length.should.not.be.eql(0);
            res.body.errors.should.contain.a.thing.with.property('body');
        });
    });

    describe('/POST tweet reply', () => {
        it ('it should post reply with valid tweet and valid body (with VALID token)', async () => {
            const token = jwt.sign({ _id: 1 }, TEST_SECRET);

            const res = await chai.request(app)
                .post('/api/tweets/1/reply')
                .set('authorization', token)
                .send({
                    'body': 'Lorem ipsum dolor sit amet'
                });

            res.should.have.status(201);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.include.keys('_id');
            res.body.should.include.keys('user');
            res.body.user.should.include.keys('_id');
            res.body.user._id.should.equal(1);
            res.body.should.include.keys('tweet');
            res.body.tweet.should.include.keys('_id');
            res.body.tweet._id.should.equal(1);
        });

        it ('it should not post reply with valid tweet and valid body (with INVALID token)', async () => {
            const res = await chai.request(app)
                .post('/api/tweets/1/reply')
                .set('authorization', 'invalidtoken')
                .send({
                    'body': 'Lorem ipsum dolor sit amet'
                });

            res.should.have.status(401);
        });

        it ('it should not post reply with invalid tweet and valid body (with VALID token)', async () => {
            const token = jwt.sign({ _id: 1 }, TEST_SECRET);

            const res = await chai.request(app)
                .post('/api/tweets/invalidtweet/reply')
                .set('authorization', token)
                .send({
                    'body': 'Lorem ipsum dolor sit amet'
                });

            res.should.have.status(400);
            res.type.should.equal('application/json');
            res.body.should.include.keys('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.length.should.not.be.eql(0);
            res.body.errors.should.contain.a.thing.with.property('tweet');
        });

        it ('it should not post reply with valid tweet and invalid body (with VALID token)', async () => {
            const token = jwt.sign({ _id: 1 }, TEST_SECRET);

            const res = await chai.request(app)
                .post('/api/tweets/1/reply')
                .set('authorization', token)
                .send({
                    'body': ''
                });

            res.should.have.status(400);
            res.type.should.equal('application/json');
            res.body.should.include.keys('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.length.should.not.be.eql(0);
            res.body.errors.should.contain.a.thing.with.property('body');
        });
    });

    describe('/GET tweets', () => {
        it ('it should return tweets (with VALID token)', async () => {
            const token = jwt.sign({ _id: 1 }, TEST_SECRET);

            const res = await chai.request(app)
                .get('/api/tweets')
                .set('authorization', token);

            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.include.keys('data');
        });

        it ('it should not return tweets (with INVALID token)', async () => {
            const res = await chai.request(app)
                .get('/api/tweets')
                .set('authorization', 'invalidtoken')
                .send();

            res.should.have.status(401);
        });

        it ('it should not return tweets greater than specified size', async () => {
            const token = jwt.sign({ _id: 3 }, TEST_SECRET);

            const res = await chai.request(app)
                .get('/api/tweets')
                .query({ size: 2 })
                .set('authorization', token);

            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.include.keys('data');
            res.body.data.should.be.a('array');
            res.body.data.length.should.equal(2);
        });

        it ('it should not returns tweets with invalid query params', async () => {
            const token = jwt.sign({ _id: 1 }, TEST_SECRET);

            const res = await chai.request(app)
                .get('/api/tweets')
                .query({ 
                    size: 'invalidsize', 
                    page: 'invalidpage', 
                    from_date: 'invaliddate', 
                    to_date: 'invaliddate',
                    sort: 'invalidsort',
                    sort_type: 'invalidsorttype',
                })
                .set('authorization', token);

            res.should.have.status(400);
            res.type.should.equal('application/json');
            res.body.should.include.keys('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.length.should.not.be.eql(0);
            res.body.errors.should.contain.a.thing.with.property('size');
            res.body.errors.should.contain.a.thing.with.property('page');
            res.body.errors.should.contain.a.thing.with.property('from_date');
            res.body.errors.should.contain.a.thing.with.property('to_date');
            res.body.errors.should.contain.a.thing.with.property('sort');
            res.body.errors.should.contain.a.thing.with.property('sort_type');
        });
    });
});