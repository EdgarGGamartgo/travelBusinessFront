/**
 * Instancía que permite hacer el cambio de lenguaje
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '../language/en_USA'
import es from '../language/es_MX'
import fr from '../language/fr_FRA'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'es',
  fallbackLocale: 'en',
  messages: {
    en: {
      language: en
    },
    es: {
      language: es
    },
    fr: {
        language: fr
      }
  }
})