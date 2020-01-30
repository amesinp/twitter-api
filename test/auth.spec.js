import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiTHings from 'chai-things';
import app from '../src/app';

chai.should()
chai.use(chaiHttp);
chai.use(chaiTHings);

describe('Authentication', () => {
    const EXISTING_USER_USERNAME = 'johndoe';
    const EXISTING_USER_EMAIL = 'johndoe@example.com';
    const EXISTING_USER_PASSWORD = 'password';

    const NEW_USER_USERNAME = 'foobar';
    const NEW_USER_EMAIL = 'foobar@example.com';
    const NEW_USER_PASSWORD = 'newpassword';

    describe('/POST login', () => {
        it('it should allow login with correct username and password', async () => {
            const res = await chai.request(app)
                .post('/api/login')
                .send({
                    'username': EXISTING_USER_USERNAME,
                    'password': EXISTING_USER_PASSWORD
                });

            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.include.keys('token');
        });

        it('it should allow login with correct email and password', async () => {
            const res = await chai.request(app)
                .post('/api/login')
                .send({
                    'email': EXISTING_USER_EMAIL,
                    'password': EXISTING_USER_PASSWORD
                });

            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.include.keys('token');
        });

        it('it should stop login with correct user name and incorrect password', async () => {
            const res = await chai.request(app)
                .post('/api/login')
                .send({
                    'username': EXISTING_USER_USERNAME,
                    'password': 'wrongpassword'
                });

            res.should.have.status(401);
            res.type.should.equal('application/json');
        });

        it('it should stop login with incorrect user name and correct password', async () => {
            const res = await chai.request(app)
                .post('/api/login')
                .send({
                    'username': 'wrongusername',
                    'password': EXISTING_USER_PASSWORD
                });

            res.should.have.status(401);
            res.type.should.equal('application/json');
        });

        it('it should stop login with incorrect user name and incorrect password', async () => {
            const res = await chai.request(app)
                .post('/api/login')
                .send({
                    'username': 'wrongusername',
                    'password': 'wrongpassword'
                });

            res.should.have.status(401);
            res.type.should.equal('application/json');
        });

        it('it should stop login with correct email and incorrect password', async () => {
            const res = await chai.request(app)
                .post('/api/login')
                .send({
                    'email': EXISTING_USER_EMAIL,
                    'password': 'wrongpassword'
                });

            res.should.have.status(401);
            res.type.should.equal('application/json');
        });

        it('it should stop login with incorrect email and correct password', async () => {
            const res = await chai.request(app)
                .post('/api/login')
                .send({
                    'email': 'wrongemail',
                    'password': EXISTING_USER_PASSWORD
                });

            res.should.have.status(401);
            res.type.should.equal('application/json');
        });

        it('it should stop login with incorrect email and incorrect password', async () => {
            const res = await chai.request(app)
                .post('/api/login')
                .send({
                    'email': 'wrongemail',
                    'password': 'wrongpassword'
                });

            res.should.have.status(401);
            res.type.should.equal('application/json');
        });
    });


    describe('/POST register', () => {
        it('it should allow registration with correct details', async () => {
            const res = await chai.request(app)
                .post('/api/register')
                .send({
                    'name': 'Foo bar',
                    'username': NEW_USER_USERNAME,
                    'email': NEW_USER_EMAIL,
                    'password': NEW_USER_PASSWORD
                });

            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.include.keys('token');
        });

        it('it should stop registration with existing email', async () => {
            const res = await chai.request(app)
                .post('/api/register')
                .send({
                    'name': 'Foo bar',
                    'username': NEW_USER_USERNAME,
                    'email': EXISTING_USER_EMAIL,
                    'password': NEW_USER_PASSWORD
                });

            res.should.have.status(422);
            res.type.should.equal('application/json');
            res.body.should.include.keys('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.length.should.not.be.eql(0);
            res.body.errors.should.contain.a.thing.with.property('email');
        });

        it('it should stop registration with existing username', async () => {
            const res = await chai.request(app)
                .post('/api/register')
                .send({
                    'name': 'Foo bar',
                    'username': EXISTING_USER_USERNAME,
                    'email': 'foobar@example.com',
                    'password': NEW_USER_PASSWORD
                });

            res.should.have.status(422);
            res.type.should.equal('application/json');
            res.body.should.include.keys('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.length.should.not.be.eql(0);
            res.body.errors.should.contain.a.thing.with.property('username');
        });
    });

    describe('/POST login (after registration)', () => {
        it('it should allow login with newly registered user username and password', async () => {
            const res = await chai.request(app)
                .post('/api/login')
                .send({
                    'username': NEW_USER_USERNAME,
                    'password': NEW_USER_PASSWORD
                });

            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.include.keys('token');
        });

        it('it should allow login with newly registered user email and password', async () => {
            const res = await chai.request(app)
                .post('/api/login')
                .send({
                    'email': NEW_USER_EMAIL,
                    'password': NEW_USER_PASSWORD
                });

            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.include.keys('token');
        });
    });
});