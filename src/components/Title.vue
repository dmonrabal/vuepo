<template>
  <div class="flex-column mb-4">
    <v-card outlined
    tile>
      <v-card-title :class="color" class="text-h5 font-weight-light">
        {{ title }}
      </v-card-title>
      <v-card-subtitle :class="color" class="ml-5 pa-2 font-weight-thin"> {{ path }} </v-card-subtitle>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    path: String,
    color: String,
  },
  computed: {},
};
</script>

<style></style>
