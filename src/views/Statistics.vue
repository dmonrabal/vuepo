
<template>
    <div class="mt-2">
        <Title
        :title="'Statistics'"
        :color="'secondary--text'"
        :path="'Home / statistics'"
    ></Title>

    </div>
</template>

<script>
    import Title from "@/components/Title";

    export default{
        data(){
            return {
                // Esto es una prueba
            }

        },
        components:{
            Title
        }
    }
</script>

<style lang="scss" scoped>

</style>