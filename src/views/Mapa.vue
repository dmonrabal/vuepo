<template>
  <v-container>
    <Loading :loading="cargando"></Loading>
    <Title
      :title="'Mapa'"
      :color="'secondary--text'"
      :path="`Home / Mapa /`"
    ></Title>
    <v-row>
      <v-col cols="12" lg="9">
        <MglMap
          :accessToken="accessToken"
          :mapStyle="mapStyle"
          :center="coordinates"
          @load="onMapLoad"
        >
          <MglMarker
            v-for="device in devFiltr"
            :coordinates.sync="device.location.coordinates"
            color="blue"
            :key="device._id"
          >
            <MglPopup anchor="bottom-right">
              <v-card outlined width="200" height="80">
                Project: {{ device.project.name }} Group:{{
                  device.group.name
                }}
                Device: {{ device.label }}
                <v-icon
                  size="20"
                  class="ml-5 mt-2"
                  color="primary"
                  @click="viewInfo(device)"
                  title="Consultar"
                >
                  fas fa-search
                </v-icon>
              </v-card>
            </MglPopup>
          </MglMarker>

          <!--MglMarker :coordinates.sync="coordinates" color="blue" /-->
        </MglMap>
      </v-col>
      <v-col cols="12" lg="3">
        <v-card class="pa-5 pl-10 pr-10 mb-2" outlined tile height="800">
          <v-row>
            <v-card-title class="text-h6 font-weight-light"
              >Filtros</v-card-title
            >
            <v-divider></v-divider>
            <v-col cols="12"
              ><v-select
                :items="proItems"
                dense
                label="Elige un proyecto"
                v-model="proSel"
                @input="loadGroups"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                ref="grpMenu"
                :items="grpItems"
                dense
                :label="labelGrp"
                v-model="grpSel"
                :disabled="grpDis"
                @input="loadDevices"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                :items="devItems"
                dense
                :label="labelDev"
                v-model="devSel"
                :disabled="devDis"
                @click="enableFilter"
              ></v-select>
            </v-col>
            <v-col cols="12" align="right">
              <v-btn
                class="ma-2 text-capitalize font-weight-ligth"
                color="primary"
                dark
                width="30%"
                :disabled="btnDis"
                @click="filterDevices"
              >
                Filtrar
              </v-btn>
            </v-col>
            <v-card-title class="text-h6 font-weight-light"
              >Detalle</v-card-title
            >
            <v-divider></v-divider>

            <div v-if="!devDetail">
              <v-card-subtitle class="ml-5 pa-2 font-weight-light">
                Ningún dispositivo seleccionado
              </v-card-subtitle>
            </div>
            <div v-if="devDetail">
              <v-list dense>
                <v-list-item
                  v-for="(sensor, _id) in devDetail.sensors"
                  :key="_id"
                >
                  <v-list-item-content>
                    <v-list-item-title class="text-overline">
                      {{ sensor.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      class="text-h6 font-weight-light grey--text ml-8 mt-2"
                    >
                      22 {{ sensor.symbol }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <!-- <v-list-item three-line>
                <v-list-item-content>
                  <div class="text-overline mb-4">{{ devDetail.name }}</div>
                  <v-list-item-title class="text-h6 mb-1">
                    {{ devDetail.label }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{
                    devDetail.description
                  }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon size="50">fas fa-plus</v-icon>
              </v-list-item>
              <v-list-item three-line>
                <v-list-item-content>
                  <div class="text-overline">{{ devDetail.name }}</div>
                  <div class="text-subtitle-1">{{ devDetail.name }}</div>
                  <v-list-item-title class="text-subtitle-1 mb-1">
                    {{ devDetail.label }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{
                    devDetail.description
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item> -->
              <!--               
              <v-card-title class="text-subtitle-1 grey--text">
                Nombre
              {{ devDetail.name }}
              </v-card-title>
              <v-card-title class="text-subtitle-1 grey--text">
                Etiqueta
              </v-card-title>
              <v-card-title class="text-subtitle-1 grey--text">
                Tecnología
              </v-card-title>

              {{ devDetail.label }}
              {{ devDetail.technology }} -->
            </div>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Title from '@/components/Title';
import Loading from '@/components/Loading';
import { mapState } from 'vuex';

import Mapbox from 'mapbox-gl';
import { MglMap, MglMarker, MglPopup } from 'vue-mapbox';

export default {
  data() {
    return {
      cargando: false,
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      mapStyle: 'mapbox://styles/mapbox/satellite-v9',
      coordinates: [2.9862918733796486, 39.57380640335257],
      devDetail: '',

      devInit: [],
      devFiltr: [],
      proItems: [],
      grpItems: [],
      devItems: [],
      senItems: [],
      datItems: [],
      dateReq: [],

      labelGrp: 'Elige un grupo',
      labelDev: 'Elige un dispositivo',

      menu: false,

      proSel: '',
      grpSel: '',
      devSel: '',
      senSel: '',

      grpDis: true,
      devDis: true,
      btnDis: true,

      showTable: false,
    };
  },
  components: {
    Title,
    Loading,
    MglMap,
    MglMarker,
    MglPopup,
  },
  computed: {
    ...mapState(['projects', 'groups', 'users', 'devices']),
  },
  methods: {
    enableFilter() {
      this.btnDis = false;
    },

    /**
     * This method is used for get group info in devices objects.
     * By default, each device only contains _id group field.
     * In order to provide update and create functions, is
     * necessary dispose this info in forms.
     */
    populateProGrp() {
      // Group treatment Get idGroup and name
      const ldevPop = []; //

      this.devices.devicesList.forEach((dev) => {
        const idPro = dev.project._id;
        const idGrp = dev.group;
        const pro = this.projects.projectList.find(
          (item) => item._id === idPro
        );
        const grp = pro.groups.find((item) => item._id === idGrp);
        if (!pro || !grp) {
          console.log('MALLLLLL grupo o proyecto no encontrado!!!!');
        } else {
          delete dev.group;
          let ngrp = {
            _id: grp._id,
            name: grp.name,
            code: grp.code,
          };
          dev.group = ngrp;
        }
        ldevPop.push(dev);
        //console.log('DEV->', dev);
      });
      this.$store.dispatch('devices/passDevicesPopulated', ldevPop);

      this.devInit = this.devices.devicesList.filter((device) => {
        if (
          device.location &&
          device.location.coordinates &&
          device.location.coordinates.length === 2
        ) {
          return true;
        } else {
          return false;
        }
      });

      this.devFiltr = this.devInit;
    },

    async loadProjects() {
      try {
        const token = this.users.user.token;
        const res = await this.$store.dispatch('projects/getProjects', token);
        if (res.data.projects) {
          this.proItems = res.data.projects.map((p) => {
            return { text: p.name, value: p._id };
          });

          this.proItems.unshift({ text: 'Todos', value: 'all' });
        }
        //console.log('RESPUESTA: ', res);
        return res;
      } catch (err) {
        console.log('[ERROR] - loadProjects: ' + err.message);
      }
    },

    async loadAllDevices() {
      try {
        const token = this.users.user.token;
        let ids = this.projects.projectList.map((project) => project._id);
        const params = [token, ids];
        await this.$store.dispatch('devices/getAllDevPro', params);
        this.populateProGrp();
      } catch (e) {
        console.log('[ERROR] - LoadDevices: ' + e.message);
      }
    },

    loadGroups() {
      this.grpSel = 'all';
      this.devSel = 'all';
      this.labelGrp = 'Elige un grupo';
      this.labelDev = 'Elige un dispositivo';

      if (this.proSel === 'all') {
        this.devFiltr = this.devInit;
        return;
      }

      this.grpDis = false;
      this.devDis = true;
      this.btnDis = true;
      this.grpItems = [];
      this.devItems = [];

      //console.log('Project id selected: ', this.proSel);
      this.projects.projectList.forEach((p) => {
        if (p._id === this.proSel) {
          this.grpItems = p.groups.map((g) => {
            return { text: g.name, value: g._id };
          });

          this.grpItems.unshift({ text: 'Todos', value: 'all' });
        }
      });
    },

    async loadDevices() {
      if (this.grpSel === 'all') {
        this.devSel = 'all';
        this.devDis = true;
        this.btnDis = false;
        return;
      }

      this.devDis = false;
      this.btnDis = true;

      try {
        let params = [this.users.user.token];
        params.push(this.proSel);
        params.push(this.grpSel);
        const res = await this.$store.dispatch(
          'devices/getDevicesGroup',
          params
        );

        if (res.data.devices) {
          this.devItems = res.data.devices.map((d) => {
            return { text: d.name, value: d._id };
          });
          this.devItems.unshift({ text: 'Todos', value: 'all' });
        }
        return res;
      } catch (err) {
        console.log('[ERROR] - loadDevices: ' + err.message);
      }
    },

    filterDevices() {
      this.devFiltr = this.devInit;
      this.devDetail = '';

      if (this.proSel !== 'all') {
        this.devFiltr = this.devFiltr.filter((device) => {
          //console.log('-------> Project filtered: ', device.project._id);
          if (device.project._id === this.proSel) {
            console.log('Project found: ', device.project._id);
            return true;
          } else {
            return false;
          }
        });

        if (this.grpSel !== 'all') {
          this.devFiltr = this.devFiltr.filter((device) => {
            //console.log('-------> Group filtered: ', device.group._id);
            if (device.group._id === this.grpSel) {
              console.log('Group found: ', device.group._id);
              return true;
            } else {
              return false;
            }
          });

          if (this.devSel !== 'all') {
            this.devFiltr = this.devFiltr.filter((device) => {
              //console.log('-------> Device filtered: ', device._id);
              if (device._id === this.devSel) {
                console.log('Device found: ', device._id);
                return true;
              } else {
                return false;
              }
            });
          }
        }
      } else {
        this.devFiltr = this.devInit;
      }
    },

    loadCoordinates() {
      const defCoor = [2.9862918733796486, 39.57380640335257];
      this.coordinates = defCoor;

      this.devFiltr = this.devices.devicesList.filter((device) => {
        if (
          device.location &&
          device.location.coordinates &&
          device.location.coordinates.length === 2
        ) {
          return true;
        } else {
          return false;
        }
      });
    },

    async onMapLoad(event) {
      const asyncActions = event.component.actions;

      const newParams = await asyncActions.flyTo({
        center: this.coordinates,
        zoom: 10,
        speed: 1,
      });
    },

    viewInfo(device) {
      this.devDetail = device;
    },
  },

  async created() {
    await this.loadProjects();
    this.loadAllDevices();
    this.loadCoordinates();
    this.mapbox = Mapbox;
  },
};
</script>

<style scopped>
.flexcard {
  display: flex;
  flex-direction: column;
}

.flexcard .v-toolbar {
  flex: 0;
}
</style>
