import chai from 'chai';
import request from 'supertest';
import rewire from 'rewire';
import {
  validLogin,
  invalidEmailValidation,
  invalidPasswordValidation,
  missingEmailValidation,
  missingPasswordValidation,
  emptyEmail,
  emptyPassword,
} from './payloads/users.payload';

let app = rewire('../../app');
const expect = chai.expect;
const API = '/api';

describe('User Login', () => {
  before(async () => {
    app = rewire('../../app');
  });

  context('POST /login', () => {
    it('should return token data', (done) => {
      request(app)
        .post(`${API}/login`)
        .send(validLogin)
        .expect((res) => {
          expect(res.body)
            .to.be.an('object')
            .to.have.keys('token', 'type', 'expires_in');
          expect(res.body.expires_in).to.equal(1);
        })
        .expect(200, done);
    });

    it('should return validation error on invalid email', (done) => {
      request(app)
        .post(`${API}/login`)
        .send(invalidEmailValidation)
        .expect((res) => {
          expect(res.body)
            .to.be.an('object')
            .to.have.property('message')
            .to.be.equal('email must be a valid email');
        })
        .expect(400, done);
    });

    it('should return validation error on invalid password length', (done) => {
      request(app)
        .post(`${API}/login`)
        .send(invalidPasswordValidation)
        .expect((res) => {
          expect(res.body)
            .to.be.an('object')
            .to.have.property('message')
            .to.be.equal('password length must be at least 6 characters long');
        })
        .expect(400, done);
    });

    it('should return validation error on missing email', (done) => {
      request(app)
        .post(`${API}/login`)
        .send(missingEmailValidation)
        .expect((res) => {
          expect(res.body)
            .to.be.an('object')
            .to.have.property('message')
            .to.be.equal('email is required');
        })
        .expect(400, done);
    });
    it('should return validation error on missing password', (done) => {
      request(app)
        .post(`${API}/login`)
        .send(missingPasswordValidation)
        .expect((res) => {
          expect(res.body)
            .to.be.an('object')
            .to.have.property('message')
            .to.be.equal('password is required');
        })
        .expect(400, done);
    });

    it('should return validation error on empty email', (done) => {
      request(app)
        .post(`${API}/login`)
        .send(emptyEmail)
        .expect((res) => {
          expect(res.body)
            .to.be.an('object')
            .to.have.property('message')
            .to.be.equal('email is not allowed to be empty');
        })
        .expect(400, done);
    });
    it('should return validation error on empty password', (done) => {
      request(app)
        .post(`${API}/login`)
        .send(emptyPassword)
        .expect((res) => {
          expect(res.body)
            .to.be.an('object')
            .to.have.property('message')
            .to.be.equal('password is not allowed to be empty');
        })
        .expect(400, done);
    });
  });
});
