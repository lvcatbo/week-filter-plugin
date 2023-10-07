import { BaseClient } from '@base-open/node-sdk';

export default (appToken: string, personalBaseToken: string) => {
  return new BaseClient({
    appToken: appToken,
    personalBaseToken: personalBaseToken
  });
}

