<v-dialog
  v-model="superDialog"
  fullscreen
  hide-overlay
  transition="dialog-bottom-transition"
>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="success"
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
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="superDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="superDialog = false"> Save </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-form v-model="isFormValid">
            <v-col cols="12" class="pa-10">
              <span>Tipo de gráfico</span>
              <v-radio-group v-model="editedChart.type" mandatory row>
                <v-radio label="Line" value="line"></v-radio>
                <v-img
                  src="../../public/icons/line-chart.png"
                  max-width="100px"
                  max-height="100px"
                ></v-img>

                <v-radio class="ml-15" label="Bar" value="bar"></v-radio>
                <v-img
                  src="../../public/icons/bar-chart.png"
                  max-width="100px"
                  max-height="100px"
                ></v-img>

                <v-radio class="ml-15" label="Pie" value="pie"></v-radio>
                <v-img
                  src="../../public/icons/pie-chart.png"
                  max-width="100px"
                  max-height="100px"
                ></v-img>

                <v-radio class="ml-15" label="Area" value="area"></v-radio>
                <v-img
                  src="../../public/icons/area-chart-b.png"
                  max-width="100px"
                  max-height="100px"
                ></v-img>
              </v-radio-group>
            </v-col>
            <v-col cols="6" class="pa-10">
              <span>Periodo de series</span>
            </v-col>

            <v-divider></v-divider>
          </v-form>
        </v-card>
      </v-dialog>
