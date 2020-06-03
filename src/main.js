import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './plugins'
import Vuex from 'vuex';
import storePlugin from './storePlugin'

Vue.use(storePlugin)
Vue.use(Vuex)
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  //store: store,
  render: h => h(App),
}).$mount('#app')
