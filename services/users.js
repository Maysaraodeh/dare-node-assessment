import { findClientByFilter } from './clients';
export const findUserByEmail = (email) => {
  return findClientByFilter({ field: 'email', value: email });
};

export const compareUserPassword = (user, password) => {
  // we don't have any passwords assigned to the clients
  return true;
};
