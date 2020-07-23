import moment from 'moment';

export const getExpirationTime = ({ expires = moment() }) => {
  return moment(expires).utc().unix() - moment().utc().unix();
};
