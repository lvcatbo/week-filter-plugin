import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import weekday from "dayjs/plugin/weekday";
import { bitable } from '@lark-base-open/js-sdk';

const lang = await bitable.bridge.getLanguage();
dayjs.locale(lang == 'zh' ? 'zh-cn' : 'en')
dayjs.extend(weekday);
export default dayjs;
