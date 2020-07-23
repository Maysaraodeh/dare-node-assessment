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
        .reply(200, [
          clientsArray.find(
            (c) => c.id === 'a0ece5db-cd14-4f21-812f-966633e7be86'
          ),
        ]);

      const result = await findClientByFilter({
        field: 'id',
        value: 'a0ece5db-cd14-4f21-812f-966633e7be86',
      });
      expect(result).to.deep.equal(
        clientsArray.find(
          (c) => c.id === 'a0ece5db-cd14-4f21-812f-966633e7be86'
        )
      );
    });

    it('should fail because of bad auth', async () => {
      cache.flushAll();
      nock(`${INSURANCE_API_BASE_URL}`, {
        ...invalidAuthorization,
      })
        .get('/clients')
        .reply(401, { message: 'Unauthorized' });

      await expect(
        findClientByFilter({
          field: 'id',
          value: 'a0ece5db-cd14-4f21-812f-966633e7be86',
        })
      ).to.be.rejectedWith('Unauthorized');
    });

    it('should return empty object if client not found', async () => {
      cache.flushAll();
      nock(`${INSURANCE_API_BASE_URL}`, {
        reqheaders: {
          ...validAuthorization,
        },
      })
        .get('/clients')
        .reply(200, [clientsArray[0]]);

      const result = await findClientByFilter({
        field: 'id',
        value: '',
      });
      await expect(result).to.be.empty;
    });
  });

  describe('FindClientByFilter with cache', () => {
    it('should return client object', async () => {
      cache.set('clients', clientsArray);
      const result = await findClientByFilter({
        field: 'id',
        value: 'a0ece5-4f21-812f-966633e7be86',
      });

      expect(result).to.deep.equal(
        clientsArray.find((c) => c.id === 'a0ece5-4f21-812f-966633e7be86')
      );
    });

    it('should return empty object if client not found in cache', async () => {
      cache.set('clients', clientsArray);
      const result = await findClientByFilter({
        field: 'id',
        value: '',
      });
      await expect(result).to.be.empty;
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
        .reply(401, { message: 'Unauthorized' });

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
      const result = await findAllClientsDetails({ name: 'Britney' });
      expect(result).to.be.an('array');
      expect(result.length).to.equal(1);
    });

    it('should return empty object if client not found', async () => {
      cache.flushAll();
      nock(`${INSURANCE_API_BASE_URL}`, {
        reqheaders: {
          ...validAuthorization,
        },
      })
        .get('/clients')
        .reply(200, [
          clientsArray.find(
            (c) => c.id === 'a0ece5db-cd14-4f21-812f-966633e7be86'
          ),
        ]);

      const result = await findAllClientsDetails({
        name: 'test',
      });
      await expect(result).to.be.empty;
    });
  });
});
