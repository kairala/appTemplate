import { getRequestConfig } from "next-intl/server";
import en from "../../i18n/en.json";

const locales = {
  en,
};

export default getRequestConfig(async () => {
  const locale = "en";

  return {
    locale,
    messages: locales[locale],
  };
});
