import development from './env/development';
import production from './env/production';
import testing from './env/testing';
let envConfig;

switch (process.env.NODE_ENV) {
  case 'production':
    envConfig = production;
    break;
  case 'testing':
    envConfig = testing;
    break;
  default:
    envConfig = development;
}

export default envConfig;
