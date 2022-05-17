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
            v-for="device in devices.devicesList"
            :coordinates.sync="device.location.coordinates"
            color="blue"
            :key="device._id"
          />

          <!--MglMarker :coordinates.sync="coordinates" color="blue" /-->
        </MglMap>
      </v-col>
      <v-col cols="12" lg="3">
        <v-card class="pa-10 mb-2" outlined tile height="800">
          <v-row>
            <v-col cols="12"
              ><v-select
                :items="proItems"
                dense
                label="Elige un proyecto"
                v-model="proSel"
                @input="loadGroups"
                class="mt-5"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                ref="grpMenu"
                :items="grpItems"
                dense
                label="Elige un grupo"
                v-model="grpSel"
                :disabled="grpDis"
                @input="loadDevices"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                :items="devItems"
                dense
                label="Elige un dispositivo"
                v-model="devSel"
                :disabled="devDis"
                @click="enableFilter"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-btn
                class="ma-2 text-capitalize font-weight-light"
                color="primary"
                dark
                width="30%"
                :disabled="btnDis"
                @click="filterDevices"
              >
                Filtrar
              </v-btn>
            </v-col>
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
import { MglMap, MglMarker } from 'vue-mapbox';

export default {
  data() {
    return {
      cargando: false,
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      mapStyle: 'mapbox://styles/mapbox/satellite-v9',
      coordinates: [2.9862918733796486, 39.57380640335257],

      devFiltr: [],
      proItems: [],
      grpItems: [],
      devItems: [],
      senItems: [],
      datItems: [],
      dateReq: [],

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
  },
  computed: {
    ...mapState(['projects', 'groups', 'users', 'devices']),
  },
  methods: {

    enableFilter() {
      this.btnDis = false;
      console.log('Pulsado!!!!!');
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
    },

    async loadProjects() {
      try {
        const token = this.users.user.token;
        const res = await this.$store.dispatch('projects/getProjects', token);
        if (res.data.projects) {
          this.proItems = res.data.projects.map((p) => {
            return { text: p.name, value: p._id };
          });
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

    async loadProjects() {
      try {
        const token = this.users.user.token;
        const res = await this.$store.dispatch('projects/getProjects', token);
        if (res.data.projects) {
          this.proItems = res.data.projects.map((p) => {
            return { text: p.name, value: p._id };
          });
        }
        //console.log('RESPUESTA: ', res);
        return res;
      } catch (err) {
        console.log('[ERROR] - loadProjects: ' + err.message);
      }
    },

    loadGroups() {
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
        }
      });
    },

    async loadDevices() {
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

        //console.log('DEVICES: ', res, 'params: ', params);
        if (res.data.devices) {
          this.devItems = res.data.devices.map((d) => {
            return { text: d.name, value: d._id };
          });
        }
        return res;
      } catch (err) {
        console.log('[ERROR] - loadDevices: ' + err.message);
      }
    },

    filterDevices() {
      console.log("Filtrar!!!!");
    
    },


    loadCoordinates() {
      const defCoor = [2.9862918733796486, 39.57380640335257];
      this.coordinates = defCoor;
      // const location = this.devices.deviceSelected.location;

      // if (location && location.coordinates && location.coordinates.length === 2) {
      //   this.coordinates = location.coordinates;
      // }
    },

    async onMapLoad(event) {
      const asyncActions = event.component.actions;

      const newParams = await asyncActions.flyTo({
        center: this.coordinates,
        zoom: 9,
        speed: 2,
      });
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
