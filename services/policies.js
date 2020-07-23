import { cache as policiesRepository } from './cache';
import _ from 'lodash';
import { getDataFromAPI } from './httpRequest';
import { PoliciesError } from '../middlewares/errors';
import { property } from '../helpers/propertiesReader';

const getPolicies = async () => {
  return policiesRepository.has('policies')
    ? policiesRepository.get('policies')
    : getDataFromAPI('policies', {
        cache: true,
        repository: policiesRepository,
      });
};

const filterPolicies = (policies, { field, value }) => {
  return _.filter(policies, (policy) => {
    return policy[field] === value;
  });
};

const findPolicyByFilter = (policies, { field, value }) => {
  const policy = _.find(policies, (policy) => {
    return policy[field] === value;
  });
  if (!policy) throw new PoliciesError(property('policies.notFound'), 404);
  return policy;
};

export const findPoliciesByFilter = async (filter) => {
  let policies = await getPolicies();
  return filterPolicies(policies, filter);
};

export const findAllPolicies = async ({ limit = 10 } = {}) => {
  let policies = await getPolicies();
  return _(policies).take(limit).value();
};

export const findPolicy = async (filter) => {
  let policies = await getPolicies();
  return findPolicyByFilter(policies, filter);
};
