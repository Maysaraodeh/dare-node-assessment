import development from './env/development';
import production from './env/production';

let envConfig;

envConfig = process.env.NODE_ENV === 'production' ? production : development;

export default envConfig;
