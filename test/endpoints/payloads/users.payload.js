export const validLogin = {
  email: 'britneyblankenship@quotezart.com',
  password: 'test1234',
};
export const invalidEmail = {
  email: 'invalid@quotezart.com',
  password: 'test1234',
};

// validation
export const invalidEmailValidation = {
  email: 'test.com',
  password: 'test1234',
};
export const missingEmailValidation = {
  password: 'test1234',
};

export const invalidPasswordValidation = {
  email: 'test@test.com',
  password: 'test',
};

export const missingPasswordValidation = {
  email: 'test@test.com',
};

export const emptyEmail = {
  email: '',
  password: 'test1234',
};

export const emptyPassword = {
  email: 'test@test.com',
  password: '',
};
