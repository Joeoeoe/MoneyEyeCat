<template>
<parse-sheet-com></parse-sheet-com>
    <!--<loading-com></loading-com>-->
</template>

<script>
    import ParseSheetCom from '@/components/ParseSheetCom'
    import LoadingCom from '@/components/LoadingCom'
    export default {
        name: "test",
        components: {
            LoadingCom:LoadingCom,
            ParseSheetCom: ParseSheetCom,
        },
        created:function () {
            
        }
    }
</script>

<style scoped>

</style>