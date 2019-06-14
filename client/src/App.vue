<template>
  <v-app>
    <nav-bar></nav-bar>
    <v-content transition="slide-x-transition">
      <v-container fluid grid-list-lg>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from '@/components/NavBar'
export default {
  name: 'App',
  components: {
    NavBar
  },
  data () {
    return {
      //
    }
  }
}
</script>
