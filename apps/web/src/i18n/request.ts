import { getRequestConfig } from "next-intl/server";
import en from "../../i18n/en.json";

const locales = {
  en,
};

export default getRequestConfig(async () => {
  console.log("Requesting i18n messages...");
  const locale = "en";

  return {
    locale,
    messages: locales[locale],
  };
});
