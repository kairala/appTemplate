import en from "../../../i18n/en.json";

const locales = {
  en,
};

export const useGetI18nMessages = () => {
  const locale = "en";

  return {
    locale,
    messages: locales[locale],
  };
};
