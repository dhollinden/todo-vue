<template>
      <div>
        <router-link v-bind:to="{ name: 'Notes' }" class="">My Notes</router-link>&nbsp;&nbsp;
        <router-link v-bind:to="{ name: 'MyAccount' }" class="">My Account</router-link>&nbsp;&nbsp;
        <b-link @click="logout()">Logout</b-link>
      </div>
</template>

<script>

import AuthService from '@/services/AuthService'

export default {
  name: 'NavBar',
  methods: {
    async logout () {
      const response = await AuthService.logout()
      if (response.data.success) {
        this.$router.push({ name: 'Login' })
      } else {
        this.errors = response.data.err
      }
    }
  }
}
</script>
