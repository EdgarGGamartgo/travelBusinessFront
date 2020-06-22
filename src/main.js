import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './plugins'
import Vuex from 'vuex';
import storePlugin from './storePlugin'
import i18n from './plugins/i18n';

Vue.use(storePlugin)
Vue.use(Vuex)
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  i18n,

  //store: store,
  render: h => h(App),
}).$mount('#app')
