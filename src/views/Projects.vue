<template>
  <div class="mt-2">
    <Loading :loading="cargando"></Loading>
    <Title
      :title="'Proyectos'"
      :color="'secondary--text'"
      :path="'Home / proyectos'"
    ></Title>
    <div class="d-flex justify-space-around flex-wrap">
      <v-card
        v-for="project in projects.projectList"
        :key="project.id"
        class="pa-3 text-center mb-4"
        width="380"
        height="380"
        hover
      >
        <v-card-subtitle>
          <span class="font-weight-bold text-h6">{{ project.name }}</span>
        </v-card-subtitle>
        <v-card-text>
          {{ project.description }}
        </v-card-text>
        <v-icon class="mb-4" color="success" size="80"
          >fas fa-pencil-ruler</v-icon
        >
        <v-card-text>
          <div class="d-flex justify-center align-center">
            <v-icon class="ml-10" color="grey" size="20">fa-layer-group</v-icon>
            <span class="font-weight-bold text-h6 ml-2">{{
              project.stats.totalGroups
            }}</span>
            <div class="ml-1 text-h7">grupos</div>
            <v-icon class="ml-6" color="grey" size="20">fa-microchip</v-icon>
            <span class="font-weight-bold text-h6 ml-2">{{
              project.stats.totalDevices
            }}</span>
            <div class="ml-1 text-h7">dispositivos</div>
          </div>
          <div class="d-flex justify-center align-center ml-7 mt-2">
            <v-icon color="grey" size="20">fas fa-temperature-high</v-icon>
            <span class="font-weight-bold text-h6 ml-2">{{
              project.stats.totalSensors
            }}</span>
            <div class="ml-1 text-h7">sensores</div>
            <v-icon class="ml-2" color="grey" size="20">fa-user</v-icon>
            <span class="font-weight-bold text-h6 ml-2">{{
              project.stats.totalUsers
            }}</span>
            <div class="ml-1">usuarios</div>
          </div>
        </v-card-text>

        <router-link
          :to="{ name: 'Project', params: { idProject: project._id } }"
          style="text-decoration: none; color: inherit"
        >
          <v-btn
            class="mt-2 text-capitalize font-weight-light"
            color="success"
            block
            dark
            @click="passProject(project)"
          >
            Consulta
          </v-btn>
        </router-link>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Loading from '@/components/Loading';
import Title from '@/components/Title';
///  :to="`"{ name: 'Project' , params: {id: ${project._id}}}`"
export default {
  name: 'Projects',
  data() {
    return {
      cargando: false,
    };
  },
  props: ['loading', 'title', 'path'],
  components: {
    Loading,
    Title,
  },
  computed: {
    ...mapState(['projects', 'users']),
  },
  methods: {
    ...mapActions(['getProjects']),

    logInreadProjects() {
      this.cargando = true;
      this.$store.dispatch('projects/getProjects', this.users.user.token);
      this.cargando = false;
    },

    passProject(project) {
      this.$store.dispatch('projects/selectProject', project);
    },
  },
  created() {
    // this.logInreadProjects();
  },
};
</script>

<style scoped>
.projectlist {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}
</style>
