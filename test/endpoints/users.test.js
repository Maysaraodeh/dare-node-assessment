import chai from 'chai';
import request from 'supertest';
import rewire from 'rewire';
import nock from 'nock';
import { validAuth } from '../data.shared';
import config from '../../config';
import { nockClientsResponse } from './payloads/clients.payload';
import {
  validLoginAdmin,
  validLoginUser,
  invalidEmailValidation,
  invalidPasswordValidation,
  missingEmailValidation,
  missingPasswordValidation,
  emptyEmail,
  emptyPassword,
  notExistedUser,
} from './payloads/users.payload';

const { INSURANCE_API_BASE_URL } = config;
let app = rewire('../../app');
const expect = chai.expect;
const API = '/api';

describe('User Login', () => {
  before(async () => {
    app = rewire('../../app');
  });

  beforeEach(() => {
    nock(`${INSURANCE_API_BASE_URL}`)
      .post('/login')
      .reply(200, {
        ...validAuth,
      });
    nock(`${INSURANCE_API_BASE_URL}`)
      .get('/clients')
      .reply(200, nockClientsResponse);
  });

  describe('POST /login', () => {
    it('should return token data for admin', (done) => {
      request(app)
        .post(`${API}/login`)
        .send(validLoginAdmin)
        .expect((res) => {
          expect(res.body)
            .to.be.an('object')
            .to.have.keys('token', 'type', 'expires_in');
          global.adminToken = res.body.token;
          expect(res.body.expires_in).to.be.below(101);
        })
        .expect(200, done);
    });

    it('should return token data for user', (done) => {
      request(app)
        .post(`${API}/login`)
        .send(validLoginUser)
        .expect((res) => {
          expect(res.body)
            .to.be.an('object')
            .to.have.keys('token', 'type', 'expires_in');
          global.userToken = res.body.token;
          expect(res.body.expires_in).to.be.below(101);
        })
        .expect(200, done);
    });

    it('should return not found for not existed client', (done) => {
      request(app)
        .post(`${API}/login`)
        .send(notExistedUser)
        .expect((res) => {
          expect(res.body).to.be.an('object').to.have.keys('message', 'code');
          expect(res.body.message).to.equal('Not found.');
        })
        .expect(404, done);
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
