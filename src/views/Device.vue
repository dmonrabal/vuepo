<template>
  <div class="mt-2">
    <Alert
      :show="myAlert.enable"
      :type="myAlert.type"
      :text="myAlert.text"
    ></Alert>
    <Loading :loading="cargando"></Loading>
    <Title
      :title="'Dispositivo'"
      :color="'secondary--text'"
      :path="`Home / dispositivos / ${this.devices.deviceSelected._id}`"
    ></Title>

    <v-card class="pa-5 mb-2" outlined tile>
      <v-row>
        <v-col cols="12" md="6">
          <v-row class="pa-2 mr-4">
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
              tile
            >
              <span class="ml-2">{{ devices.deviceSelected.name }}</span>
            </v-card>
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
              tile
            >
              <span class="ml-2">{{ devices.deviceSelected.description }}</span>
            </v-card>
            <v-card-text
              class="secondary--text font-weight-light"
              background-color="light-blue"
            >
              Uso
            </v-card-text>

            <v-card
              class="d-flex flex-row ml-5 align-center"
              color="suave"
              flat
              height="50"
              tile
            >
              <span class="ml-2">{{ devices.deviceSelected.use }}</span>
            </v-card>
          </v-row>
          <v-row>
            <v-col cols="6" sm="4">
              <v-card-text
                class="secondary--text font-weight-light"
                background-color="light-blue"
              >
                Etiqueta
              </v-card-text>

              <v-card
                class="d-flex flex-row ml-5 align-center"
                color="suave"
                flat
                height="50"
                width="95%"
                tile
              >
                <span class="ml-2">{{ devices.deviceSelected.label }}</span>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4">
              <v-card-text
                class="secondary--text font-weight-light"
                background-color="light-blue"
              >
                Tecnología
              </v-card-text>

              <v-card
                class="d-flex flex-row ml-5 align-center"
                color="suave"
                flat
                height="50"
                tile
              >
                <span class="ml-2">{{
                  devices.deviceSelected.technology
                }}</span>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4">
              <v-card-text
                class="secondary--text font-weight-light"
                background-color="light-blue"
              >
                Última entrada
              </v-card-text>

              <v-card
                class="d-flex flex-row ml-5 align-center"
                color="suave"
                flat
                height="50"
                tile
              >
                <span class="ml-2">{{
                  devices.deviceSelected.lastEntry
                }}</span>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            class="d-flex flex-row ml-5 mt-10 align-center justify-center"
            color="suave"
            flat
            height="400"
            width="95%"
          >
            <MglMap
              :accessToken="accessToken"
              :mapStyle="mapStyle"
              :center="coordinates"
              @load="onMapLoad"
            >
              <MglMarker :coordinates.sync="coordinates" color="blue" />
            </MglMap>
            <!--v-icon color="secondary" size="200"> fas fa-image </!--v-icon-->
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
            :items="devices.deviceSelected.sensors"
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
                                v-model="editedItem.unit"
                                label="Unidad"
                                :rules="rules.description"
                                :counter="true"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6" md="12">
                              <v-text-field
                                v-model="editedItem.symbol"
                                label="Símbolo"
                                :rules="rules.label"
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
                :to="{ name: 'Data', params: { idSensor: item._id } }"
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
import Mapbox from 'mapbox-gl';
import { MglMap, MglMarker } from 'vue-mapbox';

export default {
  data() {
    return {
      cargando: false,
      search: '',
      valid: true,
      show: false,
      edicion: false,
      dataDevice: {
        name: '',
        descripction: '',
        label: '',
        use: '',
        technology: '',
      },
      // name: '', ????
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
        name: '',
        unit: '',
        symbol: '',
      },
      defaultItem: {
        name: '',
        unit: '',
        symbol: '',
      },
      tecnoForm: '',
      // Rules from
      rules: {
        name: [(v) => !!v || 'El campo es requerido'],
        unit: [(v) => !!v || 'El campo es requerido'],
        symbol: [(v) => !!v || 'El campo es requerido'],
      },
      isFormValid: false,

      // MapBox settings
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      mapStyle: 'mapbox://styles/mapbox/light-v10',
      coordinates: [2.9862918733796486, 39.57380640335257],
      coordinate2: [1.9862918733796486, 39.57340335257],

      //'mapbox://styles/mapbox/streets-v11',
    };
  },
  props: ['loading', 'title', 'path'],
  components: {
    Title,
    Loading,
    Alert,
    MglMap,
    MglMarker,
  },
  computed: {
    ...mapState(['users', 'projects', 'devices']),

    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Sensor' : 'Editar Sensor';
    },

    headers() {
      return [
        { text: 'Nombre', value: 'name', sortable: true },
        { text: 'Unidad', value: 'unit' },
        { text: 'Símbolo', value: 'symbol' },
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

    watchItem(sensor) {
      this.$store.dispatch('data/selectSensor', sensor);
    },

    editItem(item) {
      this.editedIndex = this.devices.deviceSelected.sensors.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.devices.deviceSelected.sensors.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    // TODO updateSensor
    async updateItem(params) {
      try {
        console.log('updateItem: ', params);
        const res = await this.$store.dispatch('devices/updateDevice', params);
        utils.alert(
          this.myAlert,
          'success',
          utils.messages.DEVICE_UPDATE_SUCCESS
        );
        //console.log('RESP updateItem: ', res.status);
      } catch (err) {
        utils.alert(this.myAlert, 'error', utils.messages.DEVICE_UPDATE_ERROR);
      }
    },

    async deleteItemConfirm() {
      this.cargando = true;
      let params = [this.users.user.token];
      params.push(this.projects.projectSelected._id);
      params.push(this.projects.groupSelected._id);
      let slist = this.devices.deviceSelected.sensors.filter((elem) => {
        return elem._id !== this.editedItem._id;
      });
      let body = {
        sensors: slist,
      };
      params.push(body);
      params.push(this.devices.deviceSelected._id);
      await this.updateItem(params);
      await this.loadSensors();
      this.cargando = false;
      this.closeDelete();
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
      this.cargando = true;
      let params = [this.users.user.token];
      params.push(this.projects.projectSelected._id);
      params.push(this.projects.groupSelected._id);
      let nsenList = [];
      if (this.editedIndex === -1) {
        console.log('[INFO] - Creating a new sensor');
        nsenList = this.addSensor();
      } else {
        console.log('[INFO] - Modifying a sensor');
        nsenList = this.updateSensorList();
      }
      let body = {
        sensors: nsenList,
      };
      params.push(body);
      params.push(this.devices.deviceSelected._id);
      await this.updateItem(params);
      await this.loadSensors();
      this.cargando = false;
      this.close();
    },

    addSensor() {
      let slist = this.devices.deviceSelected.sensors;
      if (slist && slist.length > 0) {
        slist.push(this.editedItem);
      } else {
        // List empty, firts sensor in list
        slist = [
          {
            name: this.editedItem.name,
            unit: this.editedItem.unit,
            symbol: this.editedItem.symbol,
          },
        ];
      }
      return slist;
    },

    updateSensorList() {
      let slist = this.devices.deviceSelected.sensors;
      slist.find((item) => {
        if (item._id === this.editedItem._id) {
          item.name = this.editedItem.name;
          item.unit = this.editedItem.unit;
          item.symbol = this.editedItem.symbol;
        }
      });
      return slist;
    },

    async loadSensors() {
      let params = [this.users.user.token];
      const idPro = this.devices.deviceSelected.project._id;
      const idGrp = this.devices.deviceSelected.group._id
        ? this.devices.deviceSelected.group._id
        : this.devices.deviceSelected.group;

      const idDev = this.$route.params.idDevice;
      params.push(idPro);
      params.push(idGrp);
      params.push(idDev);
      try {
        const res = await this.$store.dispatch('devices/getDevice', params);
        return res;
      } catch (err) {
        console.log('Fallo al carga el dispositivo: ', err);
      }
    },

    loadCordinates() {
      const defCoor = [2.9862918733796486, 39.57380640335257];
      this.coordinates = defCoor;
      const location = this.devices.deviceSelected.location;

      if (
        location &&
        location.coordinates &&
        location.coordinates.length === 2
      ) {
        this.coordinates = location.coordinates;
      }
    },

    async onMapLoad(event) {
      const asyncActions = event.component.actions;

      const newParams = await asyncActions.flyTo({
        center: this.coordinates,
        zoom: 8,
        speed: 1,
      });
    },
  },
  async created() {
    const rs = await this.loadSensors();
    this.loadCordinates();
    this.mapbox = Mapbox;
  },
};
</script>

<style></style>
