<template>
    <div id="chart-container-com">
        <div class="head">
            <!--表名-->
            <p class="head-title">{{sheetData.title}}</p>
            <div class="option-container">
                <div class="option" @click="showCreateChart">
                    <span class="add-icon"></span>
                    <span>生成图表</span>
                </div>
                <div class="option">
                    <span class="export-icon"></span>
                    <span>多选导出</span>
                </div>
            </div>
        </div>
        <div class="chart-container" :style="{height: chartContainerHeight + 'px'}" @click="checkChart">

            <!--charts图-->
            <div v-for="(chart, index) in chartArray" class="chart">
                <button class="check-btn" :data-btn-index="index">放大</button>
                <chart-com :resize-chart="resizeChart" param-width="100%" param-height="100%" :echart-option="chart">
                </chart-com>
            </div>

            <!--占位div-->
            <div class="occupy-div"></div>
        </div>

        <!--生成图表组件-->
        <create-chart-com v-if="isShowCreateChart" v-on:show-create-chart="showCreateChart"
                          :sheet-data="sheetData"></create-chart-com>

        <check-chart-com v-if="isShowCheckChart" :echart-option="echartOption" v-on:show-check-chart="showCheckChart"></check-chart-com>
    </div>

</template>

<script>
    import CreateChartCom from './CreateChartCom'
    import ChartCom from './ChartCom'
    import CheckChartCom from './CheckChartCom'

    export default {
        name: "chart-container-com",
        components: {
            CreateChartCom: CreateChartCom,
            ChartCom: ChartCom,
            CheckChartCom: CheckChartCom
        },
        props: {
            //通过$emit改变父组件数据,从而改变子组件
            sheetData: {
                title: '', //名字
                type: '',//方案类型 group:选择组，table:选择表
                group: ''
                //选择一张表的情况
                // title:,
                // dataSets:{},
                // timeField1:,
                // timeField2:,
                // charts:[], //分情况原因在于charts放置位置！

                //    选择总汇的情况
                //title:,
                //dataArray:[
                // {
                //  name:,
                //  timeField1:
                //  timeField2:
                //  dataSets:{}
                // }
                // ]
                // charts:[]
            },
            homePageSide: Boolean
            // tableTitle:{
            //     type:String,
            //     required:true,
            //     default:'prop测试'
            // }

        },
        watch: {
            sheetData: function (newSheetData, oldSheetData) {
                let charts = null;
                if (newSheetData.type === 'group') {
                    charts = this.globalData.sheetsData[newSheetData.group]
                } else {
                    let data = this.globalData.sheetsData[newSheetData.group].get(newSheetData.title);
                    charts = data.charts;
                }

                this.chartArray = charts;
            },
            homePageSide: function () {
                this.resizeChart = !this.resizeChart;
            }
        },
        data: function () {
            return {
                chartArray: [],
                isShowCreateChart: false,
                // charts:this.sheetData.charts,
                chartContainerHeight: 550,
                resizeChart: false,
                canvasDom: null,
                echartOption: null,
                isShowCheckChart: false
            }
        },
        methods: {
            checkChart: function (e) {
                let index = e.target.getAttribute('data-btn-index');
                let chartOption = null;
                if (index !== null && index !== undefined) {
                    let chartIndex = parseInt(index);
                    console.log(this.globalData.sheetsData[this.sheetData.group]);
                    if(this.sheetData.type === 'table'){
                        chartOption = this.globalData.sheetsData[this.sheetData.group].get(this.sheetData.title).charts[chartIndex];
                    }else{
                        chartOption = this.globalData.sheetsData[this.sheetData.group][chartIndex];
                    }
                    this.echartOption = chartOption;
                    this.showCheckChart();
                }
            },
            showCreateChart: function () {
                this.isShowCreateChart = !this.isShowCreateChart;

            },
            showCheckChart:function(){
                this.isShowCheckChart = !this.isShowCheckChart;
            }
        },

        created: function () {

            this.chartContainerHeight = window.innerHeight - 190;
            let resizeChartContainer = (e) => {

                this.chartContainerHeight = window.innerHeight - 190;//箭头函数，this指向组件
                this.resizeChart = !this.resizeChart;
            };
            window.addEventListener('resize', resizeChartContainer);
        }
    }
</script>

<style scoped>
    /*标题部分*/
    .head {
        width: 95%;
        position: relative;
        margin: 0 auto;
        padding-bottom: 20px;
        border-bottom: 1px solid #e9e6ed;
    }

    .head-title {
        font-size: 24px;
        color: #516b91;
        margin-top: 25px;
    }

    .option-container {
        position: absolute;
        right: 0;
        top: 0;
    }

    .option {
        display: inline-block;
        margin-right: 50px;
        cursor: pointer;
    }

    .option span {
        vertical-align: middle;
        font-size: 14px;
        color: #516b91;
    }

    .add-icon {
        display: inline-block;
        width: 36px;
        height: 36px;
        margin-right: 8px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url("../assets/components/ChartContainerCom/add_icon.png");

    }

    .export-icon {
        display: inline-block;
        width: 36px;
        height: 36px;
        margin-right: 8px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url("../assets/components/ChartContainerCom/export_icon.png");
    }

    /*内容部分*/
    .chart-container {
        height: 550px;
        padding: 35px 0 10px 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        overflow: auto;
    }

    .chart {
        width: 40%;
        height: 60%;
        margin-right: 3%;
        margin-bottom: 30px;
        position: relative;
        border: 1px solid #e9e6ed;
    }

    .occupy-div {
        width: 43%;
        height: 60%;
    }

    .check-btn {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 998;
    }
</style>