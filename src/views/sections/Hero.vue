<template>
  <section id="hero">
    <v-carousel
      interval="3000"
      cycle
    >
      <v-carousel-item
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
        reverse-transition="fade-transition"
        transition="fade-transition"
      />
    </v-carousel>
  <!-- <v-carousel
  interval= "3000"
    cycle
    height="400"
    hide-delimiter-background
    show-arrows-on-hover
  >
    <v-carousel-item
      v-for="(slide, i) in slides"
      :key="i"
    >
      <v-sheet
        :color="colors[i]"
        height="100%"
      >
        <v-row
          class="fill-height"
          align="center"
          justify="center"
        >
          <div class="display-3">{{ slide }} Slide</div>
        </v-row>
      </v-sheet>
    </v-carousel-item>
  </v-carousel> -->
  </section>
  <!-- <section id="hero">
    <v-img
      :min-height="minHeight"
      :src="require('@/assets/home-hero.jpg')"
      class="white--text"
      gradient="to right, rgba(5, 11, 31, .8), rgba(5, 11, 31, .8)"
    >
      <v-container class="fill-height px-4 py-12">
        <v-responsive
          class="d-flex align-center"
          height="100%"
          max-width="700"
          width="100%"
        >
          <base-heading title="PROMOTE YOUR BUSINESS WITH ZERO" />

          <base-body>
            Infographic hypotheses influencer user experience Long madel ture gen-z paradigm shift client partner network product seilans solve management influencer analytics leverage virality.
            incubator seed round massmarket.
            buyer agile development growth hacking business-to-consumer ecosystem
          </base-body>

          <div
            :class="$vuetify.breakpoint.smAndDown ? 'flex-column align-start' : 'align-center'"
            class="d-flex flex-wrap"
          >
            <base-btn>
              Discover More
            </base-btn>

            <span class="font-weight-bold ml-6 mr-4 my-4">or</span>

            <base-btn
              :ripple="false"
              class="pa-1"
              height="auto"
              text
            >
              Get Started Now
            </base-btn>
          </div>
        </v-responsive>
      </v-container>
    </v-img>
  </section> -->
</template>

<script>
  import image from './../../assets/beach1.jpg'
  import image2 from './../../assets/beach2.jpg'
  import image3 from './../../assets/beach3.jpg'
  import image4 from './../../assets/beach4.jpg'
  import image5 from './../../assets/beach5.jpg'

  export default {
    name: 'SectionHero',

    provide: {
      theme: { isDark: true },
    },

    data: (vm) => {
      return {
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
        items: [
          {
            src: image,
          },
          {
            src: image2,
          },
          {
            src: image3,
          },
          {
            src: image4,
          },
          {
            src: image5,
          },
        ],
      }
    },

    computed: {
      minHeight () {
        const height = this.$vuetify.breakpoint.mdAndUp ? '100vh' : '50vh'

        return `calc(${height} - ${this.$vuetify.application.top}px)`
      },
    },
  }
</script>
