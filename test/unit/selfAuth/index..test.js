import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import nock from 'nock';
import { getAuthToken } from '../../../services/selfAuth';
import config from '../../../config';
import { validAuth } from '../../data.shared';

const { INSURANCE_API_BASE_URL } = config;
const expect = chai.expect;

chai.use(chaiAsPromised);

afterEach(() => nock.cleanAll());

describe('SelfAuth Service', () => {
  describe('getAuth', () => {
    it('should return an object contains the token and type', async () => {
      nock(`${INSURANCE_API_BASE_URL}`)
        .post('/login')
        .reply(200, {
          ...validAuth,
        });

      const result = await getAuthToken();
      expect(result).to.deep.equal({ ...validAuth });
    });

    it('should throw an error if no token or type found in the response', async () => {
      nock(`${INSURANCE_API_BASE_URL}`).post('/login').reply(200);
      await expect(getAuthToken()).to.be.rejectedWith();
    });

    it('should throw an error if the credentials are wrong', async () => {
      nock(INSURANCE_API_BASE_URL).post('/login').reply(401, {
        statusCode: 401,
        error: 'UnAuthorized',
        message: 'invalid secret or client id',
      });
      await expect(getAuthToken()).to.be.rejectedWith();
    });

    it('should throw an error if the service is down', async () => {
      nock(INSURANCE_API_BASE_URL).post('/login').reply(500, {
        statusCode: 500,
        error: 'internal server error',
      });
      await expect(getAuthToken()).to.be.rejectedWith();
    });
  });
});
