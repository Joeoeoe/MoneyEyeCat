<template>
    <div class="mask" @click="closeCheckChartCom">
        <div class="chart-container">
            <chart-com :echart-option="echartOption" param-width="100%" param-height="100%"></chart-com>
        </div>
    </div>
</template>

<script>
    import ChartCom from './ChartCom'

    export default {
        name: "check-chart-com",
        components: {
            ChartCom: ChartCom
        },
        props: {
            echartOption: Object
        },
        methods: {
            closeCheckChartCom: function (e) {
                console.log(e.target.tagName);
                if (e.target.tagName !== 'CANVAS') {
                    this.$emit('show-check-chart');
                }

            }
        },
        mounted: function () {
            console.log(this.echartOption);
        }
    }
</script>

<style scoped>
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .chart-container {
        width: 70%;
        height: 70%;
        padding-top: 20px;
        background-color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
    }
</style>