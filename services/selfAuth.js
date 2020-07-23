import config from '../config';
import { httpPostJson } from './httpRequest';
const {
  INSURANCE_API_CLIENT_ID,
  INSURANCE_API_CLIENT_SECRET,
  INSURANCE_API_BASE_URL,
} = config;

export const getAuthToken = async () => {
  const { success = {}, failure } = await httpPostJson(
    `${INSURANCE_API_BASE_URL}/login`,
    {
      client_id: INSURANCE_API_CLIENT_ID,
      client_secret: INSURANCE_API_CLIENT_SECRET,
    }
  );
  if (failure) throw new Error(failure.message || failure);
  if (!success.token || !success.type) throw new Error('no token found');
  return success;
};