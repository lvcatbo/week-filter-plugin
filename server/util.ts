import { BaseClient } from '@base-open/node-sdk';

const APP_TOKEN = process.env['APP_TOKEN'] || ''
const PERSONAL_BASE_TOKEN = process.env['PERSONAL_BASE_TOKEN'] || ''

// 新建 BaseClient，填上需要操作的 Base 文档对应的 appToken 和 personalBaseToken
export const client = new BaseClient({
  appToken: APP_TOKEN,
  personalBaseToken: PERSONAL_BASE_TOKEN
});

export default client;

