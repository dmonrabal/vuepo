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
      <v-col cols="12" md="4" sm="6">
        <v-card class="pa-4 text-center" outlined tile>
          <apexchart
            type="bar"
            :options="optionsA"
            :series="seriesA"
          ></apexchart>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="4"
        sm="6"
        v-for="chart in charts.chartList"
        :key="chart.id"
      >
        <v-card class="pa-4 text-center" outlined tile>
          <apexchart
            :type="chart.type"
            :options="chart.options"
            :series="chart.series"
          ></apexchart>
          <v-card-text>
            <v-icon
              class="mr-2"
              color="warning"
              @click="editChart(chart)"
              title="Editar"
              size="20"
            >
              fas fa-pencil-alt
            </v-icon>
            <v-icon
              color="error"
              @click="deleteChart(chart)"
              title="Eliminar"
              size="20"
            >
              fas fa-trash
            </v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="flex-row-reverse">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="1500px"
        max-height="1500px"
      >
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
                  <v-col cols="12" sm="4">
                    <v-radio-group v-model="editedChart.type" mandatory>
                      <v-radio label="Line" value="line"></v-radio>
                      <v-icon color="primary" size="80" class="mb-2"
                        >mdi-chart-line</v-icon
                      >
                      <v-radio label="Bar" value="bar"></v-radio>
                      <v-icon color="success" size="80" class="mb-2"
                        >mdi-chart-bar</v-icon
                      >
                      <v-radio label="Pie" value="pie"></v-radio>
                      <v-icon color="warning" size="80" class="mb-2"
                        >mdi-chart-pie</v-icon
                      >
                      <v-radio label="Area" value="area"></v-radio>
                      <v-icon color="purple" size="80" class="mb-2"
                        >mdi-chart-areaspline</v-icon
                      >
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12" sm="4" class="justify-conten">
                    <span class="text-h6 font-weight-light"
                      >Periodo de las series</span
                    >
                    <v-radio-group v-model="editedChart.period" mandatory>
                      <v-radio label="1h" value="0"></v-radio>
                      <v-radio label="24h" value="1"></v-radio>
                      <v-radio label="Última semana" value="2"></v-radio>
                      <v-radio label="Entre fechas" value="3"></v-radio>
                    </v-radio-group>
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="editedChart.dateReq"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedChart.dateReq"
                          label="Rango de fechas"
                          prepend-icon="far fa-calendar alt"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :disabled="editedChart.period !== '3'"
                          class="mb-5 pr-10"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedChart.dateReq"
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
                            $refs.menu.save(editedChart.dateReq);
                            toEnaBtn();
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                    <span class="text-h6 font-weight-light"
                      >Series del gráfico
                    </span>
                    <span class="ml-2">
                      <small v-if="seriesChart.length === 0"
                        >No hay series</small
                      >
                    </span>
                    <v-btn
                      small
                      color="primary"
                      dark
                      elevation="8"
                      fab
                      class="ml-5"
                      @click="menuCharts = true"
                      v-if="!menuCharts"
                      :disabled="seriesChart.length === 3"
                    >
                      <v-icon small>fas fa-plus</v-icon>
                    </v-btn>
                    <small
                      class="ml-2"
                      v-if="!menuCharts && seriesChart.length !== 3"
                      >Añade una serie (Máximo 3)</small
                    >

                    <v-list shaped class="mt-5">
                      <v-list-item-group v-model="editedSerie" color="primary">
                        <v-list-item
                          v-for="(serie, id) in seriesChart"
                          :key="id"
                          :color="serie.color"
                        >
                          <v-icon :color="serie.color" class="mr-5" size="25"
                            >mdi-chart-timeline-variant</v-icon
                          >
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="serie.name"
                            ></v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-btn small fab @click="loadSerie(serie)">
                              <v-icon color="success">mdi-pencil-circle</v-icon>
                            </v-btn>
                            <v-btn
                              small
                              fab
                              @click="deleteSerie(serie)"
                              class="ml-2"
                            >
                              <v-icon color="red"
                                >mdi-delete-circle-outline</v-icon
                              >
                            </v-btn>
                          </v-list-item-icon>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-col>

                  <v-col cols="12" sm="4" class="justify-content">
                    <div v-if="menuCharts">
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
                        class="mt-5"
                      ></v-select>
                      <v-select
                        :items="devItems"
                        dense
                        label="Elige un dispositivo"
                        v-model="devSel"
                        :disabled="devDis"
                        @input="loadSensors"
                        class="mt-5"
                      ></v-select>
                      <v-select
                        :items="senItems"
                        dense
                        label="Elige los sensores"
                        chips
                        v-model="senSel"
                        :disabled="devDis"
                        class="mt-5"
                      >
                      </v-select>
                      <v-text-field
                        label="Nombre de la serie"
                        v-model="namSel"
                        :rules="rules.name"
                        :disabled="senSel === ''"
                        required
                      ></v-text-field>
                      <span
                        v-if="namSel !== ''"
                        class="mt-10 text-h7 font-weight-light"
                        >Color de la serie
                      </span>
                      <v-color-picker
                        v-if="namSel !== ''"
                        v-model="colSel"
                        class="ma-2"
                        hide-canvas
                      ></v-color-picker>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          icon
                          color="success"
                          @click="addSerie()"
                          :disabled="senSel === ''"
                          v-if="this.editSerieMode === false"
                        >
                          <v-icon>mdi-plus-thick</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          color="success"
                          @click="updateSerie()"
                          :disabled="senSel === ''"
                          v-if="this.editSerieMode"
                        >
                          <v-icon>mdi-check</v-icon>
                        </v-btn>
                        <v-btn icon color="red" @click="closeMenuSeries">
                          <v-icon>mdi-export</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </div>
                  </v-col>
                  <v-col cols="12" v-if="menuCharts"> </v-col>
                </v-row>
              </v-container>
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
    </v-row>
  </div>
</template>
<script>
import Title from '@/components/Title';
import Loading from '@/components/Loading';
import VueApexCharts from 'vue-apexcharts';
import ApexCharts from 'apexcharts';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Dashboard',
  // mounted: function () {
  //   window.setInterval(() => {
  //     //this.reloadCharts();
  //     this.timeSeries();
  //   }, 15000);
  // },

  data() {
    return {
      // Form data
      dialog: false,
      dialogDelete: false,
      menuCharts: false,
      cargando: false,
      editMode: false,
      editSerieMode: false,

      // Charts data
      editedIndex: -1,
      editedChart: {
        id: '',
        type: '',
        period: '0',
        dateReq: [],
        options: '',
        series: '',
      },
      defaultChart: {
        id: '',
        type: '',
        period: '0',
        dateReq: [],
        options: '',
        series: '',
      },
      seriesChart: [],
      editedSerie: {
        id: '',
        name: '',
        color: '',
        data: '', 
        elements: {
          project: '',
          group: '',
          device: '',
          sensor: ''
        }
      },

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
      // dateReq: [],

      proSel: '',
      grpSel: '',
      devSel: '',
      senSel: '',
      namSel: '',
      colSel: '',
      menu: false,

      grpDis: true,
      devDis: true,
      senDis: true,
      btnDis: true,

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
          color: '#FF00FF',
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
        {
          name: 'series-2',
          data: [10, 20, 25, 65, 21, 30, 55, 60],
        },
      ],

      optionsA: {
        chart: {
          id: 'vuechart-example00',
        },
        stroke: {
          curve: 'smooth',
        },
        markers: {
          size: 2,
        },
      },
      seriesA: [
        {
          name: 'series-1',
          data: [
            { x: '2020-12-01T08:16:53.532Z', y: 54 },
            { x: '2020-12-01T15:52:44.674Z', y: 17 },
            { x: '2020-12-01T19:53:40.747Z', y: 13 },
            { x: '2020-12-01T20:53:40.747Z', y: 17 },
            { x: '2020-12-01T21:53:40.747Z', y: 30 },
            { x: '2020-12-01T22:53:40.747Z', y: 26 },
          ],
        },
        {
          name: 'series-1',
          data: [
            { x: '2020-12-01T08:16:53.532Z', y: 54 },
            { x: '2020-12-01T15:52:44.674Z', y: 17 },
            { x: '2020-12-01T19:53:40.747Z', y: 13 },
            { x: '2020-12-01T19:54:40.747Z', y: 13 },
            { x: '2020-12-01T19:55:40.747Z', y: 13 },
            { x: '2020-12-01T20:56:40.747Z', y: 17 },
          ],
        },
      ],
    };
  },
  components: {
    Title,
    Loading,
  },
  computed: {
    ...mapState(['projects', 'users', 'devices', 'charts']),
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
    async timeSeries() {
      this.seriesA.forEach((serie) => {
        console.log('Lanzado!');
        serie.data.push({ x: new Date().toISOString(), y: 26 });
      });

      ApexCharts.exec('vuechart-example00', 'updateSeries', [
        { data: this.seriesA[0].data },
        { data: this.seriesA[1].data },
      ]);
    },

    async reloadCharts() {
      // // //console.log('HEELLLOOOOOO');
      // // const charts = this.charts.chartList.filter((chart) => {
      // //   return chart.period !== 3;
      // // });
      // // charts.forEach((chart) => {
      // //   // Populate data series
      // //   await Promise.all(
      // //     chart.series.map(async (serie) => {
      // //       serie.data = [];
      // //       // TODO get APITOKEN from device
      // //       let params = ['xytVxvDJSD7Qqse1VOKdd'];
      // //       params.push(serie.elements.device);
      // //       params.push(serie.elements.sensor);
      // //       params.push(dateFrom);
      // //       params.push(dateTo);
      // //       const dta = await this.getData(params);
      // //       console.log('RESSSSS -> ', dta);
      // //       if (dta.series.length > 0) {
      // //         console.log('EO: ', dta.series);
      // //         // Only check first serie
      // //         const ds = dta.series[0];
      // //         ds.samples.forEach((s) => {
      // //           serie.data.push({ x: s.date, y: s.value });
      // //         });
      // //       }
      // //       chart.series.push(serie);
      // //     })
      // //   );
      // });
    },

    addSerie() {
      let nserie = {};
      nserie.id = 'id' + Math.random().toString(16).slice(2);
      nserie.name = this.namSel;
      nserie.color = this.colSel;
      nserie.elements = {
        project: this.proSel,
        group: this.grpSel,
        device: this.devSel,
        sensor: this.senSel,
      };

      this.seriesChart.push(nserie);
      console.log('Llamando a addSerie: ', this.seriesChart);
      this.closeMenuSeries();
    },

    updateSerie() {
      console.log('[UpdateSerie]', this.editedSerie);
      this.seriesChart.forEach((s) => {
        if (this.editedSerie.id === s.id) {
          console.log('Localizado');
          s = this.editedSerie;
          return;
        }
      });
  },

    async loadSerie(serie) {
      // TODO
      console.log('Esta es la serie: ', serie);
      this.grpDis = false;
      this.devDis = false;
      this.senDis = false;
      this.proSel = serie.elements.project;
      this.grpSel = serie.elements.group;
      this.devSel = serie.elements.device;
      this.namSel = serie.name;
      this.colSel = serie.color;
      this.menuCharts = true;
      this.editSerieMode = true;
      this.editedSerie = serie;
      this.loadGroups();
      const rs = await this.loadDevices();
      const rss = await this.loadSensors();
      this.senSel = serie.elements.sensor;

      this.editedSerie = Object.assign({}, serie);
      //this.closeMenuSeries();
    },

    deleteSerie(serie) {
      this.seriesChart = this.seriesChart.filter((s) => {
        return serie.id !== s.id;
      });

      this.closeMenuSeries();
    },

    closeMenuSeries() {
      this.proSel = '';
      this.grpSel = '';
      this.devSel = '';
      this.senSel = '';
      this.namSel = '';
      this.colSel = '';
      this.menuCharts = false;
      this.editSerieMode = false;
    },

    editChart(item) {
      this.editedIndex = this.charts.chartList.indexOf(item);
      this.editedChart = Object.assign({}, item);
      this.seriesChart = item.series;
      this.editMode = true;
      this.dialog = true;
    },

    deleteChart(chart) {
      this.editedIndex = this.charts.chartList.indexOf(chart);
      this.editedChart = chart;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.cargando = true;
      const rs = await this.$store.dispatch(
        'charts/deleteChart',
        this.editedChart
      );
      this.cargando = false;
      this.dialogDelete = false;
    },

    close() {
      this.dialog = false;
      this.closeMenuSeries();
      this.seriesChart = [];
      this.$nextTick(() => {
        this.editedChart = Object.assign({}, this.defaultChart);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.closeMenuSeries();
      this.$nextTick(() => {
        this.editedChart = Object.assign({}, this.defaultChart);
        this.editedIndex = -1;
      });
    },

    async createChart() {
      // First create a series data
      let chart = {};
      chart.id = this.editMode
        ? this.editedChart.id
        : 'id' + Math.random().toString(16).slice(2);
      chart.type = this.editedChart.type;
      chart.period = this.editedChart.period;
      chart.options = {
        chart: {
          id: 'vuechart-example',
        },
        stroke: {
          curve: 'smooth',
        },
        markers: {
          size: 2,
        },
      };

      if (chart.period === '3') {
        chart.dateReq = this.editedChart.dateReq;
      } else {
        chart.dateReq = this.calculateDates(chart.period);
      }

      chart.series = [];
      await Promise.all(
        this.seriesChart.map(async (serie) => {
          serie.data = [];
          // TODO get APITOKEN from device
          let params = ['xytVxvDJSD7Qqse1VOKdd'];
          params.push(serie.elements.device);
          params.push(serie.elements.sensor);
          params.push(chart.dateReq[0]);
          params.push(chart.dateReq[1]);

          const dta = await this.getData(params);
         // console.log('RESSSSS -> ', dta);
          if (dta.series.length > 0) {
           // console.log('EO: ', dta.series);
            // Only check first serie
            const ds = dta.series[0];
            ds.samples.forEach((s) => {
              serie.data.push({ x: s.date, y: s.value });
            });
          }
          chart.series.push(serie);
        })
      );

      //console.log('Chart enviado ', chart);
      this.$store.dispatch('charts/addChart', chart);
    },

    async createChart2() {
      // First create a series data
      let chart = {};
      chart.id = 'id' + Math.random().toString(16).slice(2);
      chart.type = this.editedChart.type;
      chart.dateReq = ['', ''];
      chart.period = this.editedChart.period;
      chart.options = {
        chart: {
          id: 'vuechart-example',
        },
        stroke: {
          curve: 'smooth',
        },
        markers: {
          size: 2,
        },
      };

      let dateFrom = '';
      let dateTo = '';
      let dateOffsetDay = 24 * 60 * 60 * 1000;
      console.log(this.editedChart.period);

      if (this.editedChart.period === '3') {
        dateFrom = this.editedChart.dateReq[0];
        dateTo = this.editedChart.dateReq[1];
        //chart.period = '3';
        chart.dateReq[0] = dateFrom;
        chart.dateReq[1] = dateTo;
      } else if (this.editedChart.period === '2') {
        // From 1 week ago
        dateOffsetDay *= 7;
        dateFrom = new Date();
        dateFrom.setTime(dateFrom.getTime() - dateOffsetDay);
        dateTo = '';
        //chart.period = '2';
      } else if (this.editedChart.period === '1') {
        // Last 24 hours
        //chart.period = '1';
        dateFrom = new Date();
        dateFrom.setTime(dateFrom.getTime() - dateOffsetDay);
        dateTo = '';
      } else {
        //chart.period = '0';
        // 0 Last 24H by default with no dates specified
        // Nothing to do
      }

      console.log('Las fechas FROM-TO: ', dateFrom, ' ', dateTo);

      // Populate data series
      chart.series = [];
      await Promise.all(
        this.seriesChart.map(async (serie) => {
          serie.data = [];
          // TODO get APITOKEN from device
          let params = ['xytVxvDJSD7Qqse1VOKdd'];
          params.push(serie.elements.device);
          params.push(serie.elements.sensor);
          params.push(dateFrom);
          params.push(dateTo);

          const dta = await this.getData(params);
          console.log('RESSSSS -> ', dta);
          if (dta.series.length > 0) {
            console.log('EO: ', dta.series);
            // Only check first serie
            const ds = dta.series[0];
            ds.samples.forEach((s) => {
              serie.data.push({ x: s.date, y: s.value });
            });
          }
          chart.series.push(serie);
        })
      );

      //console.log('Chart enviado ', chart);
      this.$store.dispatch('charts/addChart', chart);
    },

    calculateDates(period) {
      let dateFrom = '';
      let dateTo = '';
      let dateOffsetDay = 24 * 60 * 60 * 1000;

      if (period === '2') {
        // From 1 week ago
        dateOffsetDay *= 7;
        dateFrom = new Date();
        dateFrom.setTime(dateFrom.getTime() - dateOffsetDay);
        dateTo = '';
      } else if (period === '1') {
        // Last 24 hours
        dateFrom = new Date();
        dateFrom.setTime(dateFrom.getTime() - dateOffsetDay);
        dateTo = '';
      } else {
        // 0 Last 24H by default Nothing to do
      }
      //console.log('Las fechas FROM-TO: ', dateFrom, ' ', dateTo);
      const dates = [dateFrom, dateTo];
      return dates;
    },

    /**
     *  Pass object to query for data
     *  apiToken  params[0]
     *  idDevice  params[1]
     *  idSensor  params[2]
     *  dateFrom  params[3] Can be null
     *  dateTo    params[4] Can be null
     */
    async getData(params) {
      try {
        const res = await this.$store.dispatch('charts/getData', params);
        console.log('RES DATA: ', res);
        return res;
      } catch (err) {
        console.log('[ERROR] - getData', err.message);
      }
    },

    async save() {
      this.cargando = true;
      this.createChart();
      this.closeMenuSeries();
      this.seriesChart = [];
      this.editedChart = Object.assign({}, this.defaultChart);
      this.editMode = false;
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
      this.btnDis = true;
      this.grpItems = [];
      this.devItems = [];

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
      this.senItems = [];

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

    toEnaBtn() {
      this.btnDis = false;
    },

    async loadSensors() {
      this.senSel = '';
      this.senDis = false;
      this.btnDis = true;

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
  },

  async created() {
    const prj = await this.loadProjects();
  },
};
</script>

<style></style>
