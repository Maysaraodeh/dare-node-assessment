import { cache as clientRepository } from './cache';
import _ from 'lodash';
import { getDataFromAPI } from './httpRequest';

const findClient = (clients, { field, value }) => {
  return _.find(clients, (client) => {
    return client[field] === value;
  });
};

export const findClientByFilter = async (filter) => {
  let clients = [];
  if (clientRepository.has('clients'))
    clients = clientRepository.get('clients');
  else
    clients = await getDataFromAPI('clients', {
      cache: true,
      repository: clientRepository,
    });

  let client = findClient(clients, filter);
  if (!client) return {};
  client.policies = [];
  return client;
};

export const findAllClientsDetails = async ({
  limit = 10,
  page = 1,
  name,
} = {}) => {
  let clients = [];
  if (clientRepository.has('clients'))
    clients = clientRepository.get('clients');
  else
    clients = await getDataFromAPI('clients', {
      cache: true,
      repository: clientRepository,
    });

  if (name)
    return [findClient(clients, { field: 'name', value: name })].filter(
      Boolean
    );

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
