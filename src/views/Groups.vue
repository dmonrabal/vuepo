<template>
  <div class="mt-2">
    <Loading :loading="cargando"></Loading>
    <Title
      :title="'Grupos'"
      :color="'secondary--text'"
      :path="'Home / grupos'"
    ></Title>
    <v-card class="pa-1 mb-5" outlined tile>
      <v-btn plain v-if="!displayGrid" @click="displayGrid = true">
        <v-icon class="fas fa-th" size="15"> </v-icon>
      </v-btn>
      <v-btn plain v-if="displayGrid" @click="displayGrid = false">
        <v-icon class="fas fa-table" size="15"> </v-icon>
      </v-btn>
    </v-card>
    <v-card v-if="!displayGrid" outlined tile>
      <v-data-table
        :headers="headers"
        :items="projects.groupsList"
        class="pa-5"
        :search="search"
        :custom-filter="filterOnlyCapsText"
      >
        <template v-slot:top>
          <v-text-field
            v-model="search"
            label="Search (UPPER CASE ONLY)"
            class="mx-4"
          ></v-text-field>
        </template>

        <template v-slot:top>
          <v-toolbar flat>
            <!-- <v-toolbar-title>My CRUD</v-toolbar-title> -->
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  elevation="8"
                  fab
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>fas fa-plus</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.description"
                          label="Descripción"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.code"
                          label="Etiqueta"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-select
                          :items="
                            projects.projectList.map((p) => {
                              return { text: p.name, value: p._id };
                            })
                          "
                          filled
                          dense
                          label="Filled style"
                          v-model="selectedProFrom"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >¿Estás seguro de eliminar este elemento?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:item.action="{ item }">
        
          <v-icon small class="mr-2" color="primary" @click="watchItem(item)">
            fas fa-search
          </v-icon>
          <v-icon small class="mr-2" color="warning" @click="editItem(item)">
            fas fa-pencil-alt
          </v-icon>
          <v-icon small color="error" @click="deleteItem(item)">
            fas fa-trash
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <div
      class="d-flex justify-space-around flex-wrap"
      v-for="project in projects.projectList"
      :key="project.id"
      v-if="displayGrid"
    >
      <v-card
        v-for="group in project.groups"
        :key="project.id"
        class="pa-3 text-center mb-2"
        width="380"
        height="380"
        hover
        v-if="displayGrid"
        outlined
        tile
      >
        <v-card-subtitle>
          <span class="font-weight-bold text-h6">{{ project.name }}</span>
        </v-card-subtitle>
        <v-card-text>
          {{ group.name }} - {{ group.code }}
          <p class="mt-2 font-italic">{{ group.description }}</p>
        </v-card-text>
        <v-icon class="mb-2" color="warning" size="80"
          >fas fa-layer-group</v-icon
        >
        <v-card-text>
          INFO NO REAL
          <div class="d-flex justify-center align-center">
            <v-icon class="ml-6" color="grey" size="20">fa-microchip</v-icon>
            <span class="font-weight-bold text-h6 ml-2">{{
              project.stats.totalDevices
            }}</span>
            <div class="mr-2 text-h7">dispositivos</div>
            <v-icon color="grey" size="20">fas fa-temperature-high</v-icon>
            <span class="font-weight-bold text-h6 ml-2">{{
              project.stats.totalSensors
            }}</span>
            <div class="ml-1 text-h7">sensores</div>
          </div>
        </v-card-text>

        <router-link
          :to="{ name: 'Project', params: { idProject: project._id } }"
          style="text-decoration: none; color: inherit"
        >
          <v-btn
            class="text-capitalize font-weight-light"
            color="warning"
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

export default {
  name: 'Groups',
  data() {
    return {
      cargando: false,
      displayGrid: false,
      search: '',

      // Form fields
      dialog: false,
      dialogDelete: false,
      selectedProFrom: '',
      editedIndex: -1,
      editedItem: {
        name: '',
        description: '',
        code: '',
        project: '',
      },
      defaultItem: {
        name: '',
        description: '',
        code: '',
        project: '',
      },
    };
  },
  props: ['loading', 'title', 'path'],
  components: {
    Loading,
    Title,
  },
  computed: {
    ...mapState(['projects', 'users']),

    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Grupo' : 'Editar Grupo';
    },

    headers() {
      return [
        { text: 'Nombre', value: 'name', sortable: true },
        { text: 'Descripción', value: 'description' },
        { text: 'Etiqueta', value: 'code' },
        { text: 'Proyecto', value: 'project' },
        { text: 'Acciones', value: 'action', sortable: false },
      ];
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    ...mapActions(['getProjects', 'createGroup', 'deleteGroup']),

    logInreadProjects() {
      this.cargando = true;
      this.$store.dispatch('projects/getProjects', this.users.user.token);
      this.cargando = false;
    },

    passProject(project) {
      this.$store.dispatch('projects/selectProject', project);
    },

    //Method used for search group fields
    filterOnlyCapsText(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },

    watchItem(item) {
      console.log('Consultando item: ', item);
    },

    editItem(item) {
      console.log('Editando item: ', item);
    },

    deleteItem(item) {
      console.log('ITEM a eliminar: ', item);
      this.dialogDelete = true;
      console.log('Pregunto si borro: ', item);
    },

    async createItem(params) {
      try {
        const res = await this.$store.dispatch('projects/createGroup', params);
        console.log('RESP createItem: ', res);
      } catch (err) {
        console.log('[ERROR] - updateCreateItem', err.message);
      }
    },

    async removeItem(params) {
      try { 
        const res = await this.$store.dispatch('projects/deleteGroup', params);
        console.log('RESP deleteItem: ', res);
      } catch (err) {
        console.log('[ERROR] - deleteItem', err.message);
      }
    },

   

    deleteItemConfirm() {
      console.log('Confirma borra elemento !!');
      this.cargando = true;
      const params = [this.users.user.token];
      params.push(this.selectedProFrom);
      params.push(this.editedItem._id);
      this.removeItem(params);
      // Calling delete vaxios funtion (in fact wu must to call updateProject)
      // TODO
      this.closeDelete();
      this.cargando = false;
    },

     close() {
      //console.log('Llamando a close!!');
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      console.log('Llamando a close delete!!');
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      // Calling updateProject
      this.cargando = true;
      const params = [this.users.user.token];
      const body = {
        name: this.editedItem.name,
        description: this.editedItem.description,
        code: this.editedItem.code,
      };
      params.push(body);
      params.push(this.selectedProFrom);
      console.log('Llamando a save!! idProject: ', body);
      this.createItem(params);
      this.cargando = false;
      this.close();
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
