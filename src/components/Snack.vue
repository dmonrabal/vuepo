<template>
  <div class="flex-column bt-2">
    <v-snackbar v-model="activar" timeout="2000">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="activar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {
    activar: Boolean,
    text: String,
    color: String,
  },
};
</script>

<style></style>
