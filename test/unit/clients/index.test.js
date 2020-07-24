import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import nock from 'nock';
import config from '../../../config';
import {
  findClientByFilter,
  findAllClientsDetails,
} from '../../../services/clients';
const { INSURANCE_API_BASE_URL } = config;
import { cache } from '../../../services/cache';
import { clientsArray } from './data';
import { validAuth, invalidAuth } from '../../data.shared';
import { nockPoliciesResponse } from '../../endpoints/payloads/policies.payload';
const { token, type } = validAuth;
const { toke: invalidToken, type: invalidType } = invalidAuth;

const validAuthorization = { Authorization: `${type} ${token}` };
const invalidAuthorization = {
  Authorization: `${invalidType} ${invalidToken}`,
};
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('Clients Service', () => {
  beforeEach(() => {
    nock(`${INSURANCE_API_BASE_URL}`)
      .post('/login')
      .reply(200, {
        ...validAuth,
      });
    nock(`${INSURANCE_API_BASE_URL}`)
      .get('/policies')
      .reply(200, nockPoliciesResponse);
  });

  describe('FindClientByFilter without cache', () => {
    it('should return client object', async () => {
      cache.flushAll();
      nock(`${INSURANCE_API_BASE_URL}`, {
        reqheaders: {
          ...validAuthorization,
        },
      })
        .get('/clients')
        .reply(200, [clientsArray.find((c) => c.id === '1')]);

      const result = await findClientByFilter({
        field: 'id',
        value: '1',
      });
      expect(result).to.deep.equal(clientsArray.find((c) => c.id === '1'));
    });

    it('should fail because of bad auth', async () => {
      cache.flushAll();
      nock(`${INSURANCE_API_BASE_URL}`, {
        ...invalidAuthorization,
      })
        .get('/clients')
        .reply(401, { message: 'UnAuthorized' });

      await expect(
        findClientByFilter({
          field: 'id',
          value: '1',
        })
      ).to.be.rejectedWith('UnAuthorized');
    });

    it('should throw not found error when client is not found', async () => {
      cache.flushAll();
      nock(`${INSURANCE_API_BASE_URL}`, {
        reqheaders: {
          ...validAuthorization,
        },
      })
        .get('/clients')
        .reply(200, [clientsArray[0]]);

      await expect(
        findClientByFilter({
          field: 'id',
          value: '',
        })
      ).to.be.rejectedWith('Not found.');
    });
  });

  describe('FindClientByFilter with cache', () => {
    it('should return client object', async () => {
      cache.set('clients', clientsArray);
      const result = await findClientByFilter({
        field: 'id',
        value: '1',
      });

      expect(result).to.deep.equal(clientsArray.find((c) => c.id === '1'));
    });

    it('should throw not found error when no client found in cache', async () => {
      cache.set('clients', clientsArray);

      await expect(
        findClientByFilter({
          field: 'id',
          value: '',
        })
      ).to.be.rejectedWith('Not found.');
    });
  });

  describe('FindAllClients without cache', () => {
    it('should return clients array', async () => {
      cache.flushAll();
      nock(`${INSURANCE_API_BASE_URL}`, {
        reqheaders: {
          ...validAuthorization,
        },
      })
        .get('/clients')
        .reply(200, clientsArray);
      nock(`${INSURANCE_API_BASE_URL}`)
        .post('/login')
        .reply(200, {
          ...validAuth,
        });
      const result = await findAllClientsDetails();
      expect(result)
        .to.be.an('object')
        .that.include.keys(['clients', 'currentPage', 'totalPages']);
      expect(result.clients.length).to.equal(3);
      expect(result.currentPage).to.equal(1);
      expect(result.totalPages).to.equal(1);
    });

    it('should fail because of bad auth', async () => {
      cache.flushAll();
      nock(`${INSURANCE_API_BASE_URL}`, {
        reqheaders: {
          ...invalidAuthorization,
        },
      })
        .get('/clients')
        .reply(401, { message: 'UnAuthorized' });

      await expect(findAllClientsDetails()).to.be.rejected;
    });

    it('should return one client when name field exists', async () => {
      cache.flushAll();
      nock(`${INSURANCE_API_BASE_URL}`, {
        reqheaders: {
          ...validAuthorization,
        },
      })
        .get('/clients')
        .reply(200, clientsArray);
      const result = await findAllClientsDetails({ name: 'admin' });
      expect(result).to.be.an('object');
    });

    it('should throw not found if no client matches the name filter', async () => {
      cache.flushAll();
      nock(`${INSURANCE_API_BASE_URL}`, {
        reqheaders: {
          ...validAuthorization,
        },
      })
        .get('/clients')
        .reply(200, [clientsArray.find((c) => c.id === '1')]);

      await expect(
        findAllClientsDetails({
          name: 'test',
        })
      ).to.be.rejectedWith('Not found.');
    });
  });
});
