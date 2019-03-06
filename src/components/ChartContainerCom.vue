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
        <div class="chart-container"  :style="{height: chartContainerHeight + 'px'}">

            <!--charts图-->
            <chart-com class="chart" :resize-chart="resizeChart" v-for="chart in chartArray" param-width="40%" param-height="60%" :echart-option="chart"></chart-com>
            <!--占位div-->
            <div class="occupy-div"></div>
        </div>
        <!--生成图表组件-->
        <create-chart-com v-if="isShowCreateChart" v-on:show-create-chart="showCreateChart" :sheet-data="sheetData"></create-chart-com>
    </div>
</template>

<script>
    import CreateChartCom from './CreateChartCom'
    import ChartCom from './ChartCom'
    export default {
        name: "chart-container-com",
        components:{
            CreateChartCom: CreateChartCom,
            ChartCom:ChartCom
        },
        props: {
            //通过$emit改变父组件数据,从而改变子组件
            sheetData: {
                title:'', //名字
                type:'',//方案类型 group:选择组，table:选择表
                group:''
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
            // tableTitle:{
            //     type:String,
            //     required:true,
            //     default:'prop测试'
            // }

        },
        watch:{
            sheetData:function(newSheetData, oldSheetData){
                let charts = null;
                if(newSheetData.type === 'group'){
                     charts = this.globalData.sheetsData[newSheetData.group]
                }else{
                     let data = this.globalData.sheetsData[newSheetData.group].get(newSheetData.title);
                     charts = data.charts;
                }

                this.chartArray = charts;
            }
        },
        data: function () {
            return {
                chartArray:[],
                isShowCreateChart:false,
                // charts:this.sheetData.charts,
                chartContainerHeight: 550,
                resizeChart:false
            }
        },
        methods:{
            showCreateChart:function(){
                this.isShowCreateChart = !this.isShowCreateChart;
            },
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
        margin-right: 3%;
        margin-bottom: 30px;
        border: 1px solid #e9e6ed;
    }
    .occupy-div{
        width: 40%;
        height: 60%;
    }
</style>