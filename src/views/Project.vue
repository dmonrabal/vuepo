<template>
  <div class="mt-2">
    <Loading :loading="cargando"></Loading>
    <Title
      :title="'Proyecto'"
      :color="'secondary--text'"
      :path="'Home / proyecto'"
    ></Title>
    <div>
      <v-card class="pa-5 mb-2">
        <div v-show="consulta">
          <v-card-text
            class="secondary--text font-weight-light"
            background-color="light-blue"
          >
            Nombre del proyecto
          </v-card-text>

          <v-card
            class="d-flex flex-row mb-3 ml-5 align-center"
            color="suave"
            flat
            height="50"
            width="95%"
            tile
          >
            <span class="ml-2">{{ projects.projectSelected.name }}</span>
          </v-card>

          <v-card-text
            class="secondary--text font-weight-light"
            background-color="light-blue"
          >
            Descripción del proyecto
          </v-card-text>

          <v-card
            class="d-flex flex-row ml-5 align-center"
            color="suave"
            flat
            height="50"
            width="95%"
            tile
          >
            <span class="ml-2">{{ projects.projectSelected.description }}</span>
          </v-card>
          <v-card-text
            class="secondary--text font-weight-light"
            background-color="light-blue"
          >
            Uso del proyecto
          </v-card-text>

          <v-card
            class="d-flex flex-row mb-3 ml-5 align-center"
            color="suave"
            flat
            height="50"
            width="95%"
            tile
          >
            <span class="ml-2">{{ projects.projectSelected.use }}</span>
          </v-card>

          <v-card-actions>
            <v-btn
              color="warning"
              class="mt-5 ml-4 text-capitalize"
              v-if="!edicion"
              @click="mostrarEdicion"
            >
              Editar
            </v-btn>
          </v-card-actions>
        </div>

        <v-expand-transition>
          <div class="ml-5 mt-10" v-show="edicion">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @submit.prevent="updateProjectForm"
            >
              <v-text-field
                v-model="dataProject.name"
                :counter="10"
                :rules="nameRules"
                label="Nombre del proyecto"
                placeholder="Introduce un nombre de proyecto"
                filled
                dense
                required
              ></v-text-field>
              <v-text-field
                v-model="dataProject.description"
                class="mt-5"
                :counter="10"
                :rules="nameRules"
                label="Descripción del proyecto"
                placeholder="Introduce un descripción de proyecto"
                filled
                dense
                required
              ></v-text-field>

              <v-text-field
                v-model="dataProject.use"
                class="mt-5"
                label="Uso del proyecto"
                filled
                dense
                placeholder="Uso que se le va a dar al proyecto"
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mt-10 mr-4 text-capitalize"
                type="submit"
              >
                Confirmar
              </v-btn>

              <v-btn
                color="error"
                class="mt-10 mr-4 text-capitalize"
                @click="mostrarEdicion"
              >
                Cancelar
              </v-btn>
            </v-form>
          </div>
        </v-expand-transition>
      </v-card>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading';
import Title from '@/components/Title';
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      cargando: false,
      valid: true,
      show: false,
      consulta: true,
      edicion: false,
      dataProject: {
        name: '',
        descripction: '',
        use: '',
      },
      name: '',
      nameRules: [
        (v) => !!v || 'El campo es requerido',
        (v) =>
          (v && v.length >= 10 && v.length <= 40) ||
          'El campo debe contener entre 10 y 40 caracteres',
      ],
      otherRule: [(v) => !!v || 'El campo es requerido'],
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
    ...mapActions(['updateProject']),

    mostrarEdicion() {
      this.edicion = !this.edicion;
    },

    updateProjectForm() {
      let params = [this.users.user.token];
      params.push(this.dataProject);
      params.push(this.projects.projectSelected._id);
      this.cargando = true;
      this.$store.dispatch('projects/updateProject', params);
      this.cargando = false;
      this.loadValuesProject();
      this.edicion = false;
      this.consulta = true;
    },

    loadValuesProject() {
 
      if (this.projects.projectSelected != '') {
        //console.log('[INFO] Cargando valores');
        this.dataProject = {
          name: this.projects.projectSelected.name,
          description: this.projects.projectSelected.description,
          use: this.projects.projectSelected.use,
        };
      } else {
        //console.log('[INFO] No ha valores asignados');
      }
    },
  },
  created() {
    this.loadValuesProject();
  },
};
</script>

<style></style>
