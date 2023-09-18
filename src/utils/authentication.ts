export const AUTHENTICATION_TYPE = 'Bearer';
const regexpForRemoveAuthenticationType = new RegExp(`^${AUTHENTICATION_TYPE}\\s`);
export const getToken = (authentication: string): string =>
  authentication?.replace(regexpForRemoveAuthenticationType, '');
