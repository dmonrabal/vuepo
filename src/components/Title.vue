<template>
  <div class="d-flex flex-column mb-6">
    <v-card>
      <v-card-title :class="color">
        <h2 class="text-h6">{{ title }}</h2>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text :class="color"> {{ path }} </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    path: String,
    color: String
  },
  computed: {
  }
};
</script>

<style></style>
