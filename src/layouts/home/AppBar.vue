<template>
  <div>
 <v-dialog v-model="languageSelector" scrollable max-width="300px">
      <v-card>
        <v-card-title>{{$t('language.generals.lang')}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 200px;">
          <v-radio-group v-model="selectedLang" column>
            <v-radio label="Español" value="MXN"></v-radio>         
            <v-radio label="Français" value="EUR"></v-radio>
            <v-radio label="English" value="USD"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="languageSelector = false">Cerrar</v-btn>
          <v-btn color="blue darken-1"  text @click="currencyWS = selectedLang;languageSelector = false; setLocale(selectedLang)">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
 </v-dialog>
    <!--Starting Modal-->
        <v-dialog
        overlay-color="red"
      v-model="dialog2"
      :width="dynamicModalWidth"
      v-if="dialog2"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="red darken-4"
          dark
          v-on="on"
        >
          EXPLORAR
        </v-btn>
      </template>
      <v-card>
        <div style="float: right;">
        <v-tabs
          class="hidden-sm-and-down"
          optional
        >
          <v-tab
          v-if="modalBar"
            v-for="(name, i) in itemsModal"
            :key="i"
           
            :ripple="false"
            active-class="text--primary"
            class="font-weight-bold"
            min-width="96"
            text
            @click="goFront(name)"
          ><!-- :exact="name === 'Home'" -->
            <!-- :to="{ name }" -->
           {{ name }} 
            <!-- TEST -->
          </v-tab>
        </v-tabs>
      </div><br><br>
        <v-card-title v-if="avaiContent || logHeaders">
          <span class="headline">{{modalTitle}}</span>
        </v-card-title>
 <v-content>
    <v-container v-if="paymentContent"
        class="fill-height"
        fluid
      >paymentContent</v-container>
    <v-container v-if="cardsContent"      >
    <v-carousel 
    interval="10000"
    cycle
    hide-delimiters
    v-model="model">
      <v-carousel-item
        v-for="(hotel, i) in availibilityResponse"
        :key="hotel"
      >
     <v-card
     light
    class="mx-auto"
    max-width="800"
  >
    <v-img
      class="white--text align-end"
      height="200px"
      src="./../../assets/acapulcoEstrella.jpg"
    >
      <v-card-title><strong v-if="hotel.hotelName == value">HOTEL PREFERIDO: </strong>  {{ hotel.hotelName }}</v-card-title>
    </v-img>
              <v-card-subtitle class="pb-0">Costo total por {{ selectedRooms }} {{ selectedRooms == 1 ? "habitación" : "habitaciones" }}: $ {{ globalFunctions.numberFormat(Math.round(hotel.totalCost), 2, '.', ',') }} {{ hotel.currency }}</v-card-subtitle>

    <v-card-text class="text--primary">
      <div>{{ hotel.arrivalDate }} - {{ hotel.departureDate }}</div>

      <div>Total de noches: {{ hotel.totalNights }}</div>
      <div>Máximo de adultos por habitación: {{ hotel.maxAdults }}. Máximo de niños por habitación: {{ hotel.maxKids }}.</div>
      <div>Máximo de habitaciónes disponibles: {{ hotel.maxRooms }}.</div>
      <div><strong>Reserva al 55 55 55 55 55 o con PayPal en la sección de abajo.</strong></div>
    </v-card-text>


<!---->
<v-col cols="12">
        <v-row justify="center">
          <v-col

            cols="6"
            md="6"
          >
      <div><strong>Reservar con costo total: $ {{ globalFunctions.numberFormat(Math.round(hotel.totalCost), 2, '.', ',') }} {{ hotel.currency }}</strong></div>
   <!-- locale="en_US" 
   1) Implement Paypal IPN notifications on my paypal front implementation
   2) Meanwhile implementing an emailSender WS is enough
   -->
       <PayPal
        @payment-cancelled="paypalAction"
        @payment-authorized="payment_authorized_cb" 
        @payment-completed="payment_completed_cb" 
        :amount="Math.round(hotel.totalCost)"
        :currency="hotel.currency"
        :client="credentials"
        env="production">
      </PayPal>
          </v-col>

          <v-col
            cols="6"
            md="6"
          >
      <div
                 v-if="totalCredits < hotel.totalCost"
      ><strong>Descontar mis $ {{ globalFunctions.numberFormat(Math.round(totalCredits), 2, '.', ',') }} {{ hotel.currency }} de créditos</strong></div>
        <PayPal
        @payment-cancelled="paypalAction"
        @payment-authorized="payment_authorized_cb" 
        @payment-completed="payment_completed_cb" 
        v-if="totalCredits < hotel.totalCost"
        :amount="Math.round(hotel.totalCost - totalCredits)"
        :currency="hotel.currency"
        :client="credentials"
        env="production">
      </PayPal>
          </v-col>
        </v-row>
      </v-col>
<!---->
 
   
  </v-card>
      </v-carousel-item>
    </v-carousel>
      </v-container>
   <v-container v-if="historyContent"
        class="fill-height"
        fluid
      >
      <v-row
      align="center"
          justify="center">
                <v-data-table
       
    :headers="headers"
    :items="desserts"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
      </v-row>
      </v-container>
      <v-container v-if="creditsContent"
        class="fill-height"
        fluid
      > <v-row
      align="center"
          justify="center">
          Total de créditos : $ {{ globalFunctions.numberFormat(totalCredits, 2, '.', ',') }} {{ currencyWS }}
                <v-data-table
    :headers="headersCredits"
    :items="creditsItems"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
      </v-row></v-container>
      <v-container v-if="avaiContent"
        class="fill-height"
        fluid
      >
        <v-row
          v-if="logInContent"
          align="center"
          justify="center"
        ><v-col class="text-center">
          <v-text-field v-if="signUpContent" label="Nombre" v-model="userName"></v-text-field>
          <v-text-field  label="E-mail" v-model="emailLogIn" :rules="rulesEmail"></v-text-field>
          <v-text-field  label="Password" v-model="passwordLogIn"></v-text-field>
          <v-text-field v-if="signUpContent" label="Confirme password" v-model="confirmPassword"></v-text-field>
          <v-progress-circular
            v-if="enableLoader"
            :size="70"
            :width="7"
            color="red"
            indeterminate
          ></v-progress-circular>
        </v-col></v-row>
        <v-row
          v-if="!logInContent"
          align="center"
          justify="center"
        >
          <v-col class="text-center">
          <!-- FORM -->
  <!-- <v-text-field label="Hotel" :rules="rules" hide-details="auto"></v-text-field> -->
    <v-autocomplete
            v-model="destiny"
            :items="itemsDestiny"
            dense
            filled
            label="Destino"
          ></v-autocomplete>
    <v-autocomplete
            v-model="value"
            :items="items"
            dense
            filled
            label="Hotel"
          ></v-autocomplete>
          <v-autocomplete
            v-model="extraServices"
            :items="extraServicesAvailable"
            dense
            chips
            small-chips
            label="Servicios extras disponibles"
            multiple
            solo
          ></v-autocomplete>
          <!-- Datepickers -->
         <v-row>
       <v-col cols="12" lg="6">
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="computedDateFormatted"
              label="Check-in"
              hint="Formato MM/DD/YYYY "
              persistent-hint

              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" lg="6">
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="computedDateFormatted2"
              label="Check-out"
              hint="Formato MM/DD/YYYY"
              persistent-hint
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date2" no-title @input="menu2 = false"></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>

    <!-- Guests -->
<v-row>
      <v-col cols="4" lg="4">
     <v-autocomplete
            v-model="selectedAdults"
            :items="adultsQuantity"
            dense
            filled
            label="Adultos"
          ></v-autocomplete>
      </v-col>

      <v-col cols="4" lg="4">
       <v-autocomplete
            v-model="selectedKids"
            :items="kidsQuantity"
            dense
            filled
            label="Niños"
          ></v-autocomplete>
      </v-col>

        <v-col cols="4" lg="4">
       <v-autocomplete
            v-model="selectedRooms"
            :items="roomsQuantity"
            dense
            filled
            label="Habitaciones"
          ></v-autocomplete>
      </v-col>
      <v-row
       align="center"
          justify="center">
         <v-progress-circular 
            v-if="enableLoader"
            :size="70"
            :width="7"
            color="red"
            indeterminate
          ></v-progress-circular>
          </v-row>
    </v-row>
      <!-- <v-btn block color="red darken-4" dark @click="searchAvailability">Buscar disponibilidad</v-btn> -->

          <!-- FORM -->
          </v-col>
        </v-row>

            <v-row
          align="center"
          justify="center"
        >
          <v-col class="text-center">
          <!-- FORM -->

          <!-- FORM -->
          </v-col>
        </v-row>
      </v-container>
    </v-content>
         <v-card-actions>
          <v-spacer />
          <v-btn 
          v-if="avaiContent"
            color="green darken-1"
            text
            @click="dialog2 = false"
          >
            Cerrar 
          </v-btn>
          <v-btn
           v-if="avaiContent"
            color="green darken-1"
            text
            @click="hitService()"
          >
            {{modalButtonOk}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Ending Modal-->
    <v-app-bar
      id="home-app-bar"
      app
      color="white"
      elevation="1"
      height="80"
    >
      <!-- <base-img
        :src="require('@/assets/logo.svg')"
        class="mr-3 hidden-xs-only"
        contain
        max-width="52"
        width="100%"
      />

      <base-img
        :src="require('@/assets/zero-logo-light.svg')"
        contain
        max-width="128"
        width="100%"
      /> -->
      <v-spacer />

      <div>
        <v-tabs
          class="hidden-sm-and-down"
          optional
        >
          <v-tab
            v-for="(name, i) in itemsBar"
            :key="i"
            :exact="name === 'Home'"
            :ripple="false"
            active-class="text--primary"
            class="font-weight-bold"
            min-width="96"
            text
            @click="goFront(name)"
          >
            <!-- :to="{ name }" -->
           {{ name }} 
            <!-- TEST -->
          </v-tab>
        </v-tabs>
      </div>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = !drawer"
      />
    </v-app-bar>
    <home-drawer
      v-model="drawer"
      :items="items"
    />
  </div>
</template>

<script>
  import  axios from 'axios';
  import SecureLS from "secure-ls";
  import i18n from "./../../plugins/i18n";
  import * as GlobalFunctions from './../../utils/GlobalFunctions';
  import PayPal from 'vue-paypal-checkout'
  export default {
    name: 'HomeAppBar',

    components: {
       PayPal,
      HomeDrawer: () => import('./Drawer'),
    },

    data: (vm) => ({
      globalFunctions: GlobalFunctions,
      zones: [],
      totalCredits: 0,
      headersCredits: [
          {
            text: 'Tipo de crédito',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Importe', value: 'calories' },
          { text: 'Generado', value: 'fat' },
          // { text: 'Destino', value: 'carbs' },
          // { text: 'Costo total', value: 'protein' },
          // { text: 'Créditos', value: 'iron' },
        ],
      creditsItems:[
       
        ],
        headers: [
          {
            text: 'Estancia',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Llegada', value: 'calories' },
          { text: 'Salida', value: 'fat' },
      //    { text: 'Destino', value: 'carbs' },
          { text: 'Costo total', value: 'protein' },
          { text: 'Noches', value: 'iron' },
        ],
        desserts: [
      
        ],
      credentials: {
        sandbox: process.env.VUE_APP_PAYPALP,
        production: process.env.VUE_APP_PAYPALP
      },
      availibilityResponse: [],
      logHeaders: false,
      modalBar: false,
        model: 0,
        colors: [
          'indigo',
          'warning',
          'pink darken-2',
          'red lighten-1',
          'deep-purple accent-4',
        ],
        slides: [
          'First',
          'Second',
          'Third',
          'Fourth',
          'Fifth',
        ],
      paymentContent: false,
      cardsContent: false,
       avaiContent: false,
       creditsContent: false,
       historyContent: false,
      currencyWS: "",
      selectedLang: "",
      languageSelector: false,
      enableLoader: false,
      ls: new SecureLS({ encodingType: "aes" }),
      userName: "",
      signUpContent: false,
      confirmPassword: "",
      emailLogIn: "",
      passwordLogIn: "",
      dynamicModalWidth: "1600px",
      rulesEmail: [
        value => !!value || 'Required.',
        value => (value || '').length <= 50 || 'Max 20 characters',
        value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      ],
      modalButtonOk: "",
      modalTitle: "",
      logInContent: true,
       menu: false,
      modal: false,
         roomsQuantity: [1,2,3,4,5],
        selectedRooms: 1,
        kidsQuantity:[1,2],
        selectedKids: 1,
            selectedAdults: 1,
          adultsQuantity: [1,2,3,4,5],
        date: new Date().toISOString().substr(0, 10),
         date2: new Date().toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      menu2: false,
          extraServicesAvailable: ['Renta de auto', 'Vuelo de avión'],
      extraServices: null,
      items: [],
      value: null,
      drawer: null,
      dialog2: false,
      itemsDestiny: [],
      destiny: null,
      itemsModal: [
        'Disponibilidad',
        'Historial',
        'Créditos'
      ],
      itemsBar: [
        'Home',
        'Quienes somos?',
        'Contactos',
        'Log In',
        'Sign Up',
        i18n.t('language.generals.lang'),

      ],
    }),
    computed: {
    computedDateFormatted () {
            return this.formatDate(this.date)
          },
            computedDateFormatted2 () {
            return this.formatDate(this.date2)
          },
    },
    created() {
      console.log("Token from store: ", this.$myStore.getters.getToken)
      this.validSession()
      this.getCredits()
      },
      watch: {
          destiny() {
                for(var i = 0; i < this.zones.length; i++) {
                  if(this.destiny == this.zones[i].nombre) {
                    this.getHotels(this.zones[i].id)
                  }
                }
          }
      },
    methods: {
      payment_authorized_cb(res){
          console.log("payment_authorized_cb: ", res)
      },
      payment_completed_cb(res){
          console.log("payment_completed_cb: ", res)
      },
      paypalAction(res){
          console.log("paypalAction: ", res)
          
         axios.get(`${process.env.VUE_APP_HOSTVSAPI}/${process.env.VUE_APP_SENDPAYCONFIRMAIL}`,  {
          headers: {
            "s-m": JSON.stringify({
              msg: "Successful PayPal payment confirmation!", 
              ecran: "mail"
              }),
            'Authorization' : `Bearer ${this.ls.get('token')}`,
          }
        })
          .then( response => {
            console.log("ConfirmationPaymentMail Response: ",response)

          })
          .catch( error => {
            console.log("ConfirmationPaymentMail Error: ",error)
          })
      },
      discountPrice(){

      },
      getCredits() {

         axios.get(`${process.env.VUE_APP_HOSTVSAPI}/${process.env.VUE_APP_GETCREDITS}`,  {
          headers: {
            "g-c": JSON.stringify({
              userId: this.ls.get('userId'), 
              currency: this.currencyWS == "" ? "MXN" : this.currencyWS
              }),
            'Authorization' : `Bearer ${this.ls.get('token')}`,
          }
        })
          .then( response => {
            console.log("GetCredits Response: ",response)
            this.creditsItems = []
            this.totalCredits = 0
            for(var i = 0; i < response.data.data.length; i++) {
              this.creditsItems.push({
                name: response.data.data[i].creditType.TipoCredito,
                calories: `$ ${this.globalFunctions.numberFormat(Math.round(response.data.data[i].amount), 2, '.', ',')} ${response.data.data[i].currency}`,
                fat: response.data.data[i].creditType.created_at,
              })
              console.log("CRedits amount: ", this.globalFunctions.numberFormat(response.data.data[i].amount))
              this.totalCredits += Number(Math.round(response.data.data[i].amount))
            }

          })
          .catch( error => {
            console.log("GetCredits Error: ",error)
          })
      },
      getTravelHistory() {
       axios.get(`${process.env.VUE_APP_HOSTVSAPI}/${process.env.VUE_APP_GETHISTORY}`,  {
          headers: {
            "g-t-h": JSON.stringify({
              userId: this.ls.get('userId'),
              currency: this.currencyWS == "" ? "MXN" : this.currencyWS
              }),
            'Authorization' : `Bearer ${this.ls.get('token')}`,
          }
        })
          .then( response => {
            console.log("GetTravelHistory Response: ",response)
           this.desserts = []
           for(var i = 0; i < response.data.data.length; i++) {
             this.desserts.push({
               name: response.data.data[i].hotel,
               calories: response.data.data[i].checkIn,
               fat: response.data.data[i].checkOut,
               protein: `$ ${this.globalFunctions.numberFormat(Math.round(response.data.data[i].totalCOst), 2, '.', ',')} ${response.data.data[i].currency}`,
               iron: response.data.data[i].totalNights,
             })
           }
          })
          .catch( error => {
            console.log("GetTravelHistory Error: ",error)
          })
      },
      getHotels(destinyId) {
        let request = {
          destino: destinyId
        }
       axios.get(`${process.env.VUE_APP_HOSTVSAPI}/${process.env.VUE_APP_GETHOTELS}`,  {
          headers: {
            "g-h": JSON.stringify(request),
            'Authorization' : `Bearer ${this.ls.get('token')}`,
            // 'Accept-Language' : this.language.data
          }
        })
          .then( response => {
            console.log("GetHotels Response: ",response)
            this.apiHotels = response.data.data
            this.items = []
            for(var i = 0; i < this.apiHotels.length; i++){
              this.items.push(this.apiHotels[i].nombreEspacio)
            }
          })
          .catch( error => {
            console.log("GetHotels Error: ",error)
          })
      },
      getZones(){
          axios.get(`${process.env.VUE_APP_HOSTVSAPI}${process.env.VUE_APP_GETZONES}`,  {
          headers: {
          //  "s-a": JSON.stringify(request),
            'Authorization' : `Bearer ${this.ls.get('token')}`,
            // 'Accept-Language' : this.language.data
          }
        })
          .then( response => {
            console.log("GetZones Response: ",response)
            this.zones = response.data.data
            this.itemsDestiny = []
            for(var i = 0; i < this.zones.length; i++){
              this.itemsDestiny.push(this.zones[i].nombre)
            }
          })
          .catch( error => {
            console.log("GetZones Error: ",error)
          })
      },
    
    setLocale(locale) {
      
      console.log("Whats is LOCALE: ", locale)
    if (locale == undefined) {
      locale = 'es'
    } else if(locale == "MXN") {
      locale = 'es'
    } else if(locale == "USD") {
      locale = 'en'
    } else if(locale == "EUR") {
      locale = 'fr'
    }
      console.log("Whats is LOCALE II: ", locale)

    this.$i18n.locale = locale;
       let newItems = this.itemsBar.map((item) => {
              if(item == 'Language' || item == 'Langage' || item == 'Lenguaje') {
                item = i18n.t('language.generals.lang')
                return item
              } else {
                return item
              }
            })
             
            console.log("newItems: ", newItems)
            this.itemsBar = newItems
    this.ls.set("Language", { data: locale });

      },
      language() {
          this.languageSelector = true
      },
      callSearchAvailabilityWS2() {
        console.log("Un Moment")
      },
      adjustHeader() {
        for(var i = 0; i < this.itemsBar.length; i++) {
          if(this.itemsBar[i].toUpperCase() == "SIGN UP") {
            this.itemsBar.splice(i, 1);
          }
        }
        this.getUserHeaders()
      },
      validSession() {
        axios.post(`${process.env.VUE_APP_HOSTVSAPI}/${process.env.VUE_APP_VALIDSESSION}`,{},
          {
            //  withCredentials: true,
            //  credentials: 'include',
            headers: {   // 'Authorization': 'Bearer '+ token,
              'Accept' : 'application/json',
              'Authorization' : `Bearer ${this.ls.get('token')}`,
              //  'X-CSRF-TOKEN' : 'DeIYYNUxIdYL1twXlEBXROG0gkjbmlfAUemxMYRI'
              //  'Content-Type' : 'application/json'

            }}
        )
          .then( response => {
            if(response.status == 200) {
              this.adjustHeader()
            }
            console.log("Successful Validation Session from API: ",response)
            this.dialog2 = false
          })
          .catch( error => {
            console.log("Unsuccessful Validation Session from API:",error)
            this.dialog2 = false
          })
      },
      signUp() {
        let querystring = require('querystring');
        axios.post(`${process.env.VUE_APP_HOSTVSAPI}/${process.env.VUE_APP_SIGNUP}`,
          querystring.stringify({
            email: this.emailLogIn,
            password: this.passwordLogIn,
            c_password: this.confirmPassword,
            name: this.userName
          }),
          {
            //  withCredentials: true,
            //  credentials: 'include',
            headers: {   // 'Authorization': 'Bearer '+ token,
              //'Accept' : 'application/json',
              //'Authorization' : `Bearer ${this.$myStore.getters.getToken}`,
              //  'X-CSRF-TOKEN' : 'DeIYYNUxIdYL1twXlEBXROG0gkjbmlfAUemxMYRI'
              //  'Content-Type' : 'application/json'

            }}
        )
          .then( response => {
            if(response.status == 200) {
             /* this.$myStore.commit('setToken', "")
              this.$myStore.commit('setLoggedUser', {email:"",name:"",id:""})
              this.itemsBar = [
                'Home',
                'Log In',
                'Mis viajes',
                'Sign Up'
              ]*/
            }
            this.enableLoader = false
            console.log("Successful Sign Up from API: ",response)
            this.dialog2 = false
          })
          .catch( error => {
            this.enableLoader = false
            console.log("Unsuccessful Sign Up from API:",error)
            this.dialog2 = false
          })
      },
      logOut() {
          axios.post(`${process.env.VUE_APP_HOSTVSAPI}/${process.env.VUE_APP_LOGOUT}`,{},
            {
              //  withCredentials: true,
              //  credentials: 'include',
              headers: {   // 'Authorization': 'Bearer '+ token,
                  'Accept' : 'application/json',
                  'Authorization' : `Bearer ${this.ls.get('token')}`,
                //  'X-CSRF-TOKEN' : 'DeIYYNUxIdYL1twXlEBXROG0gkjbmlfAUemxMYRI'
                //  'Content-Type' : 'application/json'

              }}
          )
            .then( response => {
              if(response.status == 200) {
                this.$myStore.commit('setLoggedUser', {email:"",name:"",id:""})
                this.itemsBar = [
                  'Home',
                  'Quienes somos?',
                  'Contactos',
                  'Log In',
                  'Sign Up',
                  i18n.t('language.generals.lang')
                ]
              }
              console.log("Successful Log out from API: ",response)
              this.dialog2 = false
            })
            .catch( error => {
              console.log("Unsuccessful Log out from API:",error)
              this.dialog2 = false
            })
      },
      getUserHeaders() {
        console.log("My current token is : ", this.$myStore.getters.getToken)
        console.log("Logged User is : ", this.$myStore.getters.getLoggedUser)
        this.itemsBar.unshift(`Welcome ${this.ls.get('userName')}`)
        function arrayMove(arr, fromIndex, toIndex) {
          let element = arr[fromIndex];
          arr.splice(fromIndex, 1);
          arr.splice(toIndex, 0, element);
        }
        for(var i = 0; i < this.itemsBar.length; i++) {
          if(this.itemsBar[i] == "Log In") {
            this.itemsBar[i] = "LOG OUT"
            arrayMove(this.itemsBar, i, this.itemsBar.length - 1)
          }
        }
        this.itemsBar.push('Mis viajes')
        arrayMove(this.itemsBar, this.itemsBar.length - 1, 2)
      },
      callSearchAvailabilityWS(){
            this.enableLoader = true
        let extraServices = ""
        if(this.extraServices == null) {
          extraServices = "Ninguno"
        } else {
          extraServices = this.extraServices.join(", ");
        }
        if(this.destiny == "Acapulco") {
          this.destiny = 1
        }
        const request = {
          destino: this.destiny,
          hotel: this.value,
          extraServices: extraServices,
          checkIn: this.date,
          checkOut: this.date2,
          adults: this.selectedAdults,
          kids: this.selectedKids,
          rooms: this.selectedRooms,
          currency: this.currencyWS == "" ? "MXN" : this.currencyWS

        }//
        console.log("searchAvailibility Request: ", request)
        axios.get(`${process.env.VUE_APP_HOSTVSAPI}/${process.env.VUE_APP_SEARCHAVAILABILITY}`,  {
          //withCredentials: true,
          //credentials: 'include',
          headers: {//'Authorization': 'Bearer ' + this.token,
          //  'Content-Type' : 'application/json',
        //    'Accept' : 'application/json',
            "s-a": JSON.stringify(request),
            'Authorization' : `Bearer ${this.ls.get('token')}`,
            // 'Accept-Language' : this.language.data
          }
        })
          .then( response => {
            console.log("searchAvailibility Response: ",response)
            this.enableLoader = false
           // this.dialog2 = false
            this.avaiContent = false
            this.cardsContent = true
            this.availibilityResponse = response.data.data
          })
          .catch( error => {
            console.log("searchAvailibility Error: ",error)
            this.enableLoader = false
         //   this.dialog2 = false
          })
      },
      callLogInWS() {
        let querystring = require('querystring');
        //axios.post('http://something.com/', querystrinFg.stringify({ foo: 'bar' }));
        axios.post(`${process.env.VUE_APP_HOSTVSAPI}/${process.env.VUE_APP_LOGIN}`,
          querystring.stringify({ email: this.emailLogIn, password: this.passwordLogIn }),
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
            if(response.status == 200) {
                this.$myStore.commit('setToken', response.data.success.token)
                this.$myStore.commit('setLoggedUser', response.data.userData)
                this.ls.set('token', response.data.success.token)
                this.ls.set('userName', response.data.userData.name)
                this.ls.set('userId', response.data.userData.id)
                this.adjustHeader()
            }
            this.enableLoader = false
            console.log("Successful Logging from API: ",response)
            this.dialog2 = false
          })
          .catch( error => {
            this.enableLoader = false
            console.log("Unsuccessful Logging from API:",error)
            this.dialog2 = false
          })
      },
      hitService() {
        switch (this.modalButtonOk) {
            case "OK":
              this.enableLoader = true
              this.callLogInWS()
              break;
            case "ACCEPTAR":
              this.enableLoader = true
              this.signUp()
              break;
            case "BUSCAR":
              this.enableLoader = true
              console.log("Un Moment Premiere")
              this.callSearchAvailabilityWS()
              break;
            default:
              this.dialog2 = false
              break;
        }
      },
        formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
              date (val) {
        this.dateFormatted = this.formatDate(this.date)
      },
      goFront (name) {
        switch(name){
          case "Sign Up":
            this.modalBar = false
            console.log("Which modal should I open? ", name)
            this.modalTitle = "SIGN UP"
            this.modalButtonOk = "ACCEPTAR"
            this.logInContent = true
            this.dialog2 = true
            this.signUpContent = true
            break;
          case "Home":
            console.log("Which modal should I open? ", name)
            break;
          case "LOG OUT":
            console.log("Which modal should I open? ", name)
            this.logOut()
            break;
          case 'Language': case 'Langage': case 'Lenguaje':
            console.log("Which modal should I open? ", name)
         
            this.language()
            break;
          case "Log In":
            this.logHeaders = true
            this.modalBar = false
            console.log("Which modal should I open? ", name)
            this.dynamicModalWidth = "800px"
            this.logInContent = true
            this.signUpContent = false
            this.modalTitle = "Log In"
            this.modalButtonOk = "OK"
            this.dialog2 = true
                      this.avaiContent = true
            this.historyContent = false
            this.cardsContent = false
            this.paymentContent = false
            this.creditsContent = false
            break;
          case "Mis viajes":
            this.logHeaders = false
            this.modalBar = true
            this.avaiContent = true
            this.historyContent = false
            this.cardsContent = false
            this.paymentContent = false
            this.creditsContent = false
            this.dynamicModalWidth = "1600px"
            this.logInContent = false
            this.modalTitle = "Buscar disponibilidad"
            this.modalButtonOk = "BUSCAR"
            this.dialog2 = true
            this.getZones()
            console.log("Which modal should I open? ", name)
            break;
            case "Disponibilidad":
            this.dynamicModalWidth = "1600px"
            this.logHeaders = false
            this.modalBar = true
            this.historyContent = false
            this.avaiContent = true
            this.creditsContent = false
            this.cardsContent = false
            this.paymentContent = false
            console.log("Which modal should I open? ", name)
              break;
            case "Historial":
              this.getTravelHistory()
              this.logHeaders = false
            this.modalBar = true
            this.historyContent = true
            this.dynamicModalWidth = "600px"
            this.avaiContent = false
            this.creditsContent = false
            this.cardsContent = false
            this.paymentContent = false
            console.log("Which modal should I open? ", name)
            break;
            case "Créditos":
              this.getCredits()
            this.dynamicModalWidth = "600px"
              this.logHeaders = false
            this.modalBar = true
              this.avaiContent = false
            this.historyContent = false
            this.cardsContent = false
            this.paymentContent = false
            this.creditsContent = true
            console.log("Which modal should I open? ", name)
            break;
          default:
            break;
        }
      },
    },
  }
</script>

<style lang="sass">
  .v-progress-circular
    margin: 1rem

    #home-app-bar
    .v-tabs-slider
      max-width: 24px
      margin: 0 auto

    .v-tab
      &::before
        display: none
</style>
