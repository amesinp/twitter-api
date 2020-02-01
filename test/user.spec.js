import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiTHings from 'chai-things';
import jwt from 'jsonwebtoken';
import app from '../src/app';

chai.should()
chai.use(chaiHttp);
chai.use(chaiTHings);

describe('Users', () => {
    const TEST_SECRET = ('API-TEST');

    describe('/GET users', () => {
        it ('it should return users (with VALID token)', async () => {
            const token = jwt.sign({ _id: 1 }, TEST_SECRET);

            const res = await chai.request(app)
                .get('/api/users')
                .set('authorization', token);

            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.include.keys('data');
        });

        it ('it should not return users (with INVALID token)', async () => {
            const res = await chai.request(app)
                .get('/api/users')
                .set('authorization', 'invalidtoken')
                .send();

            res.should.have.status(401);
        });

        it ('it should not return users greater than specified size', async () => {
            const token = jwt.sign({ _id: 3 }, TEST_SECRET);

            const res = await chai.request(app)
                .get('/api/users')
                .query({ size: 2 })
                .set('authorization', token);

            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.include.keys('data');
            res.body.data.should.be.a('array');
            res.body.data.length.should.equal(2);
        });

        it ('it should not returns users with invalid query params', async () => {
            const token = jwt.sign({ _id: 1 }, TEST_SECRET);

            const res = await chai.request(app)
                .get('/api/users')
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