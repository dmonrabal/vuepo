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
                      <v-list-item-group color="primary">
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
                        v-model="editedSerie.elements.project"
                        @input="loadGroups"
                        class="mt-5"
                      ></v-select>
                      <v-select
                        ref="grpMenu"
                        :items="grpItems"
                        dense
                        label="Elige un grupo"
                        v-model="editedSerie.elements.group"
                        :disabled="grpDis"
                        @input="loadDevices"
                        class="mt-5"
                      ></v-select>
                      <v-select
                        :items="devItems"
                        dense
                        label="Elige un dispositivo"
                        v-model="editedSerie.elements.device"
                        :disabled="devDis"
                        @input="loadSensors"
                        class="mt-5"
                      ></v-select>
                      <v-select
                        :items="senItems"
                        dense
                        label="Elige los sensores"
                        chips
                        v-model="editedSerie.elements.sensor"
                        :disabled="devDis"
                        class="mt-5"
                      >
                      </v-select>
                      <v-text-field
                        label="Nombre de la serie"
                        v-model="editedSerie.name"
                        :rules="rules.name"
                        :disabled="editedSerie.elements.sensor === ''"
                        required
                      ></v-text-field>
                      <span
                        v-if="editedSerie.name !== ''"
                        class="mt-10 text-h7 font-weight-light"
                        >Color de la serie
                      </span>
                      <v-color-picker
                        v-if="editedSerie.name !== ''"
                        v-model="editedSerie.color"
                        class="ma-2"
                        hide-canvas
                      ></v-color-picker>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          icon
                          color="success"
                          @click="addSerie()"
                          :disabled="editedSerie.elements.sensor === ''"
                          v-if="!editSerieMode"
                        >
                          <v-icon>mdi-plus-thick</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          color="success"
                          @click="updateSerie()"
                          :disabled="editedSerie.elements.sensor === ''"
                          v-if="editSerieMode"
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
                @click="save()"
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
import utils from '@/plugins/utils';
import Loading from '@/components/Loading';
import VueApexCharts from 'vue-apexcharts';
import ApexCharts from 'apexcharts';
import { mapState, mapActions } from 'vuex';
//import moment from 'moment';

export default {
  name: 'Dashboard',
  mounted: function () {
    window.setInterval(() => {
      this.reloadCharts();
      //this.timeSeries();
    }, 200000);
  },

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
        data: [],
        elements: {
          project: '',
          group: '',
          device: '',
          sensor: '',
        },
      },
      defaultSerie: {
        id: '',
        name: '',
        color: '',
        data: [],
        elements: {
          project: '',
          group: '',
          device: '',
          sensor: '',
        },
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
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: 'datetime',
          //tickPlacement: 'between',
          categories: [
            '19 Jun 2017 02:30:00',
            '19 Jun 2017 03:30:00',
            '19 Jun 2017 04:30:00',
            '19 Jun 2017 05:30:00',
            '19 Jun 2017 06:30:00',
            '19 Jun 2017 07:30:00',
            '19 Jun 2017 08:30:00',
          ],
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: true,
            borderType: 'dotted',
          },
          tooltip: {
            enabled: false,
          },
          range: 7,
        },
        tooltip: {
          followCursor: true,
          theme: 'dark',
          x: { format: 'yyyy-MM-dd HH:mm:ss' },
        },
      },
      seriesA: [
        {
          name: 'series-1',
          data: [31, 40, 28, 51, 42, 109, 100],
        },
        {
          name: 'series-2',
          data: [11, 32, 45, 32, 34, 52, 41],
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
    /**
     * Realoads chart list with the last data on database
     * Only charts with periods 1H or 24H (last hour or last 24 hours)
     * will be updated.
     */
    async reloadCharts() {
      console.log('[RELOADING CHARTS .... ]');
      let isData = false;
      const charts = this.charts.chartList.filter((chart) => {
        return chart.period !== 3;
      });

      await Promise.all(
        charts.map(async (chart) => {
          chart.series.map(async (serie) => {
            //serie.data = [];

            // TODO get APITOKEN from device
            let params = ['xytVxvDJSD7Qqse1VOKdd'];
            params.push(serie.elements.device);
            params.push(serie.elements.sensor);
            params.push(chart.dateReq[0]);
            params.push(chart.dateReq[1]);

            const dta = await this.getData(params);
            if (dta.series.length > 0) {
              // Only check first serie
              const ds = dta.series[0];
              isData = true;
              ds.samples.forEach((s) => {
                serie.data.push({
                  x: utils.formatDate(new Date(s.date)),
                  y: s.value,
                });
              });
            } 

            //chart.series.push(serie);
            //console.log('SERIE DATA: ', serie.data);
            // ApexCharts.exec(serie.id, 'updateSeries', [{ data: serie.data }]);
          });
        })
      );
      if (charts.length > 0 && isData) {
        await this.uploadChartList();
      } else {
        console.log('[NO DATA!!]');
      }
    },

    addSerie() {
      this.editedSerie.id = 'id' + Math.random().toString(16).slice(2);
      this.editedSerie.data = [];
      this.seriesChart.push(this.editedSerie);
      this.closeMenuSeries();
    },

    updateSerie() {
      console.log('[UpdateSerie]', this.editedSerie);

      this.seriesChart = this.seriesChart.map((serie) => {
        if (serie.id === this.editedSerie.id) {
          serie.name = this.editedSerie.name;
          serie.color = this.editedSerie.color;
          serie.elements = this.editedSerie.elements;
        }
        return serie;
      });
      this.closeMenuSeries();
    },

    async loadSerie(serie) {
      //TODO

      this.editedSerie.id = serie.id;
      console.log('editedSerie: ', this.editedSerie);
      const rsp = await this.loadProjects();
      this.editedSerie.elements.project = serie.elements.project;

      this.grpDis = false;
      const rsg = await this.loadGroups();
      this.editedSerie.elements.group = serie.elements.group;

      this.devDis = false;
      const rsd = await this.loadDevices();
      this.editedSerie.elements.device = serie.elements.device;

      this.senDis = false;
      const rss = await this.loadSensors();
      this.editedSerie.elements.sensor = serie.elements.sensor;

      this.editedSerie.name = serie.name;
      this.editedSerie.color = serie.color;
      this.menuCharts = true;
      this.editSerieMode = true;

      //this.closeMenuSeries();
    },

    deleteSerie(serie) {
      this.seriesChart = this.seriesChart.filter((s) => {
        return serie.id !== s.id;
      });

      this.closeMenuSeries();
    },

    closeMenuSeries() {
      this.menuCharts = false;
      this.editSerieMode = false;
      this.editedSerie = Object.assign({}, this.defaultSerie);
      this.editedSerie.elements = Object.assign({}, this.defaultSerie.elements);
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
      const params = [this.editedChart];
      params.push(this.users.user.fireUID);
      const rs = await this.$store.dispatch('charts/deleteChart', params);
      console.log('[Firestore Response] - ', rs);
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
          id: chart.id,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          type: 'datetime',
          labels: {
            //format: 'yyyy-MM-dd HH:mm:ss' ,
            // formatter: function (timestamp) {
            //   return moment(new Date(timestamp)).format('MM-YYYY');
            // },
          },
        },
        tooltip: {
          followCursor: true,
          theme: 'light',
          x: { format: 'yyyy-MM-dd HH:mm:ss' },
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
              serie.data.push({
                //x: new Date(s.date).getTime(),
                x: utils.formatDate(new Date(s.date)),
                y: s.value,
              });
            });
          }
          chart.series.push(serie);
        })
      );

      //console.log('Chart enviado ', chart);
      const params = [chart];
      params.push(this.users.user.fireUID);
      const rs = await this.$store.dispatch('charts/addChart', params);
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

    async getChartListFireBase() {
      try {
        const res = await this.$store.dispatch('charts/getChartsFireBase');
        //console.log('RES DATA: ', res);
        return res;
      } catch (err) {
        console.log('[ERROR] - getData', err.message);
      }
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
        //console.log('RES DATA: ', res);
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
        if (p._id === this.editedSerie.elements.project) {
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
        params.push(this.editedSerie.elements.project);
        params.push(this.editedSerie.elements.group);
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
      this.editedSerie.elements.sensor = '';
      this.senDis = false;
      this.btnDis = true;

      try {
        let params = [this.users.user.token];
        params.push(this.editedSerie.elements.project);
        params.push(this.editedSerie.elements.group);
        params.push(this.editedSerie.elements.device);
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

    /**
     *  Uploads chartlist on firebase database
     */
    async uploadChartList() {
      const params = [this.users.user.fireUID];
      try {
        const rs = await this.$store.dispatch(
          'charts/updateChartfireBase',
          params
        );
        console.log('[uploadChartList] - DONE');
        return rs;
      } catch (err) {
        console.log('[ERROR] - uploadChartList: ' + err.message);
      }
    },
  },

  async created() {
    const prj = await this.loadProjects();
  },
};
</script>

<style></style>
