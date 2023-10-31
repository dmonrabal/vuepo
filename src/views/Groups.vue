<template>
  <div class="mt-2">
    <Alert
      :show="myAlert.enable"
      :type="myAlert.type"
      :text="myAlert.text"
    ></Alert>
    <Loading :loading="cargando"></Loading>
    <Title
      :title="'Grupos'"
      :color="'secondary--text'"
      :path="'Home / grupos'"
    ></Title>
    <v-card class="pa-5 mb-2" outlined tile>
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
            :items="projects.groupsList"
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
                                label="Elige un proyecto"
                                v-model="selectedProFrom"
                                :rules="rules.project"
                                v-if="viewComboProjects"
                              ></v-select>
                              <v-text-field
                                v-model="editedItem.project"
                                label="Proyecto"
                                disabled
                                v-if="!viewComboProjects"
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
import { mapState, mapActions } from 'vuex';
import Loading from '@/components/Loading';
import Title from '@/components/Title';
import Alert from '@/components/Alert';
import utils from '@/plugins/utils';

export default {
  name: 'Groups',
  data() {
    return {
      cargando: false,
      search: '',

      myAlert: {
        enable: false,
        type: 'success',
        text: '',
      },

      // Form fields
      dialog: false,
      dialogDelete: false,
      selectedProFrom: '',
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
    ...mapActions(['getProjects', 'createGroup', 'updateGroup', 'deleteGroup']),

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
      this.editedIndex = this.projects.groupsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      //console.log('ITEM a eliminar: ', item);
      this.editedIndex = this.projects.groupsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async createItem(params) {
      try {
        const res = await this.$store.dispatch('projects/createGroup', params);
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
        console.log('RESP updateItem: ', res.status);
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

    deleteItemConfirm() {
      this.cargando = true;
      const params = [this.users.user.token];
      params.push(this.editedItem.idProject);
      params.push(this.editedItem._id);
      this.removeItem(params);
      this.closeDelete();
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
      if (this.editedIndex === -1) {
        // Create a new group
        params.push(this.selectedProFrom);
        this.createItem(params);
      } else {
        // Update a group
        params.push(this.editedItem.idProject);
        params.push(this.editedItem._id);
        this.updateItem(params);
      }

      this.cargando = false;
      this.close();
    },
  },
  created() {},
};
</script>

<style></style>
