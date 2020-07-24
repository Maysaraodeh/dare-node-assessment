import { findClientByFilter } from './clients';
export const findUserByName = (name) => {
  return findClientByFilter({ field: 'name', value: name });
};

export const findUserById = (id) => {
  return findClientByFilter({ field: 'id', value: id });
};

export const compareUserPassword = (user, password) => {
  // we don't have any passwords assigned to the clients
  return password === 'abcd1234';
};
