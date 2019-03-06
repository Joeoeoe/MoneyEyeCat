<template>
    <div class="create-chart-com">
        <div class="create-chart-div">
            <div class="head">
                <button class="close-btn" @click="close">X</button>
                <button class="confirm-btn" @click="confirmOption">确认生成</button>
            </div>
            <div class="main">
                <div class="left">
                    <!--图表类型选择-->
                    <option-com class="option-com" :param-option-array="chartOptionArray"
                                v-on:get-chart-option="getChartOption"></option-com>
                    <!--逻辑函数与Option在CreateChart生成-->
                    <!--图表组件-->
                    <chart-com class="chart-com" param-width="620px" param-height="450px" :echart-option="echartOption"></chart-com>
                </div>
                <div class="right">
                    <div class="choose-subject">
                        <button :class="[selectSubject? 'selected-subject-btn':'unselected-subject-btn']" @click="chooseSubjects">选择科目</button>
                        <button :class="[selectSubject? 'unselected-subject-btn':'selected-subject-btn']" v-if="sheetData.type==='group'" @click="chooseTables">筛选表格</button>
                    </div>
                    <!--科目容器-->
                    <div class="subject-container" v-show="selectSubject">
                        <menu-com class="menu-com"
                                  v-on:get-subject="getData"
                                  :param-choices-array="currentAssetsArray"></menu-com>
                    </div>

                    <!--表格容器-->
                    <div class="sheets-container" v-show="!selectSubject" @click="sheetArrayChange">
                        <div class="sheet-unit" v-for="(sheet,index) in sheetArray" >
                            <input :data-sheet-name="sheet.sheetName" type="checkbox" v-model="sheet.selected" :id=" 'sheet-unit-'+ index"/>
                            <label :for="'sheet-unit-' + index"><span>{{sheet.sheetName}}</span></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import MenuCom from './MenuCom'
    import ChartCom from './ChartCom'
    import OptionCom from './OptionCom'

    export default {
        name: "create-chart-com",
        components: {
            MenuCom: MenuCom,
            ChartCom: ChartCom,
            OptionCom: OptionCom
        },

        props: {
            sheetData: Object //根据sheetName获取数据
                              // title:'', //名字
                              //type:'',//方案类型 group:选择组，table:选择表
                              //group:''
        },
        data: function () {
            return {

                chartOptionArray: ['柱形', '饼状'],
                chartOption: '柱形',

                subjectMap: new Map(),// key:科目名 value:[value1, value2]
                echartOption:new Object(), //subjectName:[value1, value2, sheetTime]

                //所有表格数组
                sheetArray:[],// {sheetName:, selected:false}


                //流动资产
                currentAssetsArray: [
                    {
                        name: '货币资金',
                        selected: false
                    },
                    {
                        name: '短期投资',
                        selected: false
                    },
                    {
                        name: '应收票据',
                        selected: false
                    },
                    {
                        name: '应收股利',
                        selected: false
                    },
                    {
                        name: '应收利息',
                        selected: false
                    },
                    {
                        name: '应收帐款',
                        selected: false
                    },
                    {
                        name: '其他应收款',
                        selected: false
                    },
                    {
                        name: '预付帐款',
                        selected: false
                    }, {
                        name: '应收补贴款',
                        selected: false
                    }, {
                        name: '存货',
                        selected: false
                    },
                    {
                        name: '待摊费用',
                        selected: false
                    },
                    {
                        name: '一年内到期的长期债券投资',
                        selected: false
                    },
                    {
                        name: '其他流动资产',
                        selected: false
                    },
                    {
                        name: '流动资产合计',
                        selected: false
                    }

                ],



                // ui
                selectSubject:true,

                // //方案
                // usualScheme: {//通用方案
                //     barOption: {
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
                // specialScheme: {//特别方案
                //
                // }
            }
        },
        watch:{

        },
        methods: {
            getData: function (subject) {
                let tempSubjectMap = new Map();
                let timeField1 = null, timeField2 = null;
                if (this.sheetData.type === 'table') {
                    let map = this.globalData.sheetsData[this.sheetData.group],
                        data = map.get(this.sheetData.title);
                    timeField1 = data.timeField1;
                    timeField2 = data.timeField2;
                    console.log(data);
                    let valueArray = this.getDataFromArray(subject, data.dataSets, data.sheetTime);

                    tempSubjectMap.set(subject, valueArray);
                } else if (this.sheetData.type === 'group') {
                    //重写sheetArray！！！！！
                    console.log(this.selectedArray);

                    let chartArray = this.globalData.sheetsData[this.sheetData.group],//获取图表数组
                        groupMapData = this.globalData.sheetsData[this.sheetData.group.replace(/Group/, 'Map')];
                    //设置时间段
                    for (let [key, value] of groupMapData) {
                        if (timeField1 === null) {
                            timeField1 = value.timeField1;
                            timeField2 = value.timeField2;
                        } else {
                            break;
                        }
                    }
                    console.log(groupMapData);
                    console.log(this.sheetArray);
                //    根据已选表格及科目获取数据,返回Map
                    tempSubjectMap = this.getGroupSubjectData(this.sheetArray, groupMapData, subject);
                    console.log(tempSubjectMap);

                }

                //将科目与已有subjectMap比对，有则删，无则加
                for (let [key, value] of tempSubjectMap) {
                    if (this.subjectMap.has(key)) {
                        this.subjectMap.delete(key)
                    } else {
                        this.subjectMap.set(key, value)
                    }
                }
                console.log(this.subjectMap);


                this.createEchartOption(this.chartOption, this.subjectMap, timeField1, timeField2)
            },
            createEchartOption: function (chartOption, subjectMap, timeField1, timeField2) {

                let tempEchartOption = null;
                switch(chartOption){
                    case '柱形':tempEchartOption = createBarOption(subjectMap, timeField1, timeField2);
                }

                this.echartOption = tempEchartOption;


                function createBarOption(subjectMap, timeField1, timeField2) {
                    let dimensions = ['timeField'];
                    let source = [
                        {timeField: timeField1},
                        {timeField: timeField2}
                    ];

                    for(let [key, valueArray] of subjectMap){// dimensions推入科目名
                        dimensions.push(key);
                        source[0][key] = valueArray[0];
                        source[1][key] = valueArray[1];
                    }

                    let seriesLength = dimensions.length - 1,
                        series = [];
                    for(let i = 0; i < seriesLength; i++){
                        series.push({type:'bar'})
                    }
                    let barOption = {
                        legend: {},//图例组件
                        tooltip: {},//提示框组件legend
                        dataset: { //数据集，动态传入
                            dimensions: dimensions,
                            source: source
                        },
                        //根据数据集修改
                        series: series,
                        //     [
                        //     {type: 'bar'},//对应各个科目使用的类型
                        //     {type: 'bar'},
                        //     {type: 'bar'}
                        // ],
                        //不需要动态修改数据
                        xAxis: {
                            type: 'category'//x轴类型
                        },
                        yAxis: {

                        },//y轴类型，默认数值轴
                        //图表位置
                        grid:{
                            left: '15%'
                        }
                    };

                    return barOption;
                }
            },
            getGroupSubjectData:function(sheetArray, groupMapData, subject){

                let selectedSheetArray = [];//已选表格数组
                let tempSubjectMap = new Map();
                //获取已选表格
                for(let sheet of sheetArray){
                    if(sheet.selected === true){
                        selectedSheetArray.push(sheet.sheetName);
                    }
                }
                for(let sheetName of selectedSheetArray){
                    let mapData = groupMapData.get(sheetName),
                        sheetYear = mapData.sheetTime,
                        valueArray = this.getDataFromArray(subject, mapData.dataSets, mapData.sheetTime);
                    console.log(mapData);
                    tempSubjectMap.set(sheetYear + subject, valueArray);
                }
                console.log(tempSubjectMap);
                return tempSubjectMap;
            },
            sheetArrayChange:function(e){
                // console.log(e.target);
                let sheetName = e.target.getAttribute('data-sheet-name');
                console.log(sheetName);
                if(sheetName !== null && sheetName !== undefined){ //点击会触发两次事件，代码中设置了checkbox的data-sheet-name
                    let subjectMap = this.subjectMap,
                        groupMapData = this.globalData.sheetsData[this.sheetData.group.replace(/Group/, 'Map')];
                    // console.log(data);
                    let sheetTime = groupMapData.get(sheetName).sheetTime;

                    console.log(sheetTime);
                }
            },
            getChartOption: function (option) {

                this.chartOption = option;
            },
            close: function () {
                this.$emit('show-create-chart');
            },
            getDataFromArray: function (subject, dataSets, sheetTime) {
                for (let item of dataSets) {
                    if (item.name.indexOf(subject) !== -1) {
                        return [item.value1, item.value2, sheetTime];
                    }
                }
                return null;
            },
            confirmOption: function () {

                let sheetData = this.sheetData;
                let chartOption = this.echartOption;
                if(sheetData.type === 'table'){

                    let chartArray = this.globalData.sheetsData[sheetData.group].get(sheetData.title).charts;

                    chartArray.push(chartOption);
                }else{
                    let chartArray = this.globalData.sheetsData[sheetData.group];

                    chartArray.push(chartOption);
                }
                this.$emit('show-create-chart');

            },
            chooseSubjects:function(){
                this.selectSubject = true;
            },
            chooseTables:function(){
                this.selectSubject = false;
            },
            getSelectedArrayLength:function(sheetArray){
                let length = 0;
                for(let sheet of sheetArray){
                    (sheet.selected && length++)
                }
                return length;
            }
        },
        computed:{
            selectedArray:function(){//group，在改变科目时使用
                let newArray = [];
                for(let item of this.sheetArray){
                    if(item.selected === true){
                        newArray.push(item.sheetName)
                    }
                }
                return newArray;
            }
        },
        mounted:function(){

            //是组类型的时候
            if(this.sheetData.type === 'group'){
                let allMapName = this.sheetData.group.replace(/Group/, 'Map');
                let map = this.globalData.sheetsData[allMapName];
                for(let [key, value] of map){
                    console.log(key);
                    this.sheetArray.push({
                        sheetName:key,
                        selected:false,
                        sheetTime:value.sheetTime
                    });
                }

            }
            //传入所有表名供选择
            console.log(this.sheetData);
            console.log(this.globalData.sheetsData);

        }
    }
</script>

<style scoped>
    .create-chart-com {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.17);
        display: flex;
        z-index: 999;
        justify-content: center;
        align-items: center;
    }

    .create-chart-div {
        width: 1100px;
        height: 600px;
        background-color: #f8f9ff;
        border-radius: 12px;
    }

    .head {
        width: 100%;
        height: 75px;
        border-bottom: 2px solid #e9e6ed;
    }

    .head button {
        display: inline-block;
    }

    .close-btn {
        color: #b3b3b3;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #f8f9ff;
        border: 1px solid #b3b3b3;
        margin: 26px 0 0 25px;
    }

    .confirm-btn {
        width: 90px;
        height: 36px;
        background-color: #f6b73f;
        border-radius: 8px;
        color: #fafaf8;
        font-size: 14px;
        box-shadow: 0px 2px 12px 1px rgba(246, 183, 63, 0.52);
        margin-left: 900px;
    }

    .main {
        display: flex;
    }

    .left {
        width: 643px;
        height: 523px;
        border-right: 2px solid #e9e6ed;
        overflow: auto;
    }

    .right {
        width: 457px;
        height: 523px;
    }

    .choose-subject {
        /*border-bottom: 2px solid #e9e6ed;*/
    }

    .unselected-subject-btn {
        width: 50%;
        height: 50px;
        color: #b5b5b5;
        background-color: #f8f9ff;
        display: inline-block;
        font-size: 16px;
        border-bottom: 1px solid #e9e6ed;
    }

    .selected-subject-btn {
        width: 50%;
        height: 50px;
        color: #f6b73f;
        background-color: #f8f9ff;
        display: inline-block;
        font-size: 16px;
        border-bottom: 2px solid #f6b73f;

    }

    .subject-container {
        overflow: auto;
        height: 455px;
    }

    .menu-com {
        margin-left: 19px;
        margin-top: 20px;
    }

    .option-com {
        margin: 0 0 0 500px;
    }
    .chart-com{
        margin: 0 auto;
    }
    .sheet-unit{
        margin:0 17px 0 17px;
        border-bottom: 1px solid #e9e6ed;
        padding: 0 0 0 13px;
        display: flex;
        align-items: center;
        min-height: 42px;
    }

    .sheet-unit input[type=checkbox]{
        visibility: hidden;
        zoom: 200%;
        vertical-align: center;
    }
    .sheet-unit input[type=checkbox]:checked+label::before{
        content: '\2714';
    }
    .sheet-unit label{
        font-size: 16px;
        color: #516b91;
        display: inline-block;
        cursor: pointer;
    }
    .sheet-unit label span{
        display: inline-block;
        vertical-align: 1px;
    }

    .sheet-unit label::before{
        font-size: 16px;
        width: 16px;
        height: 16px;
        content:'\a0';
        text-align: center;
        line-height: 16px;
        display: inline-block;
        vertical-align: center;
        border: 1px solid #e9e6ed;
        background-color: #f1f2fa;
        margin-right: 19px;
    }
</style>