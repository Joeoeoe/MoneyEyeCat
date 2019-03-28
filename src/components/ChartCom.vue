<template>
    <div :id="randomId" :style="{width: paramWidth, height: paramHeight}">

    </div>
</template>

<script>

    export default {
        name: "chart-com",
        props: {
            //图表宽，高
            paramWidth: '',
            paramHeight: '',
            echartOption:null,
            resizeChart: Boolean
        },
        data: function () {
            return {
                chart:null
                // usualScheme:{//通用方案
                //     barOption:{
                //         legend: {},//图例组件
                //         tooltip: {},//提示框组件legend
                //         dataset: { //数据集，动态传入
                //             dimensions: ['year', '科目一', '科目二', '科目三'],
                //             source: [
                //                 {year: '2015', '科目一': 43.3, '科目二': 85.8, '科目三': 93.7},
                //                 {year: '2016', '科目一': 83.1, '科目二': 73.4, '科目三': 55.1},
                //                 {year: '2017', '科目一': 86.4, '科目二': 65.2, '科目三': 82.5},
                //                 {year: '2018', '科目一': 72.4, '科目二': 53.9, '科目三': 39.1}
                //             ]
                //         },
                //         //根据数据集修改
                //         series: [
                //             {type: 'bar'},//对应各个科目使用的类型
                //             {type: 'bar'},
                //             {type: 'bar'}
                //         ],
                //
                //
                //         //不需要动态修改数据
                //         xAxis: {type: 'category'},//x轴类型
                //         yAxis: {},//y轴类型，默认数值轴
                //     }
                // },
                //
                // specialScheme:{//特别方案
                //
                // }
            }
        },
        computed:{
            randomId:function(){
                return 'chart-com' + Math.random().toString();
            }
        },
        methods: {
            draw: function (echartOption) {

                //!ID重复问题！
                let chartDom = document.getElementById(this.randomId.toString());
                let chart = this.$echarts.init(chartDom, 'Cat');
                chart.clear();
                chart.setOption(echartOption);
                this.chart = chart;
            },
            resize:function(){
                console.log('resize！')
                this.chart.resize();
            }
        },
        watch:{
            echartOption:function(newObj, oldObj){

                this.draw(newObj);
            },
            resizeChart:function(newValue, oldValue){
                this.resize();
            }

        },
        mounted:function(){
            console.log(this.echartOption);
            if(this.echartOption !== null){
                this.draw(this.echartOption);
            }
        }

    }
</script>

<style scoped>

</style>