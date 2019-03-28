<template>
    <!--布局思路：三列百分比划分，组件中根据此百分比划分-->
    <div class="container">
        <div class="left" :style="{width: leftStyleObj.width + '%', display: leftStyleObj.display}">
            <side-bar-com
                    v-on:left-slide="leftSlide"
                    v-on:show-up-load="showUpLoad"
                    v-on:change-table="changeTable"
                    v-on:judge-tables-group="judgeTablesGroup"
                    :paramALArray="paramSheetsArray.ALArray"
                    :paramPFArray="paramSheetsArray.PFArray"
                    :paramCFArray="paramSheetsArray.CFArray"
            ></side-bar-com>
        </div>

        <div class="middle">
            <!--用户栏-->
            <up-bar-com></up-bar-com>
            <!--主要内容-->
            <chart-container-com :home-page-side="leftStyleObj.flag" :sheet-data="paramDataSets"></chart-container-com>
        </div>

        <!--右侧栏-->
        <div class="right">
            <right-side-bar-com></right-side-bar-com>
        </div>

        <!--上传表格组件-->
        <up-load-sheet-com v-if="isShowUpLoad" v-on:show-up-load="showUpLoad"
                           v-on:collect-data="collectData"></up-load-sheet-com>


    </div>
</template>

<script>
    /**
     * AL：AssetsLiabilities资产负债
     * PF：profit，利润
     * CF:cash flow 现金流量
     **/
    import SideBarCom from '../components/SideBarCom'
    import UpBarCom from '../components/UpBarCom'
    import ChartContainerCom from '../components/ChartContainerCom'
    import RightSideBarCom from '../components/RightSideBarCom'
    import UpLoadSheetCom from '../components/UpLoadSheetCom'
    import CreateChartCom from '../components/CreateChartCom'
    import TWEEN from '@tweenjs/tween.js'

    export default {
        name: "home-page",
        components: {
            CreateChartCom:CreateChartCom,
            UpLoadSheetCom: UpLoadSheetCom,
            ChartContainerCom: ChartContainerCom,
            SideBarCom: SideBarCom,
            UpBarCom: UpBarCom,
            RightSideBarCom: RightSideBarCom
        },
        data: function () {
            return {
                //数据
                tableTitle: '2003年资产负债表',
                sheetsData: {//excel数据
                    ALMap: new Map(),//Map.set('2002年资产负债表', {dataSets:{}, timeField1:, timeField2:, charts:[{保存charts配置，用于生成图表}]})
                    PFMap: new Map(),
                    CFMap: new Map(),
                    ALGroup: [], //组中的对比方案[{charts}]
                    PFGroup: [],
                    CFGroup: []
                },
                paramSheetsArray: {
                    ALArray: [],
                    PFArray: [],
                    CFArray: []
                },
                paramDataSets: {
                    title:'',
                    type:'', //group:选择组,table:选择表
                    group:'' //定位globalData中的数据
                },
                //ui控制
                leftStyleObj: {
                    width: 16.5,
                    display: 'block',
                    flag:true
                },
                isShowUpLoad: false,

                tablesOrGroup: true, //true表示tables，false表示Group
            }
        },
        methods: {
            leftSlide: function () {

                function animate() {
                    if (TWEEN.update()) {
                        requestAnimationFrame(animate)
                    }
                }

                let tween = new TWEEN.Tween(this.leftStyleObj);
                if (this.leftStyleObj.width === 16.5) {
                    tween.to({width: 1}, 100);
                } else {
                    tween.to({width: 16.5}, 100);
                }
                tween.start();
                animate();
                //异步处理....
                setTimeout(()=>{
                    this.leftStyleObj.flag = !this.leftStyleObj.flag;
                },100)

            },
            showUpLoad: function () {
                this.isShowUpLoad = !this.isShowUpLoad;
            },
            changeTable: function (newTableTitle, group) {
                let reg = /Group/;
                console.log(newTableTitle);
                console.log(group);
                if (reg.test(group) === true) {//点击组
                    let paramData = {
                        title: newTableTitle,
                        type:'group',
                        group: group
                    };
                    this.paramDataSets = paramData;
                } else { //点击表
                    let paramSheet = {
                        title: newTableTitle,
                        type:'table',
                        group:group.replace(/Array/,'Map')
                    };
                    this.paramDataSets = paramSheet;
                }
            },
            judgeTablesGroup: function (index) {
                if (index === -1) {
                    this.tablesOrGroup = false;
                } else {
                    this.tablesOrGroup = true;
                }
            },
            collectData: function (ALSheet, PFSheet, CFSheet) {
                let globalData = this.globalData;


                // 收集数据
                globalData.sheetsData.ALMap.set(ALSheet.name, {
                    dataSets: ALSheet.dataSets,
                    timeField1: ALSheet.timeField1,
                    timeField2: ALSheet.timeField2,
                    sheetTime:ALSheet.sheetTime,
                    charts: [],
                });
                globalData.sheetsData.PFMap.set(PFSheet.name, {
                    dataSets: PFSheet.dataSets,
                    timeField1: PFSheet.timeField1,
                    timeField2: PFSheet.timeField2,
                    sheetTime:PFSheet.sheetTime,
                    charts: []
                });
                globalData.sheetsData.CFMap.set(CFSheet.name, {
                    dataSets: CFSheet.dataSets,
                    timeField1: CFSheet.timeField1,
                    timeField2: CFSheet.timeField2,
                    sheetTime:CFSheet.sheetTime,
                    charts: []
                });

                console.log(globalData);

                //    数据获得，通过paraSheetsArray传给sidebar组件
                this.dataToParaSheetsArray(ALSheet, 'ALArray', this.paramSheetsArray);
                this.dataToParaSheetsArray(PFSheet, 'PFArray', this.paramSheetsArray);
                this.dataToParaSheetsArray(CFSheet, 'CFArray', this.paramSheetsArray);
            },
            showCreateChart:function(){
                this.isShowCreateChart = !this.isShowCreateChart;
            },
            dataToParaSheetsArray: function (dataSheet, groupName, paraArray) {
                console.log(paraArray[groupName]);
                paraArray[groupName].push({
                    title: dataSheet.name,
                    selected: false,
                    group: groupName
                })
            }
        }
    }
</script>

<style scoped>
    .container {
        position: fixed;
        width: 100%;
        height: 100%;
        display: flex;
    }

    /*双飞翼!!*/
    .left {
        width: 16.5%;
        /*max-width: 260px;*/
        height: 100%;
    }

    .middle {
        flex: 1;
        /*width: 80%;*/
    }

    .right {
        width: 3.2%;
    }

    .toggle-container {
        width: 53px;
        height: 89px;
        position: fixed;
        top: 50%;
        left: 100px;
        background-image: url("../assets/components/SideBarCom/btn_bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        transform: translateY(-50%);
    }

    .toggle-btn {
        width: 24px;
        height: 24px;
        background-image: url("../assets/components/SideBarCom/push.png");
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(-50%, -50%);
        cursor: pointer;
    }

</style>