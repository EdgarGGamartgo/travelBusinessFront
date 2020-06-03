import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    token: "",
    loggedUser: {
      email: "",
      id: "",
      name: ""
    },
  },
  getters: {
    getToken: state => {
      return state.token
    },
    getLoggedUser: state => {
      return state.loggedUser
    },
    },
  mutations: {
    increment (state) {
      state.count++
    },
    setToken: (state, payload) => {
      state.token = payload
      console.log("Payload: ", payload)
    },
    setLoggedUser: (state, payload) => {
      state.loggedUser.email = payload.email
      state.loggedUser.name = payload.name
      state.loggedUser.id = payload.id

      console.log("Payload: ", payload)
    },
  }
})
