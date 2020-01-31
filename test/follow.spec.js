import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiTHings from 'chai-things';
import jwt from 'jsonwebtoken';
import app from '../src/app';

chai.should()
chai.use(chaiHttp);
chai.use(chaiTHings);

describe('Follow User', () => {
    const TEST_SECRET = ('API-TEST');

    describe('/POST follows', () => {
        it ('it should allow valid user follow another valid user (with VALID token)', async () => {
            const token = jwt.sign({ _id: 1 }, TEST_SECRET);

            const res = await chai.request(app)
                .post('/api/users/2/follow')
                .set('authorization', token)
                .send();

            res.should.have.status(200);
            res.type.should.equal('application/json');
        });

        it ('it should not allow follow (with INVALID token)', async () => {
            const res = await chai.request(app)
                .post('/api/users/2/follow')
                .set('authorization', 'invalidtoken')
                .send();

            res.should.have.status(401);
        });

        it ('it should not allow valid user follow themself (with VALID token)', async () => {
            const token = jwt.sign({ _id: 1 }, TEST_SECRET);

            const res = await chai.request(app)
                .post('/api/users/1/follow')
                .set('authorization', token)
                .send();

            res.should.have.status(400);
            res.type.should.equal('application/json');
            res.body.should.include.keys('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.length.should.not.be.eql(0);
            res.body.errors.should.contain.a.thing.with.property('user');
        });

        it ('it should not allow valid user follow an invalid user (with VALID token)', async () => {
            const token = jwt.sign({ _id: 1 }, TEST_SECRET);

            const res = await chai.request(app)
                .post('/api/users/invaliduser/follow')
                .set('authorization', token)
                .send();

            res.should.have.status(400);
            res.type.should.equal('application/json');
            res.body.should.include.keys('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.length.should.not.be.eql(0);
            res.body.errors.should.contain.a.thing.with.property('user');
        });
    });
});