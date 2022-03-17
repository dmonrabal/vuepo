<template>
  <div class="mt-2">
    <Loading :loading="cargando"></Loading>
    <Title
      :title="'Estadísticas'"
      :color="'secondary--text'"
      :path="'Home /'"
    ></Title>
    <v-row>
      <v-col cols="12" md="3" sm="4">
        <v-card
          class="pa-4 text-center"
          max-width="420"
          max-height="400"
          outlined tile
        >
          <v-card-subtitle>
            <span class="font-weight-light text-h4">Proyectos</span>
          </v-card-subtitle>
          <v-card-text>
            <v-icon class="mb-5" color="success" size="80"
              >fas fa-pencil-ruler</v-icon
            >
            <p class="font-weight-bold text-h3">
              {{ projects.totalStats.totalProjecs }}
            </p>
            <p class="font-weight-light">
              Es el punto inicial del proceso, el cual te permite administrar
              las reglas de negocio.
            </p>
            <v-btn
              class="ma-2 text-capitalize font-weight-light"
              color="success"
              dark
              to="/proyectos"
            >
              Consultar
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="4">
        <v-card
          class="pa-4 text-center"
          max-width="420"
          max-height="400"
          outlined tile
        >
          <v-card-subtitle>
            <span class="font-weight-light text-h4">Grupos</span>
          </v-card-subtitle>
          <v-card-text>
            <v-icon class="mb-5" color="warning" size="80"
              >fas fa-layer-group</v-icon
            >
            <p class="font-weight-bold text-h3">
              {{ projects.totalStats.totalGroups }}
            </p>
            <p class="font-weight-light">
              Organizan los dispostivos de un proyecto siguiendo un modelo o
              disposisición lógica
            </p>
            <v-btn
              class="ma-2 text-capitalize font-weight-light"
              color="warning"
              dark
              to="/grupos"
            >
              Consultar
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="4">
        <v-card
          class="pa-4 text-center"
          max-width="420"
          max-height="400"
          outlined tile
        >
          <v-card-subtitle>
            <span class="font-weight-light text-h4">Dispositivos</span>
          </v-card-subtitle>
          <v-card-text>
            <v-icon class="mb-5" color="info" size="80"
              >fas fa-microchip</v-icon
            >
            <p class="font-weight-bold text-h3">
              {{ projects.totalStats.totalDevices }}
            </p>
            <p class="font-weight-light">
              Envían y reciben información de los sensores que tienen conectados
            </p>
            <v-btn
              class="ma-2 text-capitalize font-weight-light"
              color="primary"
              dark
              to="/dispositivos"
            >
              Consultar
            </v-btn>
          </v-card-text>
        </v-card></v-col
      >
      <v-col cols="12" md="3" sm="4">
        <v-card
          class="pa-4 text-center"
          max-width="420"
          max-height="400"
          outlined tile
        >
          <v-card-subtitle>
            <span class="font-weight-light text-h4">Sensores</span>
          </v-card-subtitle>
          <v-card-text>
            <v-icon class="mb-5" color="error" size="80"
              >fas fa-thermometer-three-quarters</v-icon
            >
            <p class="font-weight-bold text-h3">
              {{ projects.totalStats.totalSensors }}
            </p>
            <p class="font-weight-light">
              Envían y reciben diferentes señales para ser explotadas en esta
              plataforma
            </p>
            <v-btn
              class="ma-2 text-capitalize font-weight-light"
              color="error"
              dark
              to="/sensores"
            >
              Consultar
            </v-btn>
          </v-card-text>
        </v-card></v-col
      >
    </v-row>

    <v-row>
      <v-col cols="12" md="3" sm="4"
        ><v-card
          class="pa-4 text-center"
          max-width="420"
          max-height="400"
          outlined tile
        >
          <v-card-subtitle>
            <span class="font-weight-light text-h4">Usuarios</span>
          </v-card-subtitle>
          <v-card-text>
            <v-icon class="mb-5" color="deep-purple" size="80"
              >fas fas fa-user</v-icon
            >
            <p class="font-weight-bold text-h3">
              {{ projects.totalStats.totalUsers }}
            </p>
            <p class="font-weight-light">
              Crean, consultan modifican o borran cada una de los componentes de
              sus proyectos
            </p>
            <v-btn
              class="ma-2 text-capitalize font-weight-light"
              color="deep-purple"
              dark
              to="/sensores"
            >
              Consultar
            </v-btn>
          </v-card-text>
        </v-card></v-col
      >
      <v-col cols="12" md="9" sm="8">
        <v-card
          class="pa-4 text-center mb-2"
          max-width="1320"
          height="400"
          outlined tile
        >
          <v-card-text>
            <v-icon class="mb-5" color="primary" size="200"
              >fas fa-sitemap</v-icon
            >
          </v-card-text>
        </v-card></v-col
      >
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Loading from '@/components/Loading';
import Title from '@/components/Title';

export default {
  name: 'Home',
  data() {
    return {
      cargando: false,
      totalProjects: 0,
      totalGroups: 0,
      totalDevices: 0,
      totalSensors: 0,
      totalUsers: 0,
    };
  },
  props: ['loading', 'title', 'color', 'path'],
  components: {
    Loading,
    Title,
  },
  computed: {
    ...mapState(['projects', 'users']),
  },
  methods: {
    async loadProjectStats() {
      try {
        const token = this.users.user.token;
        await this.$store.dispatch('projects/getProjects', token);
        //await this.$store.dispatch('projects/getTotalStats', token);
      } catch (err) {
        console.log('[ERROR] - projects:LoadProjects: ' + err.message);
      }
    },
  },
  created() {
    this.cargando = true;
    this.loadProjectStats();
    this.cargando = false;
  },
};
</script>

<style></style>
