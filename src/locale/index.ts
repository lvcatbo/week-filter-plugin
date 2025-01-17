import { createI18n } from 'vue-i18n'
import en from './en-US.ts'
import zh from './zh-CN.ts'
import { bitable } from '@lark-base-open/js-sdk'

export const i18n = createI18n({
  locale: 'en',
  allowComposition: true,
  messages: {
    en: en,
    zh: zh
  }
})

bitable.bridge.getLanguage().then((lang) => {
  i18n.global.locale = ['zh', 'zh-TW', 'zh-HK'].includes(lang) ? 'zh' : 'en'
})

export default i18n
