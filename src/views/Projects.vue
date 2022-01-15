<template>
  <div class="mt-10">
    <Loading :loading="cargando"></Loading>
    <Title :title="'Proyectos'" :path="'Estructura - Proyectos'"></Title>
    <v-row class="justify-center mt-10">
      <v-col
        cols="12"
        sm="3"
        md="4"
        v-for="(project, index) in projects.projectList"
        :key="project._id"
      >
        <v-card class="mx-auto" max-width="300">
          <v-img
            height="200"
            src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
          ></v-img>
          <v-card-title>
            <h2 class="text-h6">{{ project.name }}</h2>
            <v-spacer></v-spacer>
          </v-card-title>

          <v-card-text> {{ project.description }} </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-text>
            <span class="subheading">Select size</span>
          </v-card-text>

          <v-card-actions>
            <v-btn block class="white--text mb-2" color="success accent-4">
              Select project
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Loading from '@/components/Loading';
import Title from '@/components/Title';

export default {
  name: 'Home',
  cargando: false,
  props: ['loading', 'title', 'path'],
  components: {
    Loading,
    Title
  },
  computed: {
    ...mapState(['projects', 'users']),
  },
  methods: {
    ...mapActions(['getProjects']),

    logInreadProjects() {
      this.cargando = true;
      this.$store.dispatch('projects/getProjects', this.users.user.token);
      //this.$store.dispatch('projects/getStatsProject', this.users.user.token)
      this.cargando = false;
    },
  },
  created() {
    this.logInreadProjects();
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
