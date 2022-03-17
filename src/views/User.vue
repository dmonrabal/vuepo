<template>
  <div class="mt-2">
    <Alert
      :show="myAlert.enable"
      :type="myAlert.type"
      :text="myAlert.text"
    ></Alert>
    <Loading :loading="cargando"></Loading>
    <Title
      :title="'Usuario'"
      :color="'secondary--text'"
      :path="'Home / usuario'"
    ></Title>
      <v-dialog v-model="dialog" max-width="500px">
       <v-form v-model="isFormValid">
          <v-card>
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
                      v-model="editedItem.email"
                      label="Email"
                      :rules="rules.email"
                      :counter="true"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="editedItem.role"
                      label="Rol"
                      disabled
                      :rules="rules.role"
                      :counter="true"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
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
    <v-card class="mx-auto ma-0 pa-0 mt-15" outlined tile width="60%">
      <v-row class="ma-0 pa-0">
        <v-col
          cols="12"
          lg="3"
          style="background-color: teal"
          class="d-flex align-start flex-column justify-center align-center wrap"
        >
          <v-row class="mt-5 align-center">
          <v-avatar size="160">
            <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="John" />
            <!--img src="../../public/users/photo.jpg" alt="John" /-->
          </v-avatar>
          </v-row> 
          <v-row class="mt-5 align-center">
              <v-card-text v-if="file">
            <h4> {{ file.name }}</h4>
            <v-avatar size="50">
              <v-img :src="urlTemp"></v-img>
            </v-avatar>
          </v-card-text>
          </v-row>
           <v-row class="align-start mb-5 mt-5">
            <input type="file" ref="bimagen" class="d-none" @change="searchImage($event)">
            <v-btn
                color="pink"
                dark
                elevation="8"
                fab
                title="Buscar imagen"
                @click="$refs.bimagen.click()">
                
                <v-icon>fas fa-image</v-icon>
              </v-btn> 
              <v-btn
                color="secondary"
                dark
                elevation="8"
                fab
                class="ml-3"
                title="Subir imagen"
                :disabled="file === null"
                @click="uploadImage()">
                
                <v-icon>fas fa-upload</v-icon>
              </v-btn> 
          </v-row>
        </v-col>
        <v-col lg="9" class="mb-5">
          <v-card-text
            class="secondary--text font-weight-light"
            background-color="light-blue"
          >
            Nombre
          </v-card-text>

          <v-card
            class="d-flex flex-row ml-3 align-center"
            color="suave"
            flat
            width="90%"
            height="50"
            tile
          >
            <span class="ml-2"> {{ this.users.user.name }}</span>
          </v-card>

          <v-card-text
            class="secondary--text font-weight-light"
            background-color="light-blue"
          >
            Email
          </v-card-text>

          <v-card
            class="d-flex flex-row ml-3 align-center"
            color="suave"
            flat
            width="90%"
            height="50"
            tile
          >
            <span class="ml-2"> {{ this.users.user.email }}</span>
          </v-card>

          <v-card-text
            class="secondary--text font-weight-light"
            background-color="light-blue"
          >
            Rol
          </v-card-text>

          <v-card
            class="d-flex flex-row ml-3 align-center"
            color="suave"
            width="90%"
            flat
            height="50"
            tile
          >
            <span class="ml-2"> {{ this.users.user.role }}</span>
          </v-card>
              <div class="d-flex mt-10 mr-15 flex-row-reverse">
                 <v-btn
                      color="primary"
                      dark
                      elevation="8"
                      fab
                      class="mb-2"
                      title="Editar"
                      @click="editItem()"
                    >
                      <v-icon>  fas fa-pencil-alt</v-icon>
                    </v-btn>
              </div>          
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import Title from '@/components/Title';
import utils from '@/plugins/utils';

import { mapState } from 'vuex';

export default {
  data() {
    return {
      myUser: {},
      cargando: false,
      file: null,
      urlTemp: null,
      myAlert: {
        enable: false,
        type: 'success',
        text: '',
      },

      // Form fields
      dialog: false,
      selectedForm: '',
      editedIndex: -1,
      editedItem: {
        _id: '',
        name: '',
        email: '',
        role: '',
      },
      defaultItem: {
        _id: '',
        name: '',
        email: '',
        role: '',
      },

      // Rules from
      rules: {
        name: [(v) => !!v || 'El campo es requerido'],
        email: [
          (v) => !!v || 'El campo es requerido',
          (v) =>
            (v && v.length >= 15 && v.length <= 30) ||
            'El email debe tener entre 15 y 30 caracteres',
        ],
        role: [
          (v) => !!v || 'El role es requerido',
          (v) =>
            (v && v.length >= 3 && v.length <= 15) ||
            'El role debe contener entre 3 y 15 caracteres',
        ],
      },
      isFormValid: false,
    };
  },
  components: {
    Alert,
    Loading,
    Title,
  },

  computed: {
    ...mapState(['users']),
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    loadUSer() {
      this.myUser = this.users.user;
    },

    editItem() {
      this.editedItem._id = this.users.user._id;
      this.editedItem.name = this.users.user.name;
      this.editedItem.email = this.users.user.email;
      this.editedItem.role = this.users.user.role;
      this.dialog = true;
    },

    close() {
      console.log('Cerrando -----> ');
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      console.log('Grabando -----> ', this.editedItem);
      this.cargando = false;
      this.dialog = false;
      const params = [this.users.user.token];
      params.push({name: this.editedItem.name, email: this.editedItem.email});
      this.updateItem(params);
      this.loadUSer();
      this.cargando = false;
    },

    async updateItem (params) {
      try { 
        const res = await this.$store.dispatch('users/updateUser', params);
        utils.alert(
          this.myAlert,
          'success',
          utils.messages.USER_UPDATE_SUCCESS
        );
      } catch (err) {
        utils.alert(this.myAlert, 'error', utils.messages.USER_UPDATE_ERROR);
      }
    },

    searchImage(event) {
      console.log(event.target.files[0]);
      this.file = event.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (e) => {
        //console.log(e.target.result);
        this.urlTemp = e.target.result;
      }
    },

    async uploadImage() {
      try {

      } catch (err) {
        console.log(err);
      }
    }
  },
  created() {
    this.loadUSer();
  },
};
</script>

<style></style>
