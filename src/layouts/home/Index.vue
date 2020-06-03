<template>
  <v-app>
    <!-- <home-system-bar /> -->

    <home-app-bar />

    <home-view />

    <home-footer />

    <!-- <home-settings /> -->
  </v-app>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'HomeLayout',

    components: {
      HomeAppBar: () => import('@/layouts/home/AppBar'),
      HomeFooter: () => import('@/layouts/home/Footer'),
      HomeSettings: () => import('@/layouts/home/Settings'),
      HomeSystemBar: () => import('@/layouts/home/SystemBar'),
      HomeView: () => import('@/layouts/home/View'),
    },
    methods: {
      getLoggedUser() {
        axios.get(`http://vsapi.test/coupons/1`,
          {
          //  withCredentials: true,
            //  credentials: 'include',
            headers: {   // 'Authorization': 'Bearer '+ token,
            //  'Accept-Language': language.data,

            //  'X-CSRF-TOKEN' : 'DeIYYNUxIdYL1twXlEBXROG0gkjbmlfAUemxMYRI'
            //  'Content-Type' : 'application/json'

            }}
        )  // ${process.env.VUE_APP_HOSTVSAPI}/${process.env.VUE_APP_GETUSER}
          .then( response => {

            console.log("Get logged user from API: ",response)
            //this.getCredits(response.data.id)

          })
          .catch( error => {
            console.log("Get logged user error from API:",error)
          })
      },
    },
    created() {
    },
    mounted() {
     // this.getLoggedUser()
      console.log("Mounted")
    }
  }
</script>
