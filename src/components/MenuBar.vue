<template>
  <v-card>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      
      <v-btn  v-if="!users.isLogged" :to="{name: 'Login'}">
        <v-icon
            <i class="fas fa-sign-in-alt"></i>
        </v-icon>
      </v-btn>
      <v-btn @click="closeSession" v-if="users.isLogged">
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
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>David Monrabal</v-list-item-title>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider class="mt-2"></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to.name">
          <v-list-item-icon>
            <v-icon >{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title></v-list-item-title>
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
            <v-list-item-title v-text="item.title"></v-list-item-title></v-list-item-title>
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
            <v-list-item-title v-text="item.title"></v-list-item-title></v-list-item-title>
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
            <v-list-item-title v-text="item.title"></v-list-item-title></v-list-item-title>
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
      drawer: true,
      items: [
        { title: 'Inicio', icon: 'fas fa-home', to: {name:'/'} },
        { title: 'Dashboard', icon: 'fas fa-tachometer-alt', to: {name:'dashboard'} },
      ],
      structure: [
      { title: 'Proyectos', icon: 'fas fa-sitemap', to: {name:'/proyectos'}},
      { title: 'Grupos', icon: 'fas fa-layer-group', to: {name:'/grupos'} },
      { title: 'Dispositivos', icon: 'fas fa-microchip', to: {name:'/dispostivos'} },
      { title: 'Sensores', icon: 'fas fa-temperature-high', to: {name:'/grupos'} }],

      data: [
        { title: 'Datos', icon: 'fas fa-database', to: {name:'tramas'} },
         { title: 'Mapa', icon: 'fas fa-map-marker-alt', to: {name:'mapa'} },
         { title: 'Estadisticas', icon: 'fas fa-chart-bar', to: {name:'estadisticas'} },
      ],
      admin: [
           { title: 'Usuario', icon: 'fas fa-user', to: {name:'ingreso'} },
           { title: 'Ajustes', icon: 'fas fa-wrench', to: {name:'ajustes'} },
        ],
      mini: true,
    };
  },
  computed: {
     ...mapState(['users']),
  },
  methods: {
    ...mapActions(['logOut']),

     closeSession() {
        this.$store.dispatch('users/logOut')
     }


  },
};
</script>

<style></style>
