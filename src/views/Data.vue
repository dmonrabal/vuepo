<template>
  <div class="container">
    <Title
      :title="'Datos'"
      :color="'secondary--text'"
      :path="`Home / Datos /`"
    ></Title>
    <v-card class="pa-15 mb-2" outlined tile>
      <v-row>
        <v-col sm="12" md="6" lg="4">
          <v-select
            :items="proItems"
            dense
            label="Elige un proyecto"
            v-model="proSel"
            @input="loadGroups"
          ></v-select>
        </v-col>
        <v-col sm="12" md="6" lg="4">
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
        <v-col sm="12" md="6" lg="4">
          <v-select
            :items="devItems"
            dense
            label="Elige un dispositivo"
            v-model="devSel"
            :disabled="devDis"
            @input="loadSensors"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" md="6" lg="4">
          <v-select
            :items="senItems"
            dense
            label="Elige los sensores"
            multiple
            chips
            v-model="senSel"
            :disabled="devDis"
            @input="toEnaDates"
          >
          </v-select>
        </v-col>
        <v-col sm="12" md="6" lg="4">
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
                label="Selecciona un rango de fechas"
                prepend-icon="far fa-calendar alt"
                readonly
                v-bind="attrs"
                v-on="on"
                :disabled="fecDis"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dateReq" range no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
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
        <v-col sm="12" md="6" lg="4" align="left">
          <v-btn
            class="ma-2 text-capitalize font-weight-light"
            color="primary"
            dark
            width="30%"
            :disabled="btnDis"
            @click="loadData"
          >
            Consultar
          </v-btn>
          <v-icon
            class="ml-2"
            color="red"
            size="35"
            @click="loadocPDFData"
            title="Exportar"
            v-if="!expDatDis"
          >
            fas fa-file-pdf
          </v-icon>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="datItems"
            item-key="id"
            show-select
            v-if="showTable"
            :loading="loadDat"
            loading-text="Cargando... Espere por favor"
            @click="toEnaBtn"
          >
          </v-data-table>
        </v-col>
      </v-row>
      <v-row> </v-row>
    </v-card>
  </div>
</template>

<script>
import Title from '@/components/Title';
import { mapState } from 'vuex';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  data() {
    return {
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
      senDis: true,
      fecDis: true,
      btnDis: true,
      datDis: true,
      expDatDis: true,

      showTable: false,
      headers: [],
      selected: [],
      docPDF: [],
      loadDat: false,
    };
  },
  computed: {
    ...mapState(['users', 'projects', 'groups', 'devices']),
  },

  components: {
    Title,
  },

  methods: {
    buildHeaders() {
      const sensors = this.devices.deviceSelected.sensors;
      this.headers = [];
      if (sensors && sensors.length > 0) {
        this.headers.push({ text: 'Id', value: 'id', sortable: true });
        this.headers.push({ text: 'Fecha', value: 'fecha', sortable: true });
        sensors.forEach((s) => {
          if (this.senSel.indexOf(s._id) > -1) {
            const sname = s.name + ' (' + s.symbol + ')';
            this.headers.push({ text: sname, value: s._id, sortable: true });
          }
        });
        this.showTable = true;
      }
      console.log(this.headers);
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

    async loadData() {
      this.btnDis = false;
      this.loadDat = true;
      this.expDatDis = false;
      this.buildHeaders();

      // TODO change token handling
      let params = ['xytVxvDJSD7Qqse1VOKdd'];
      //params.push('xytVxvDJSD7Qqse1VOKdd');
      params.push(this.devSel);
      params.push(this.senSel.join(','));
      params.push(this.dateReq[0]);
      params.push(this.dateReq[1]);

      try {
        const res = await this.$store.dispatch('devices/getData', params);

        if (res.series && res.series.length > 0) {
          const series = res.series;
          this.datItems = [];
          series.forEach((serie) => {
            const idSen = serie.sensor;
            const samples = serie.samples;
            samples.forEach((sample) => {
              const date = sample.date;
              const value = sample.value;
              const index = this.datItems.findIndex(
                (item) => item.fecha === date
              );
              //const senStr = idSen.toString;
              if (index > -1) {
                let obj = this.datItems[index];
                obj[idSen] = value;
                this.datItems[index] = obj;
              } else {
                let idn = this.datItems.length + 1;
                let obj = { id: idn, fecha: date, [idSen]: value };
                this.datItems.push(obj);
              }
            });
          });
        }

        console.log(this.datItems);
      } catch (err) {
        console.log(err);
      }
      this.loadDat = false;
    },

    loadocPDFData() {
      console.log('Llamando a exportar datos');
      let doc = new jsPDF();
      let cols = [];
      let rows = [];

      this.headers.forEach((item) => {
        cols.push(item.text);
      });

      this.selected.forEach((d) => {
        let aray = [];
        let serie = [];
        for (let key in d) {
          serie.push(d[key]);
        }
        rows.push(serie);
      });

      doc.autoTable({
        head: [cols],
        body: rows,
      });

      doc.save('report.pdf');
    },
  },

  async created() {
    const prj = await this.loadProjects();
    console.log(prj);
  },
};
</script>

<style></style>
