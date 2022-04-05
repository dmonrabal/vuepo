<template>
  <div class="mt-2">
    <Loading :loading="cargando"></Loading>
    <Title
      :title="'Dashboard'"
      :color="'secondary--text'"
      :path="'Home / dashboard'"
    ></Title>

    <v-row>
      <v-col cols="12" md="4" sm="6">
        <v-card class="pa-4 text-center" outlined tile>
          <apexchart
            type="area"
            :options="options"
            :series="series"
          ></apexchart>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <v-card class="pa-4 text-center" outlined tile>
          <apexchart
            type="line"
            :options="options"
            :series="series"
          ></apexchart>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="6" v-for="chart in chartList" :key="chart.id">
        <v-card class="pa-4 text-center" outlined tile>
          <apexchart
            type="chart.type"
            :options="options"
            :series="series"
          ></apexchart>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="flex-row-reverse">
      <v-dialog v-model="dialog" persistent max-width="650px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            elevation="8"
            fab
            class="mt-15 mr-5"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>fas fa-plus</v-icon>
          </v-btn>
        </template>
        <v-form v-model="isFormValid">
          <v-card class="pa-5">
            <v-card-title>
              <span class="text-h5">Nuevo gráfico</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row class="pa-2">
                  <v-col cols="12" sm="6">
                    <!--v-card-title class="mb-0">Tipo </!--v-card-title-->
                    <v-radio-group v-model="editedChart.type" mandatory>
                      <v-radio label="Line" value="line"></v-radio>
                      <v-icon color="primary" size="100" class="mb-2"
                        >fa-thin fa-chart-line</v-icon
                      >
                      <v-radio label="Bar" value="bar"></v-radio>
                      <v-icon color="success" size="100" class="mb-2"
                        >fa-light fa-chart-bar</v-icon
                      >
                      <v-radio label="Pie" value="pie"></v-radio>
                      <v-icon color="warning" size="100" class="mb-2"
                        >fa-light fa-chart-pie</v-icon
                      >
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12" sm="6"
                    ><!--v-card-title class="mb-0">Elementos</!--v-card-title-->
                    <v-select
                      :items="proItems"
                      dense
                      label="Elige un proyecto"
                      v-model="proSel"
                      @input="loadGroups"
                      class="mt-5"
                    ></v-select>
                    <v-select
                      ref="grpMenu"
                      :items="grpItems"
                      dense
                      label="Elige un grupo"
                      v-model="grpSel"
                      :disabled="grpDis"
                      @input="loadDevices"
                      class="mt-10"
                    ></v-select>
                    <v-select
                      :items="devItems"
                      dense
                      label="Elige un dispositivo"
                      v-model="devSel"
                      :disabled="devDis"
                      @input="loadSensors"
                      class="mt-10"
                    ></v-select>
                    <v-select
                      :items="senItems"
                      dense
                      label="Elige los sensores"
                      multiple
                      chips
                      v-model="senSel"
                      :disabled="devDis"
                      @input="toEnaDates"
                      class="mt-10"
                    >
                    </v-select>
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="dateReq"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateReq"
                          label="Rango de fechas"
                          prepend-icon="far fa-calendar alt"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :disabled="fecDis"
                          class="mt-5"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="dateReq"
                        range
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.menu.save(dateReq);
                            toEnaBtn();
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="Nombre del gráfico"
                      v-model="editedChart.name"
                      :rules="rules.name"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Close </v-btn>
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
    </v-row>
  </div>
</template>
<script>
import Title from '@/components/Title';
import Loading from '@/components/Loading';
import VueApexCharts from 'vue-apexcharts';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Dashboard',
  data() {
    return {
      cargando: false,
      // Charts data
      chartList: [],
      typeChars: '',
      editedIndex: -1,
      editedChart: {
        name: '',
        type: '',
        options: '',
        series: '',
      },
      defaultChart: {
        name: '',
        type: '',
        options: '',
        series: '',
      },
      // Form data
      dialog: true,
      // Rules from
      rules: {
        name: [
          (v) => !!v || 'El campo es requerido',
          (v) =>
            (v && v.length >= 3 && v.length <= 40) ||
            'La nombre debe tener entre 3 y 40 caracteres',
        ],
      },
      isFormValid: false,
      proItems: [],
      grpItems: [],
      devItems: [],
      senItems: [],
      datItems: [],
      dateReq: [],

      proSel: '',
      grpSel: '',
      devSel: '',
      senSel: '',
      menu: false,

      grpDis: true,
      devDis: true,
      senDis: true,
      fecDis: true,
      btnDis: true,
      datDis: true,

      options: {
        chart: {
          id: 'vuechart-example',
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
        markers: {
          size: 0,
        },
      },
      series: [
        {
          name: 'series-1',
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
        {
          name: 'series-2',
          data: [10, 20, 25, 65, 21, 30, 55, 60],
        },
      ],
    };
  },
  components: {
    Title,
    Loading,
  },
  computed: {
    ...mapState(['projects', 'users']),
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
    createChart(series) {
      // First create a series data
      let char = {};
      series.forEach((serie) => {
        const sensor = serie.sensor;
        const data = [];
        serie.samples.forEach((sample) => {
          data.push([sample.date, sample.value]);
        });
        char.series.push({ name: sensor, data: data });
      });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedChart = Object.assign({}, this.defaultChart);
        this.editedIndex = -1;
      });
    },

    async save() {
      this.cargando = true;
      console.log('CALLING SAVE');
      console.log(
        'Project: ',
        this.proSel,
        ', Group: ',
        this.grpSel,
        ', Device: ',
        this.devSel,
        ', Sensor: ',
        this.senSel
      );
      console.log('Chart selected: ', this.editedChart);
      const res = await this.getData();
      this.createChart(res.series);
      this.cargando = false;
      this.close();
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
      this.senDis = true;
      this.fecDis = true;
      this.datDis = true;
      this.btnDis = true;
      this.expDatDis = true;

      this.grpItems = [];
      this.devItems = [];
      this.dateReq = [];

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
      this.senDis = true;
      this.btnDis = true;
      this.fecDis = true;
      this.datDis = true;
      this.expDatDis = true;

      this.senItems = [];
      this.dateReq = [];

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

    toEnaDates() {
      this.fecDis = false;
      console.log('Enabling dates!!!!');
    },

    toEnaBtn() {
      console.log('Enabling button!!!!');
      this.btnDis = false;
    },

    async loadSensors() {
      this.senSel = '';
      this.dateReq = [];

      this.senDis = false;
      this.fecDis = true;
      this.datDis = true;
      this.btnDis = true;
      this.expDatDis = true;

      try {
        let params = [this.users.user.token];
        params.push(this.proSel);
        params.push(this.grpSel);
        params.push(this.devSel);
        const res = await this.$store.dispatch('devices/getDevice', params);
        if (res.data.device.sensors) {
          this.senItems = res.data.device.sensors.map((s) => {
            return { text: s.name, value: s._id };
          });
        }
        //console.log('DEVICE: ', res, 'items: ', this.senItems);
        return res;
      } catch (err) {
        console.log('[ERROR] - loadDevices: ' + err.message);
      }
    },

    async getData() {
      let params = [this.users.user.token];
      params.push('xytVxvDJSD7Qqse1VOKdd');
      params.push(this.devSel);
      params.push(this.senSel.join(','));
      params.push(this.dateReq[0]);
      params.push(this.dateReq[1]);

      try {
        const res = await this.$store.dispatch('devices/getData', params);
        console.log('RES DATA: ', res);
        return res;
      } catch (err) {
        console.log('[ERROR] - getData', err.message);
      }
    },
  },
  async created() {
    const prj = await this.loadProjects();
    console.log(prj);
  },
};
</script>

<style></style>
