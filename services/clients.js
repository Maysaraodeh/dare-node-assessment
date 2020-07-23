import { cache as clientRepository } from './cache';
import _ from 'lodash';
import { getDataFromAPI } from './httpRequest';
import { ClientsError } from '../middlewares/errors/index';
import { property } from '../helpers/propertiesReader';

const findClient = (clients, { field, value }) => {
  const client = _.find(clients, (client) => {
    return client[field] === value;
  });
  if (!client) throw new ClientsError(property('clients.notFound'), 404);
  return client;
};

const getClients = async () => {
  return clientRepository.has('clients')
    ? clientRepository.get('clients')
    : getDataFromAPI('clients', {
        cache: true,
        repository: clientRepository,
      });
};

export const findClientByFilter = async (filter) => {
  let clients = await getClients();
  let client = findClient(clients, filter);
  client.policies = [];
  return client;
};

export const findAllClientsDetails = async ({
  limit = 10,
  page = 1,
  name,
} = {}) => {
  let clients = await getClients();
  if (name) return [findClient(clients, { field: 'name', value: name })];

  const pages = Math.ceil(clients.length / limit);

  const result = _(clients)
    .orderBy(['name'], ['asc'])
    .drop((page - 1) * limit)
    .take(limit)
    .value();

  //! for now
  result.map((r) => (r.policies = []));

  return { clients: result, currentPage: page, totalPages: pages };
};
