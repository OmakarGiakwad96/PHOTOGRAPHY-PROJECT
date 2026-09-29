import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import mr from './locales/mr/translation.json';
import gu from './locales/gu/translation.json';
import kn from './locales/kn/translation.json';
import te from './locales/te/translation.json';
import ta from './locales/ta/translation.json';
import bn from './locales/bn/translation.json';
import kok from './locales/kok/translation.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  gu: { translation: gu },
  kn: { translation: kn },
  te: { translation: te },
  ta: { translation: ta },
  bn: { translation: bn },
  kok: { translation: kok }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Force English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
