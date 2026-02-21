import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLabels from "./en/labels.json";
import enMoves from "./en/moves.json";
import frLabels from "./fr/labels.json";
import frMoves from "./fr/moves.json";

const storedLanguage = localStorage.getItem("dw-language");
const browserLanguage = navigator.language.toLowerCase().startsWith("fr")
  ? "fr"
  : "en";

const resources = {
  en: {
    translation: {
      ...enLabels,
      ...enMoves,
    },
  },
  fr: {
    translation: {
      ...frLabels,
      ...frMoves,
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage ?? browserLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  saveMissing: true,
  missingKeyHandler: (_languages, _namespace, key) => {
    console.warn(`[i18n] Missing translation key: ${key}`);
  },
});

export default i18n;
