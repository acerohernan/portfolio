import { defineAstroI18nConfig } from "astro-i18n"

export default defineAstroI18nConfig({
	primaryLocale: "en",
	secondaryLocales: ["es"],
	fallbackLocale: "en",
	trailingSlash: "never",
	run: "client+server",
	showPrimaryLocale: false,
})