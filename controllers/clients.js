import _ from 'lodash';
import httpResponse from '../helpers/httpResponse';
import { userRolesEnums } from '../middlewares/enum/users';
import property from '../helpers/propertiesReader';
import { findPoliciesByFilter } from '../services/policies';
import { findAllClientsDetails, findClientDetails, findClientByFilter } from '../services/clients';

export const getClients = async (req, res) => {
  const { query, user } = req;
  let clients;
  if (user.role === userRolesEnums[userRolesEnums.user]) {
    const client = await findClientDetails(user);
    clients = [client];
  } else clients = await findAllClientsDetails(query);

  return httpResponse.ok(res, clients);
};

export const getClient = async (req, res) => {
  const {
    user,
    params: { id: clientId },
  } = req;
  let clientDetails;

  if (user.role === userRolesEnums[userRolesEnums.user] && user.id !== clientId) {
    return httpResponse.unAuthorized(res, property('user.unAuthorized'));
  }

  if (user.role === userRolesEnums[userRolesEnums.admin]) {
    const client = await findClientByFilter({ field: 'id', value: clientId });
    clientDetails = await findClientDetails(client);
  } else {
    clientDetails = await findClientDetails(user);
  }

  return httpResponse.ok(res, clientDetails);
};

export const getClientPolicies = async (req, res) => {
  const {
    user,
    params: { id: clientId },
  } = req;

  if (user.role === userRolesEnums[userRolesEnums.user] && user.id !== clientId) {
    return httpResponse.unAuthorized(res, property('user.unAuthorized'));
  }
  const policies = await findPoliciesByFilter({
    field: 'clientId',
    value: clientId,
  });

  if (_.isEmpty(policies)) {
    return httpResponse.notFound(res, property('policies.notFound'));
  }

  return httpResponse.ok(res, policies);
};
