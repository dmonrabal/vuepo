<template>
  <div id="app">
    <v-app id="inspire">
      <v-container grid-list-md text-xs-center fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card dark color="primary">
              <v-card-text class="px-0">12</v-card-text>
            </v-card>
          </v-flex>
          <v-flex v-for="i in 2" :key="`6${i}`" xs6>
            <v-card dark color="secondary">
              <v-card-text class="px-0">6</v-card-text>
            </v-card>
          </v-flex>
          <v-flex v-for="i in 3" :key="`4${i}`" xs4>
            <v-card dark color="primary">
              <v-card-text class="px-0">4</v-card-text>
            </v-card>
          </v-flex>
          <v-flex v-for="i in 4" :key="`3${i}`" xs3>
            <v-card dark color="secondary">
              <v-card-text class="px-0">3</v-card-text>
            </v-card>
          </v-flex>
          <v-flex v-for="i in 6" :key="`2${i}`" xs2>
            <v-card dark color="primary">
              <v-card-text class="px-0">2</v-card-text>
            </v-card>
          </v-flex>
          <v-flex v-for="i in 12" :key="`1${i}`" xs1>
            <v-card dark color="secondary">
              <v-card-text class="px-0">1</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
  </div>
</template>

<script>
export default {};
</script>

<style></style>


/**

Extra small	          xs	            Small to large phone	        < 600px
Small	                sm	            Small to medium tablet	      600px > < 960px
Medium	              md	            Large tablet to laptop	      960px > < 1264px*
Large	                lg	            Desktop	                      1264px > < 1904px*
Extra large	          xl	            4k and ultra-wide	            > 1904px*


*/