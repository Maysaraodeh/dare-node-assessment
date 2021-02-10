import { findClientByFilter } from './clients';

export const findUserByName = (name) => findClientByFilter({ field: 'name', value: name });

export const findUserById = (id) => findClientByFilter({ field: 'id', value: id });

// we don't have any passwords assigned to the clients
export const compareUserPassword = (user, password) => password === 'abcd1234';
