<template>
  <v-container>
    <Loading :loading="cargando"></Loading>
    <Title
      :title="'Mapa'"
      :color="'secondary--text'"
      :path="`Home / Mapa /`"
    ></Title>
    <v-row>
      <v-col cols="9">
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
      <v-col cols="3">
        <v-card class="pa-5 mb-2" outlined tile height="800"> sfsd </v-card>
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
      mapStyle: 'mapbox://styles/mapbox/light-v10',
      coordinates: [2.9862918733796486, 39.57380640335257],
    };
  },
  components: {
    Title,
    Loading,
    MglMap,
    MglMarker,
  },
  computed: {
    ...mapState(['projects', 'users', 'devices']),
  },
  methods: {
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

    async loadDevices() {
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

  created() {
    this.loadDevices();
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
