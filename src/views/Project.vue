<template>
  <div class="mt-2">
    <Alert
      :show="myAlert.enable"
      :type="myAlert.type"
      :text="myAlert.text"
    ></Alert>
    <Loading :loading="cargando"></Loading>
    <Title
      :title="'Proyecto'"
      :color="'secondary--text'"
      :path="'Home / proyecto'"
    ></Title>
    <v-card class="pa-5 mb-2" outlined tile>
      <v-row>
        <v-col cols="12" md="6">
          <v-card-text
            class="secondary--text font-weight-light"
            background-color="light-blue"
          >
            Nombre
          </v-card-text>

          <v-card
            class="d-flex flex-row ml-5 align-center"
            color="suave"
            flat
            height="50"
            width="95%"
            tile
          >
            <span class="ml-2">{{ projects.projectSelected.name }}</span>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card-text
            class="secondary--text font-weight-light"
            background-color="light-blue"
          >
            Descripción
          </v-card-text>

          <v-card
            class="d-flex flex-row mb-5 ml-5 align-center"
            color="suave"
            flat
            height="50"
            width="95%"
            tile
          >
            <span class="ml-2">{{ projects.projectSelected.description }}</span>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card-text
            class="secondary--text font-weight-light"
            background-color="light-blue"
          >
            Uso o campo
          </v-card-text>

          <v-card
            class="d-flex flex-row ml-5 align-center"
            color="suave"
            flat
            height="50"
            width="95%"
            tile
          >
            <span class="ml-2">{{ projects.projectSelected.use }}</span>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card
            class="d-flex flex-row ml-5 mt-6 align-center justify-center no-wrap"
            color="suave"
            flat
            height="80"
            width="95%"
          >
            <v-card-text class="ml-10">
              <v-icon color="success" size="30">fa-layer-group</v-icon>
              <span class="font-weight-bold text-h6 ml-2 mr-1">{{
                this.projects.projectSelected.stats.totalGroups
              }}</span
              >grupos
              <v-icon class="ml-6" color="warning" size="30"
                >fa-microchip</v-icon
              >
              <span class="font-weight-bold text-h6 ml-2">{{
                this.projects.projectSelected.stats.totalDevices
              }}</span>
              dispositivos
              <v-icon class="ml-6" color="error" size="30"
                >fa-thermometer-three-quarters</v-icon
              >
              <span class="font-weight-bold text-h6 ml-2">{{
                this.projects.projectSelected.stats.totalSensors
              }}</span>
              sensores

              <v-icon class="ml-6" color="deep-purple" size="30"
                >fa-user</v-icon
              >
              <span class="font-weight-bold text-h6 ml-2">{{
                this.projects.projectSelected.stats.totalUsers
              }}</span>
              usuarios
              <v-icon class="ml-6" color="pink" size="30"
                >fas fa-cloud-upload-alt</v-icon
              >
              <span class="font-weight-bold text-h6 ml-2">{{
                this.projects.projectSelected.stats.totCalls
              }}</span>
              API req
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card-text
            class="secondary--text font-weight-light"
            background-color="light-blue"
          >
            Usuarios
          </v-card-text>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="ml-5">
          <template v-slot:activator="{ on }">
            <v-chip pill v-on="on" >
              <v-avatar left>
                <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
              </v-avatar>
              John Leider
            </v-chip>
          </template>
          <v-card width="300">
            <v-list dark>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/john.png"
                  ></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>John Leider</v-list-item-title>
                  <v-list-item-subtitle
                    >john@vuetifyjs.com</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="menu = false">
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-list>
              <v-list-item @click="() => {}">
                <v-list-item-action>
                  <v-icon>mdi-briefcase</v-icon>
                </v-list-item-action>
                <v-list-item-subtitle>john@gmail.com</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col>
          <v-card
            class="d-flex flex-row align-center"
            color="suave"
            flat
            width="30%"
            height="50"
            tile
          >
            <span class="ml-2">{{ projects.projectSelected.name }}</span>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar (Mayúsculas)"
              single-line
              hide-details
              class="mx-4"
            >
            </v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="projects.projectSelected.groups"
            class="pa-5"
            :search="search"
            :custom-filter="filterOnlyCapsText"
          >
            <template v-slot:top>
              <v-toolbar flat>
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
                  <v-form v-model="isFormValid">
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
                                :rules="rules.name"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6" md="12">
                              <v-text-field
                                v-model="editedItem.description"
                                label="Descripción"
                                :rules="rules.description"
                                :counter="true"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6" md="12">
                              <v-text-field
                                v-model="editedItem.code"
                                label="Etiqueta"
                                :rules="rules.code"
                                :counter="true"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">
                          Cancel
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="save"
                          :disabled="!isFormValid"
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-form>
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
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="deleteItemConfirm"
                        >OK</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>

            <template v-slot:item.action="{ item }">
              <router-link
                :to="{ name: 'Group', params: { idGroup: item._id } }"
                style="text-decoration: none; color: inherit"
              >
                <v-icon
                  small
                  class="mr-2"
                  color="primary"
                  @click="watchItem(item)"
                  title="Consultar"
                >
                  fas fa-search
                </v-icon>
              </router-link>
              <v-icon
                small
                class="mr-2"
                color="warning"
                @click="editItem(item)"
                title="Editar"
              >
                fas fa-pencil-alt
              </v-icon>
              <v-icon
                small
                color="error"
                @click="deleteItem(item)"
                title="Eliminar"
              >
                fas fa-trash
              </v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import Loading from '@/components/Loading';
import Title from '@/components/Title';
import Alert from '@/components/Alert';
import utils from '@/plugins/utils';
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      cargando: false,
      search: '',
      valid: true,
      show: false,
      edicion: false,
      dataProject: {
        name: '',
        descripction: '',
        use: '',
        manager: '',
        stats: '',
      },
      name: '',
      myAlert: {
        enable: false,
        type: 'success',
        text: '',
      },
      // Form fields
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        _id: '',
        name: '',
        description: '',
        code: '',
        project: '',
        idProject: '',
      },
      defaultItem: {
        _id: '',
        name: '',
        description: '',
        code: '',
        project: '',
        idProject: '',
      },

      // Rules from
      rules: {
        name: [(v) => !!v || 'El campo es requerido'],
        description: [
          (v) => !!v || 'El campo es requerido',
          (v) =>
            (v && v.length >= 15 && v.length <= 30) ||
            'La descripción debe tener entre 15 y 30 caracteres',
        ],
        code: [
          (v) => !!v || 'El campo es requerido',
          (v) =>
            (v && v.length >= 3 && v.length <= 15) ||
            'El códifo debe contener entre 3 y 15 caracteres',
        ],
        project: [(v) => !!v || 'El proyecto es requerido'],
      },
      isFormValid: false,
    };
  },
  props: ['loading', 'title', 'path'],
  components: {
    Loading,
    Title,
    Alert,
  },
  computed: {
    ...mapState(['projects', 'users']),

    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Grupo' : 'Editar Grupo';
    },

    viewComboProjects() {
      if (this.editedIndex === -1) {
        // Add a new element, show available projects
        return true;
      } else {
        return false;
      }
    },
    headers() {
      return [
        { text: 'Nombre', value: 'name', sortable: true },
        { text: 'Descripción', value: 'description' },
        { text: 'Etiqueta', value: 'code' },
        { text: 'Acciones', value: 'action', sortable: false },
      ];
    },
  },
  methods: {
    /**
     * This method is used for update the project selected.
     * Once user has made a change like (insert, update, delete), the methods
     * all projects, all groups and all stats are updated on projects store.
     */
    refreshProjectSelected() {
      this.projects.projectList.find((project) => {
        if (project._id === this.projects.projectSelected._id) {
          this.projects.projectSelected.groups = project.groups;
          this.projects.projectSelected.stats = project.stats;
        }
      });
      console.log('refreshProjectSelected: ', this.projects.projectSelected);
    },
    // Groups menu METHODS
    //Method used for search group fields
    filterOnlyCapsText(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },

    watchItem(group) {
      console.log('Consultando item: ', group);
      this.$store.dispatch('projects/selectGroup', group);
    },

    editItem(item) {
      //console.log('Editando item: ', item);
      this.editedIndex = this.projects.projectSelected.groups.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      //console.log('ITEM a eliminar: ', item);
      this.editedIndex = this.projects.projectSelected.groups.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async createItem(params) {
      try {
        const res = await this.$store.dispatch('projects/createGroup', params);
        //console.log('Parámetros pasados: ', params);
        utils.alert(
          this.myAlert,
          'success',
          utils.messages.GROUP_CREATE_SUCCESS
        );
      } catch (err) {
        utils.alert(this.myAlert, 'error', utils.messages.GROUP_CREATE_ERROR);
      }
    },

    async updateItem(params) {
      try {
        const res = await this.$store.dispatch('projects/updateGroup', params);
        //console.log('RESP updateItem: ', res.status);
        utils.alert(
          this.myAlert,
          'success',
          utils.messages.GROUP_UPDATE_SUCCESS
        );
      } catch (err) {
        utils.alert(this.myAlert, 'error', utils.messages.GROUP_UPDATE_ERROR);
      }
    },

    async removeItem(params) {
      try {
        //console.log('Lo que enviamos: ', params);
        const res = await this.$store.dispatch('projects/deleteGroup', params);
        utils.alert(
          this.myAlert,
          'success',
          utils.messages.GROUP_DELETE_SUCCESS
        );
      } catch (err) {
        utils.alert(this.myAlert, 'error', utils.messages.GROUP_DELETE_ERROR);
      }
    },

    async deleteItemConfirm() {
      this.cargando = true;
      const params = [this.users.user.token];
      params.push(this.projects.projectSelected._id);
      params.push(this.editedItem._id);
      await this.removeItem(params);
      this.closeDelete();
      this.refreshProjectSelected();
      this.cargando = false;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      // Calling updateProject
      this.cargando = true;
      const params = [this.users.user.token];
      const body = {
        name: this.editedItem.name,
        description: this.editedItem.description,
        code: this.editedItem.code,
      };
      params.push(body);
      params.push(this.projects.projectSelected._id);
      if (this.editedIndex === -1) {
        // Create a new project
        await this.createItem(params);
      } else {
        // Update group
        console.log('This edited Item: ', this.editedItem);
        //params.push(this.editedItem.idProject);
        params.push(this.editedItem._id);
        await this.updateItem(params);
      }
      this.refreshProjectSelected();
      this.cargando = false;
      this.close();
    },
  },
  created() {},
};
</script>

<style></style>
