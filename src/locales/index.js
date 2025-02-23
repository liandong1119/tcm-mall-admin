import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

export function setupI18n(app) {
  app.use(i18n)
}

export function setLanguage(lang) {
  i18n.global.locale.value = lang
  localStorage.setItem('language', lang)
}

export default i18n