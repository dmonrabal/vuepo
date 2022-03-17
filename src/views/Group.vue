<template>
  <div class="mt-2">
    <Alert
      :show="myAlert.enable"
      :type="myAlert.type"
      :text="myAlert.text"
    ></Alert>
    <Loading :loading="cargando"></Loading>
    <Title
      :title="'Grupo'"
      :color="'secondary--text'"
      :path="`Home / grupos / ${this.projects.groupSelected._id}`"
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
            <span class="ml-2">{{ projects.groupSelected.name }}</span>
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
            class="d-flex flex-row ml-5 align-center"
            color="suave"
            flat
            height="50"
            width="95%"
            tile
          >
            <span class="ml-2">{{ projects.groupSelected.description }}</span>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card-text
            class="secondary--text font-weight-light"
            background-color="light-blue"
          >
            Código
          </v-card-text>

          <v-card
            class="d-flex flex-row ml-5 align-center"
            color="suave"
            flat
            height="50"
            width="95%"
            tile
          >
            <span class="ml-2">{{ projects.groupSelected.code }}</span>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card
            class="d-flex flex-row ml-5 mt-6 align-center justify-center"
            color="suave"
            flat
            height="80"
            width="95%"
          >
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
            :items="devices.devicesGrpSelected"
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
                                v-model="editedItem.label"
                                label="Etiqueta"
                                :rules="rules.label"
                                :counter="true"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6" md="12">
                              <v-text-field
                                v-model="editedItem.use"
                                label="Uso"
                                :rules="rules.use"
                                :counter="true"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6" md="12">
                              <v-select
                                :items="tecnologias"
                                filled
                                dense
                                label="Tecnología"
                                :rules="rules.technology"
                                v-model="tecnoForm"
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
                :to="{ name: 'Device', params: { idDevice: item._id } }"
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
import Title from '@/components/Title';
import Loading from '@/components/Loading';
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
        label: '',
        use: '',
        technology: '',
      },
      defaultItem: {
        _id: '',
        name: '',
        description: '',
        label: '',
        use: '',
        technology: '',
      },
      tecnoForm: '',
      tecnologias: [
        { text: 'GSM', value: 'GSM' },
        { text: '3G', value: '3G' },
        { text: 'Wifi', value: 'Wifi' },
        { text: 'Lora', value: 'Lora' },
      ],
      // Rules from
      rules: {
        name: [
          (v) => !!v || 'El campo es requerido',
          (v) =>
            (v && v.length >= 10 && v.length <= 40) ||
            'El nombre debe tener entre 10 y 40 caracteres',
        ],
        description: [
          (v) => !!v || 'El campo es requerido',
          (v) =>
            (v && v.length >= 10 && v.length <= 40) ||
            'La descripción debe tener entre 10 y 40 caracteres',
        ],
        label: [(v) => !!v || 'El campo es requerido'],
        use: [(v) => !!v || 'El campo es requerido'],
        technology: [(v) => !!v || 'El campo es requerido'],
      },
      isFormValid: false,
    };
  },
  props: ['loading', 'title', 'path'],
  components: {
    Title,
    Loading,
    Alert,
  },
  computed: {
    ...mapState(['projects', 'users', 'devices']),

    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Dispositivo' : 'Editar Dispositivo';
    },

    headers() {
      return [
        { text: 'Nombre', value: 'name', sortable: true },
        { text: 'Descripción', value: 'description' },
        { text: 'Etiqueta', value: 'label' },
        { text: 'Uso', value: 'use' },
        { text: 'Tecnología', value: 'technology' },
        { text: 'Acciones', value: 'action', sortable: false },
      ];
    },
  },
  methods: {
    filterOnlyCapsText(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },

    watchItem(device) {
      console.log('Consultando item: ', device);
      this.$store.dispatch('devices/selectDevice', device);
    },

    editItem(item) {
      //console.log('Editando item: ', item);
      this.editedIndex = this.devices.devicesGrpSelected.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      //console.log('ITEM a eliminar: ', item);
      this.editedIndex = this.devices.devicesGrpSelected.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async createItem(params) {
      try {
        //console.log('Parámetros pasados: ', params);
        const res = await this.$store.dispatch('devices/createDevice', params);
        utils.alert(
          this.myAlert,
          'success',
          utils.messages.DEVICE_CREATE_SUCCESS
        );
      } catch (err) {
        utils.alert(this.myAlert, 'error', utils.messages.DEVICE_CREATE_ERROR);
      }
    },

    async updateItem(params) {
      try {
        console.log('updateItem: ', params);
        const res = await this.$store.dispatch('devices/updateDevice', params);
        utils.alert(
          this.myAlert,
          'success',
          utils.messages.DEVICE_UPDATE_SUCCESS
        );
        console.log('RESP updateItem: ', res.status);
      } catch (err) {
        utils.alert(this.myAlert, 'error', utils.messages.DEVICE_UPDATE_ERROR);
      }
    },

    async removeItem(params) {
      try {
        //console.log('Lo que enviamos: ', params);
        const res = await this.$store.dispatch('devices/deleteDevice', params);
        utils.alert(
          this.myAlert,
          'success',
          utils.messages.DEVICE_DELETE_SUCCESS
        );
      } catch (err) {
        utils.alert(this.myAlert, 'error', utils.messages.DEVICE_DELETE_ERROR);
      }
    },

    async deleteItemConfirm() {
      this.cargando = true;
      let params = [this.users.user.token];
      params.push(this.projects.projectSelected._id);
      params.push(this.projects.groupSelected._id);
      params.push(this.devices.deviceSelected._id);
      await this.removeItem(params);
      this.closeDelete();
      await this.loadDevices();
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
      let params = [this.users.user.token];
      params.push(this.projects.projectSelected._id);
      params.push(this.projects.groupSelected._id);

      const body = {
        name: this.editedItem.name,
        description: this.editedItem.description,
        use: this.editedItem.use,
        label: this.editedItem.label,
        technology: this.tecnoForm,
        //coordinates: '',
        imageCover: '',
        sensors: [],
      };
      params.push(body);
      if (this.editedIndex === -1) {
        // Create a new project
        await this.createItem(params);
        await this.loadDevices();
      } else {
        // Update group
        console.log('This edited Item: ', this.editedItem);
        //params.push(this.editedItem.idProject);
        params.push(this.editedItem._id);
        await this.updateItem(params);
      }
      await this.loadDevices();
      this.cargando = false;
      this.close();
    },

    async loadDevices() {
      let params = [this.users.user.token];
      const idProject = this.projects.groupSelected.idProject;
      const idGroup = this.projects.groupSelected._id;
      params.push(idProject);
      params.push(idGroup);
      try {
        const res = await this.$store.dispatch(
          'devices/getDevicesGroup',
          params
        );
      } catch (err) {
        console.log('Fallo al cargar los dispositivos: ', err);
      }
    },
  },
  created() {
    this.loadDevices();
  },
};
</script>

<style></style>
