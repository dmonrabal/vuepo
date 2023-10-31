<template>
  <div class="text-center">
    <v-dialog
      hide-overlay
      persistent
      width="300"
      v-model="loading"
    >
      <v-card color="primary" dark>
        <v-card-text>
          Cargando...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
      loading: Boolean
  },
  data() {
    return {

    };
  },
};
</script>

<style></style>
