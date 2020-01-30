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
});