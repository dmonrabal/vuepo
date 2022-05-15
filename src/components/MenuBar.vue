<template>
  <v-card v-if="users.isLogged">
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      
      <v-btn  plain v-if="!users.isLogged" :to="{name: 'Login'}">
        <span class="mr-2" >Sign in</span>
        <v-icon
            <i class="fas fa-sign-in-alt"></i>
        </v-icon>
      </v-btn>
      <v-btn plain @click="closeSession" v-if="users.isLogged">
        <span class="mr-2" >Sign out</span>
        <v-icon
            <i class="fas fa-sign-out-alt"></i>
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanen
      app
    >
      <v-list-item class="px-2" v-if="users.isLogged">
        <v-list-item-avatar>
          <v-img :src="users.user.photo"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>{{users.user.name}}</v-list-item-title>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
      <v-divider class="mt-2" v-if="users.isLogged"></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to.name">
          <v-list-item-icon>
            <v-icon >{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider class="mt-2"></v-divider>
       <v-list dense>
        <v-list-item v-for="item in structure" :key="item.title" :to="item.to.name">
          <v-list-item-icon>
            <v-icon >{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
      <v-divider class="mt-2"></v-divider>
       <v-list dense>
        <v-list-item v-for="item in data" :key="item.title" :to="item.to.name">
          <v-list-item-icon>
            <v-icon >{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>


       <v-divider class="mt-2"></v-divider>
       <v-list dense>
        <v-list-item v-for="item in admin" :key="item.title" :to="item.to.name">
          <v-list-item-icon>
            <v-icon >{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      
       <v-divider class="mt-2"></v-divider>
       <v-list dense>
        <v-list-item :key="grid.title" :to="grid.to.name">
          <v-list-item-icon>
            <v-icon >{{ grid.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="grid.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      user: '',
      photo: '',
      drawer: true,
      items: [
        { title: 'Inicio', icon: 'fas fa-home', to: {name:'/'} },
        { title: 'Dashboard', icon: 'fas fa-tachometer-alt', to: {name:'/dashboard'} },
      ],
      structure: [
      { title: 'Proyectos', icon: 'fas fa-pencil-ruler', to: {name:'/proyectos'}},
      { title: 'Grupos', icon: 'fas fa-layer-group', to: {name:'/grupos'} },
      { title: 'Dispositivos', icon: 'fas fa-microchip', to: {name:'/dispositivos'} },
      { title: 'Sensores', icon: 'fas fa-temperature-high', to: {name:'/grupos'} }],

      data: [
        { title: 'Datos', icon: 'fas fa-database', to: {name:'/datos'} },
        { title: 'Mapa', icon: 'fas fa-map-marker-alt', to: {name:'/mapa'} },
        { title: 'Estadisticas', icon: 'fas fa-chart-bar', to: {name:'/estadisticas'} },
      ],
      admin: [
           { title: 'Usuario', icon: 'fas fa-user', to: {name:'/usuario'} },
           { title: 'Ajustes', icon: 'fas fa-wrench', to: {name:'ajustes'} },
        ],
      grid: {title: 'Grid', icon: 'fas fa-th', to: {name:'/grid'} },
      mini: true,
    };
  },
  computed: {
     ...mapState(['projects','users', 'devices']),
  },
  methods: {
    ...mapActions(['logOut']),
    loadUser() {
       this.user = this.users.user;
     }, 
     
     closeSession() {
        this.$store.dispatch('users/logOut');
        this.$store.dispatch('projects/eraseAllData');
        this.$store.dispatch('devices/eraseAllData');
        //this.$store.replaceState({projects: {}, users:{}, devices: {}});
     }

  },
  created() {
   // this.loadUser();
  }
};
</script>

<style></style>
