import en from "../../../i18n/en.json";

const locales = {
  en,
};

export const useGetI18nMessages = () => {
  console.log("Requesting i18n messages...");
  const locale = "en";

  return {
    locale,
    messages: locales[locale],
  };
};
