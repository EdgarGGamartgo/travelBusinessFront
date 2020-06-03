import Vue from 'vue'
import VueMeta from 'vue-meta'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true,
})
