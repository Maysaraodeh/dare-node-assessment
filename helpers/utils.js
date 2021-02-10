import moment from 'moment';

export const getExpirationTime = ({ expires = moment() }) =>
  moment(expires).utc().unix() - moment().utc().unix();

export const arrayToEnum = (arr) => {
  const obj = {};
  arr.forEach((value, index) => {
    obj[value] = index + 1;
    obj[index + 1] = value;
  });
  return obj;
};
