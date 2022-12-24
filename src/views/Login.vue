<template>
  <v-layout justify-center mt-10>
    <Loading :loading="cargando"></Loading>
    <v-flex xs12 sm8 md6 xl3>
      <v-card>
        <v-toolbar dark color="primary" class="mb-5">
          <v-icon left right dark size="60">fab fa-mixcloud</v-icon>
          <v-toolbar-title class="display-1 text-md-center"
            >Vuepo IoT</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text
          class="text-h5 text-md-center font-weight-light grey--text"
        >
          Accede a nuestra plataforma
        </v-card-text>
        <v-card-text>
          <form
            @submit.prevent="logIn({ email: email, password: pass })"
            v-if="!signup"
          >
            <v-text-field
              prepend-icon="person"
              type="email"
              v-model="$v.email.$model"
              label="Email"
            >
            </v-text-field>
            <small
              class="text-danger d-block mb-1 ml-8"
              v-if="!$v.email.required"
              >Campo Requerido</small
            >
            <small class="text-danger d-block mb-1 ml-8" v-if="!$v.email.email"
              >Email no válido</small
            >
            <v-text-field
              prepend-icon="lock"
              type="password"
              class="mt-3"
              v-model="$v.pass.$model"
              label="Password"
            ></v-text-field>
            <small
              class="text-danger d-block mb-1 ml-8"
              v-if="!$v.pass.minLength"
              >Mínimo 6 carácteres</small
            >
            <small
              class="text-danger d-block mb-1 ml-8"
              v-if="!$v.pass.required"
              >Campo Requerido</small
            >
            <v-card-text>
              <Alert
                :show="myAlert.enable"
                :type="myAlert.type"
                :text="myAlert.text"
              ></Alert>
            </v-card-text>
            <v-card-text>
              <v-btn
                block
                color="info"
                class="mt-5"
                type="submit"
                :disabled="$v.email.$invalid || $v.pass.$invalid"
                >Ingresa</v-btn
              >
              <v-card-text class="text-h7 text-md-center grey--text">
                Olvidé la contraseña</v-card-text
              >
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <p class="text-md-center">¿No eres usuario?</p>
              <v-btn block color="success" @click="switchLogSign"
                >Regístrate</v-btn
              >
            </v-card-text>
          </form>
          <form
            @submit.prevent="
              newUser({
                name: name,
                email: email,
                password: pass,
                passwordConfirm: repass,
              })
            "
            v-if="signup"
          >
            <v-text-field
              prepend-icon="person"
              v-model="$v.name.$model"
              label="Name"
            >
            </v-text-field>
            <small
              class="text-danger d-block mb-1 ml-8"
              v-if="!$v.name.required"
              >Campo Requerido</small
            >
            <small
              class="text-danger d-block mb-1 ml-8"
              v-if="!$v.name.minLength"
              >Mínimo 6 carácteres</small
            >
            <v-text-field
              prepend-icon="person"
              type="email"
              v-model="$v.email.$model"
              label="Email"
            >
            </v-text-field>
            <small
              class="text-danger d-block mb-1 ml-8"
              v-if="!$v.email.required"
              >Campo Requerido</small
            >
            <small class="text-danger d-block mb-1 ml-8" v-if="!$v.email.email"
              >Email no válido</small
            >
            <v-text-field
              prepend-icon="lock"
              type="password"
              class="mt-3"
              v-model="$v.pass.$model"
              label="Password"
            ></v-text-field>
            <small
              class="text-danger d-block mb-1 ml-8"
              v-if="!$v.pass.minLength"
              >Mínimo 6 carácteres</small
            >
            <small
              class="text-danger d-block mb-1 ml-8"
              v-if="!$v.pass.required"
              >Campo Requerido</small
            >

            <v-text-field
              prepend-icon="lock"
              type="password"
              class="mt-3"
              v-model="$v.repass.$model"
              label="Retype password"
            ></v-text-field>
            <small
              class="text-danger d-block mb-1 ml-8"
              v-if="!$v.repass.minLength"
              >Mínimo 6 carácteres</small
            >
            <small
              class="text-danger d-block mb-1 ml-8"
              v-if="!$v.repass.required"
              >Campo Requerido</small
            >
            <small
              class="text-danger d-block mb-1 ml-8"
              v-if="!$v.repass.sameAsPassword"
              >Las contraseñas no coinciden</small
            >
            <v-card-text>
              <Alert
                :show="myAlert.enable"
                :type="myAlert.type"
                :text="myAlert.text"
              ></Alert>
            </v-card-text>
            <v-card-text>
              <v-btn
                block
                color="info"
                class="mt-5"
                type="submit"
                :disabled="$v.$invalid"
                >Regístrate</v-btn
              >
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <p class="text-md-center">¿Ya eres usuario?</p>
              <v-btn block color="success" @click="switchLogSign"
                >Ingresa</v-btn
              >
            </v-card-text>
          </form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
import { mapState, mapActions } from 'vuex';
import { firebase, storage } from '@/plugins/firebase';
import Loading from '@/components/Loading';
import Alert from '@/components/Alert';
import utils from '@/plugins/utils';

export default {
  data() {
    return {
      name: '',
      email: '',
      pass: '',
      repass: '',
      cargando: false,
      signup: false,
      myAlert: {
        enable: false,
        type: 'success',
        text: '',
      },
    };
  },
  props: ['loading'],
  validations: {
    email: {
      required,
      email,
    },
    pass: {
      required,
      minLength: minLength(6),
    },
    name: {
      required,
      minLength: minLength(6),
    },
    repass: {
      required,
      minLength: minLength(6),
      sameAsPassword: sameAs('pass'),
    },
  },
  components: {
    Loading,
    Alert,
  },
  computed: {
    ...mapState(['users']),
  },
  methods: {
    ...mapActions(['logIn']),

    switchLogSign() {
      (this.name = ''),
        (this.email = ''),
        (this.pass = ''),
        (this.repass = ''),
        (this.signup = !this.signup);
    },

    async logIn(user) {
      this.cargando = true;

      try {
        const res = await this.$store.dispatch('users/logIn', user);
        console.log('RS desde View Login: ', res);

        if (res.status === 'success') {
          const resLoad = await this.loadImage();
          utils.alert(
            this.myAlert,
            'success',
            utils.messages.USER_LOGIN_SUCCESS
          );
        } else {
          utils.alert(this.myAlert, 'error', res.message);
        }
        this.cargando = false;
      } catch (error) {
        utils.alert(this.myAlert, 'error', utils.messages.USER_LOGIN_ERROR);
      }
    },

    async newUser(user) {
      this.cargando = true;
      const res = await this.$store.dispatch('users/createUser', user);
      console.log('[New User] - Response:  ', res);
      this.cargando = false;
      if (res.status === 'failed') {
        utils.alert(this.myAlert, 'error', res.message);
      }
    },

    async loadImage() {
      try {
        const refImg = storage
          .ref()
          .child(this.users.user.email)
          .child('fotoPerfil');
        const urlDescarga = await refImg.getDownloadURL();
        console.log(urlDescarga);
        this.users.user.photo = urlDescarga;
        utils.alert(
          this.myAlert,
          'success',
          utils.messages.USER_IMGUPD_SUCCESS
        );
      } catch (err) {
        console.log(err);
        utils.alert(this.myAlert, 'error', utils.messages.USER_IMGUPD_ERROR);
      }
    },
  },
};
</script>

<style></style>
