<template>
  <v-app>
    <MenuBar></MenuBar>
    <v-main class="suave">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MenuBar from '../src/components/MenuBar';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
    MenuBar,
  },
  data: () => ({
    
  }),
  computed: {
   ...mapState(['users'])
  },
  methods: {
    checkUserSession() {
      const user = JSON.parse(localStorage.getItem('user'));
      //console.log('Mi payload recuperado localStorage: ', user);
      if (user && user.token) {
        this.users.user = user;
        this.users.isLogged = true;
      }
    }
  },
  created() {
    this.checkUserSession();
  }
};
</script>
<style></style>
