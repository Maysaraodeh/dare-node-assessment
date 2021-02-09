import _ from 'lodash';
import httpResponse from '../helpers/httpResponse';
import { userRolesEnums } from '../middlewares/enum/users';
import property from '../helpers/propertiesReader';
import { findPoliciesByFilter, findAllPolicies, findPolicy } from '../services/policies';

export const getPolicies = async (req, res) => {
  const { user, query } = req;
  let result = [];
  if (user.role === userRolesEnums[userRolesEnums.user]) {
    result = await findPoliciesByFilter({ filed: 'clientId', value: user.id });
  } else result = await findAllPolicies(query);
  if (_.isEmpty(result)) {
    return httpResponse.notFound(res, property('policies.notFound'));
  }
  return httpResponse.ok(res, result);
};

export const getPolicy = async (req, res) => {
  const {
    user,
    params: { id: policyId },
  } = req;
  const policy = await findPolicy({ field: 'id', value: policyId });
  if (user.role === userRolesEnums[userRolesEnums.admin]) {
    return httpResponse.ok(res, policy);
  }
  if (policy.clientId !== user.id) {
    return httpResponse.unAuthorized(res, property('clients.unAuthorized'));
  }
  return httpResponse.ok(res, policy);
};
