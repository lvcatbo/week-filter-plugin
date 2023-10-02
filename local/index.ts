import en from "./en";
import zh from "./zh";


export const LOCALE_OPTIONS = [
    { label: "中文", value: "zh" },
    { label: "English", value: "en" },
];
let defaultLocale =  "zh";


export default defineI18nConfig(() => ({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: "en",
    allowComposition: true,
    messages: {
        "en": en,
        "zh": zh,
    },
}));
