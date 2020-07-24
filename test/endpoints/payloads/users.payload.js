export const validLoginAdmin = {
  username: 'admin',
  password: 'abcd1234',
};

export const validLoginUser = {
  username: 'user',
  password: 'abcd1234',
};

export const notExistedUser = {
  username: 'user1',
  password: 'abcd1234',
};

export const invalidUsername = {
  username: 'invalid@quotezart.com',
  password: 'abcd1234',
};

// validation
export const invalidUsernameValidation = {
  username: 'test.com',
  password: 'test1234',
};
export const missingUsernameValidation = {
  password: 'test1234',
};

export const invalidPasswordValidation = {
  username: 'user',
  password: 'test',
};

export const missingPasswordValidation = {
  username: 'user',
};

export const emptyUsername = {
  username: '',
  password: 'abcd1234',
};

export const emptyPassword = {
  username: 'user',
  password: '',
};

export const nockClients = [
  {
    id: '1',
    username: 'admin@quotezart.com',
    name: 'admin',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@quotezart.com',
    name: 'user',
    role: 'user',
  },
];
