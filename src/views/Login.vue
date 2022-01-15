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
        <v-card-text class="text-h6 text-md-center grey--text">
          Accede a nuestra plataforma
        </v-card-text>
        <v-card-text>
          <form @submit.prevent="logIn({ email: email, password: pass })">
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
              <v-btn
                block
                color="info"
                class="mt-5"
                type="submit"
                :disabled="$v.$invalid"
                >Ingresa</v-btn
              >
              <v-card-text class="text-h7 text-md-center grey--text">
                Olvidé la contraseña</v-card-text
              >
              {{ users.user.token }}
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <p class="text-md-center">¿No eres usuario?</p>
              <v-btn block color="success" @click="logIn">Regístrate</v-btn>
            </v-card-text>
          </form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
//import { mapActions } from 'vuex';
import { required, minLength, email } from 'vuelidate/lib/validators';
import { mapState, mapActions } from 'vuex';
import Loading from '@/components/Loading';

export default {
  data() {
    return {
      email: '',
      pass: '',
      cargando: false,
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
  },
  components: {
    Loading,
  },
  computed: {
    ...mapState(['users']),
  },
  methods: {
    ...mapActions(['logIn']),

    async logIn(user) {
      this.cargando = true;
      await this.$store.dispatch('users/logIn', user);
      this.cargando = false;
      
    },
  },
};
</script>

<style></style>
