<template>
  <div class="flex-column mb-4">
    <v-alert dense text outlined :type="type" :value="show">
      {{ text }}
      <!--I'm a dense alert with the <strong>text</strong> prop and a -->
    </v-alert>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    type: String,
    text: String,
    show: {
      type: Boolean,
      default: false,
    }
  },
}
</script>

<style></style>
