import en from '$lib/i18n/locales/en/home.json' assert { type: 'json' };
import ru from '$lib/i18n/locales/ru/home.json' assert { type: 'json' };

const DEFAULT_LOCALE = 'ru';

export const load = ({ cookies }) => {
  let locale = cookies.get('locale') || DEFAULT_LOCALE;

  if (!['en', 'ru'].includes(locale)) {
    locale = DEFAULT_LOCALE;
  }

  cookies.set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });

  return {
    locale,
    messages: {
      en,
      ru
    }
  };
};