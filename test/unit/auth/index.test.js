import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getJWT } from '../../../services/auth';
import { payload } from './data';
import config from '../../../config';
import jwt from 'jsonwebtoken';
const { JWT_ENCRYPTION } = config;
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('JWT Auth Service', () => {
  it('should return valid bearer token with expiration time of 1 second', () => {
    const result = getJWT(payload);
    expect(result).to.have.keys(['token', 'type', 'expires_in']);
    expect(result.expires_in).to.be.equal(1);
    expect(jwt.decode(result.token, JWT_ENCRYPTION).user).to.deep.equal({
      ...payload,
    });
  });
  it('should return error after token expires', async () => {
    const result = getJWT(payload);
    await new Promise((res) => {
      setTimeout(() => {
        res('revoked');
      }, 1000);
    });
    try {
      jwt.verify(result.token, JWT_ENCRYPTION);
    } catch (err) {
      expect(err.message).to.be.equal('jwt expired');
    }
  });

  it('should return error for invalid token', async () => {
    const result = getJWT(payload);
    try {
      jwt.verify(result.token + 'u', JWT_ENCRYPTION);
    } catch (err) {
      expect(err.message).to.be.equal('invalid signature');
    }
  });
});
