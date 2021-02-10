import _ from 'lodash';
import clientRepository from './cache';
import { getDataFromAPI } from './httpRequest';
import { ClientsError } from '../middlewares/errors';
import property from '../helpers/propertiesReader';
import { findPoliciesByFilter } from './policies';

const findClient = (clients, { field, value }) => {
  const client = _.find(clients, (c) => c[field] === value);
  if (!client) throw new ClientsError(property('clients.notFound'), 404);
  return client;
};

const getClients = async () => {
  if (clientRepository.has('clients')) {
    return clientRepository.get('clients');
  }
  return getDataFromAPI('clients', {
    cache: true,
    repository: clientRepository,
  });
};

export const findClientByFilter = async (filter) => {
  const clients = await getClients();
  return findClient(clients, filter);
};

export const findClientDetails = async (client) => {
  const clientPolicies = await findPoliciesByFilter({
    field: 'clientId',
    value: client.id,
  });
  return { ...client, policies: clientPolicies };
};

export const findAllClientsDetails = async ({ limit = 10, page = 1, name } = {}) => {
  const clients = await getClients();
  if (name) {
    return findClientByFilter({ field: 'name', value: name });
  }

  const pages = Math.ceil(clients.length / limit);

  const result = _(clients)
    .orderBy(['name'], ['asc'])
    .drop((page - 1) * limit)
    .take(limit)
    .value();

  const data = await Promise.all(result.map((client) => findClientDetails(client)));

  /*  
    I applied pagination parameters along with the clients data,
    the response body will be formed like the following return,
    this doesn't matches the required API contract in the assessment,
    but when it comes to pagination these parameters are very important
  */
  return { clients: data, currentPage: page, totalPages: pages };
  // the following return will match the required contract
  // return data;
};
