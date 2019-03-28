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
                    <chart-com class="chart-com" param-width="620px" param-height="450px"
                               :echart-option="echartOption"></chart-com>
                </div>
                <div class="right">
                    <div class="choose-subject">
                        <button :class="[selectSubject? 'selected-subject-btn':'unselected-subject-btn']"
                                @click="chooseSubjects">选择科目
                        </button>
                        <button :class="[selectSubject? 'unselected-subject-btn':'selected-subject-btn']"
                                v-if="sheetData.type==='group'" @click="chooseTables">筛选表格
                        </button>
                    </div>

                    <!--科目容器-->
                    <div class="subject-container" v-show="selectSubject">
                        <menu-com class="menu-com"
                                  v-on:get-subject="getData"
                                  :param-choices-array="subjectArray"
                                  title="科目">
                        </menu-com>
                    </div>
                    <!--表格容器-->
                    <div class="sheets-container" v-show="!selectSubject" @click="sheetArrayChange">
                        <div class="sheet-unit" v-for="(sheet,index) in sheetArray">
                            <input :data-sheet-name="sheet.sheetName" type="checkbox" v-model="sheet.selected"
                                   :id=" 'sheet-unit-'+ index"/>
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
                chartOptionArray: ['柱形', '饼状', '折线+饼图', '雷达图','正负轴'],
                chartOption: '柱形',
                subjectMap: new Map(),// subjectName:[value1, value2, sheetTime, subject]
                echartOption: null,
                subjectArray:new Array(), //科目数组
                //所有表格数组
                sheetArray: [],// {sheetName:, selected:false}

                // ui
                selectSubject: true,

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
        watch: {},
        methods: {
            getData: function (subject) {//给一个最终的this.subjectMap即可
                let tempSubjectMap = new Map();
                let timeField1 = null, timeField2 = null;
                if (this.sheetData.type === 'table') {
                    let map = this.globalData.sheetsData[this.sheetData.group],
                        data = map.get(this.sheetData.title);
                    timeField1 = data.timeField1;
                    timeField2 = data.timeField2;

                    let valueArray = this.getDataFromArray(subject, data.dataSets, data.sheetTime);
                    tempSubjectMap.set(subject, valueArray);
                    //将科目与已有subjectMap比对，有则删，无则加
                    for (let [key, value] of tempSubjectMap) {
                        if (this.subjectMap.has(key)) {
                            this.subjectMap.delete(key)
                        } else {
                            this.subjectMap.set(key, value)
                        }
                    }
                    console.log(this.subjectMap);
                    this.createEchartOption(this.chartOption, this.subjectMap, timeField1, timeField2);
                } else if (this.sheetData.type === 'group') {
                    //重写sheetArray！！！！！
                    if (this.selectedArray.length === 0) {//无选中表
                        if (this.subjectMap.has(subject)) {
                            this.subjectMap.delete(subject);
                        } else {
                            this.subjectMap.set(subject, [null, null, null, subject]);
                        }
                        console.log(this.subjectMap);
                        // //考虑长度1变0的情况
                        this.echartOption = new Object();
                        return;
                    } else {// 有选中表
                        let allSubjectMap = this.getAllSubjectMap(this.subjectMap);
                        if (allSubjectMap.has(subject)) {
                            allSubjectMap.delete(subject);
                        } else {
                            allSubjectMap.set(subject, true);
                        }
                        let groupData = this.globalData.sheetsData[this.sheetData.group.replace(/Group/, 'Map')];
                        [timeField1, timeField2] = this.getTimeFieldInGroup(groupData);
                        this.getTempSubjectMapInGroup(allSubjectMap, groupData).then((tempSubjectMap) => {

                            this.subjectMap = tempSubjectMap;
                            this.createEchartOption(this.chartOption, this.subjectMap, timeField1, timeField2);
                        });
                    }
                }
            },
            createEchartOption: function (chartOption, subjectMap, timeField1, timeField2) {

                let tempEchartOption = null;

                switch (chartOption) {
                    case '柱形':
                        tempEchartOption = createBarOption(subjectMap, timeField1, timeField2);
                        break;
                    case '饼状':
                        tempEchartOption = createPieOption(subjectMap, timeField1, timeField2);
                        break;
                    case '折线+饼图':
                        tempEchartOption = createLinePieOption(subjectMap, timeField1, timeField2);
                        break;
                    case '雷达图':
                        tempEchartOption = createRadarOption(subjectMap, timeField1, timeField2);
                        break;
                    case '正负轴':
                        tempEchartOption = createPNAxis(subjectMap, timeField1, timeField2);
                        break;
                }

                console.log(tempEchartOption);
                this.echartOption = tempEchartOption;

                function createBarOption(subjectMap, timeField1, timeField2) {
                    let dimensions = ['timeField'];
                    let source = [
                        {timeField: timeField1},
                        {timeField: timeField2}
                    ];
                    for (let [key, valueArray] of subjectMap) {// dimensions推入科目名
                        dimensions.push(key);
                        source[0][key] = valueArray[0];
                        source[1][key] = valueArray[1];
                    }

                    let seriesLength = dimensions.length - 1,
                        series = [];
                    for (let i = 0; i < seriesLength; i++) {
                        series.push({type: 'bar'})
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
                        yAxis: {},//y轴类型，默认数值轴
                        //图表位置
                        grid: {
                            left: '15%'
                        }
                    };

                    return barOption;
                }

                function createPieOption(subjectMap, timeField1, timeField2) {
                    let seriesData1 = [], //value1
                        seriesData2 = []; //value2
                    for (let [key, value] of subjectMap) {
                        seriesData1.push({
                            name: key,
                            value: value[0]
                        });
                        seriesData2.push({
                            name: key,
                            value: value[1]
                        })
                    }

                    let pieOption = {
                        title: [
                            {
                                text: timeField1,
                                left: '25%',
                                bottom: '15%'

                            },
                            {
                                text: timeField2,
                                left: '73%',
                                bottom: '15%'
                            }
                        ],
                        legend: {
                            type: 'scroll',
                            top: 30
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        series: [
                            {
                                name: timeField1,
                                type: 'pie',
                                roseType: 'radius',
                                radius: '40%',
                                center: ['30%', '50%'],
                                data: seriesData1,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            },
                            {
                                name: timeField2,
                                type: 'pie',
                                roseType: 'radius',
                                radius: '40%',
                                center: ['75%', '50%'],
                                data: seriesData2,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    return pieOption;
                }

                function createLinePieOption(subjectMap, timeField1, timeField2){
                    let linePieOption = {};
                    let sourceArray = [], //dataset中的source数据
                        seriesArray = []; // series数组
                    let sourceArrayLength;
                    sourceArray.push(['subject', timeField1, timeField2]);
                    for(let [key, value] of subjectMap){
                        sourceArray.push([key, value[0], value[1]])
                    }
                    seriesArray = new Array(sourceArray.length - 1).fill({type: 'line', smooth: true, seriesLayoutBy: 'row'})
                    seriesArray.push({
                        type: 'pie',
                        id: 'pie',
                        radius: '30%',
                        center: ['50%', '25%'],
                        label: {
                            formatter: '{b}({d}%)'
                        },
                        encode: {
                            itemName: 'subject',
                            value: timeField1,
                            tooltip: timeField1
                        }
                    });
                    linePieOption = {
                        legend: {},
                        tooltip: {
                            trigger: 'axis',
                            showContent: true
                        },
                        dataset: {
                            source: sourceArray
                        },
                        title:{},
                        xAxis: {type: 'category'},
                        yAxis: {gridIndex: 0},
                        grid: {
                            top: '55%',
                            left:'15%'
                        },
                        series: seriesArray
                    };
                    return linePieOption;
                }

                function createRadarOption(subjectMap, timeField1, timeField2){
                    console.log(subjectMap);
                    let radarOption = {};
                    let dataMap = new Map();//格式  2002年初: Map ; 2002年末:Map
                    let maxNum = -1;  //从subjectMap中获取最大值给雷达图


                    //有bug！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
                    for(let [key, value] of subjectMap){
                        let tempMax = value[0] > value[1]? value[0]:value[1];
                        maxNum = maxNum > tempMax? maxNum:tempMax;
                        if( !dataMap.has(value[2] + '初')){//有此表
                            dataMap.set(value[2] + '初', new Map());
                            dataMap.set(value[2] + '末', new Map());
                        }
                        let startMap = dataMap.get(value[2] + '初'),
                            endMap = dataMap.get(value[2] + '末');
                        startMap.set(key, value[0]);
                        endMap.set(key, value[1]);
                    }
                    let radar = {},
                        legendData = [],
                        series = [];
                    console.log(maxNum);
                    radar.indicator = [];
                    for(let [key, value] of subjectMap){
                        radar.indicator.push({
                            text:key,
                            max:maxNum
                        })
                    }
                    for(let [key, valueMap] of dataMap){
                        series.push({
                            type:'radar',
                            symbol:'none',
                            lineStyle:{width:1},
                            emphasis:{
                                areaStyle: {color: "rgba(0,250,0,0.3)"}
                            },
                            data:[
                                {
                                    name:key,
                                    value:[]
                                }
                            ]
                        });
                        let lastEle = series[series.length - 1],
                            valueArray = lastEle.data[0].value;
                        for(let [subjectName, value] of valueMap){
                            valueArray.push(value)
                        }
                        legendData.push(key)
                    }


                    radarOption = {
                        title: {},
                        tooltip: {
                            trigger: 'item',
                            backgroundColor : 'rgba(0,0,250,0.2)'
                        },
                        visualMap: {
                            top: 'middle',
                            right: 10,
                            max:maxNum,
                            min:0,
                            color: ['red', 'yellow'],
                            calculable: true
                        },
                        radar:radar,
                        legend: {
                            type:'scroll',
                            bottom:10,
                            data:legendData
                        },
                        series: series
                    };
                    console.log(radarOption);
                    return radarOption;
                }

                function createPNAxis(subjectMap, timeField1, timeField2){
                    let legendData = [],
                        yData = [],
                        series = [],
                        tempSubjectMap = new Map(),//记录全部subject 格式：subject:Map( year: diff,year:diff)
                        tempYearMap = new Map();//记录全部年份
                    for(let [key, value] of subjectMap){

                        if(tempSubjectMap.has(value[3])){
                            tempSubjectMap.get(value[3]).set(value[2], value[1] - value[0]);
                        }else{
                            tempSubjectMap.set(value[3], new Map());
                            tempSubjectMap.get(value[3]).set(value[2], value[1] - value[0]);
                        }
                        (!tempYearMap.has(value[2]) && tempYearMap.set(value[2], true));

                    }
                    for(let [yearKey, value] of tempYearMap){
                        yData.push(yearKey);
                    }
                    console.log(tempSubjectMap);
                    console.log(tempYearMap);
                    for(let [key, valueMap] of tempSubjectMap){
                        series.push({
                            name:key,
                            type:'bar',
                            label:{
                                normal:{
                                    show:true
                                }
                            },
                            data:[]
                        });
                        legendData.push(key);
                        let dataArray = series[series.length - 1].data;
                        for(let [year, diff] of valueMap){
                            dataArray.push(diff);
                        }
                    }
                    console.log(series);
                    let PNAxisOption = {
                        title:{
                            text: timeField2 + '-' + timeField1
                        },
                        tooltip:{
                            trigger:'axis',
                            axisPointer:{
                                type:'shadow'
                            }
                        },
                        legend:{
                            data:legendData
                        },
                        xAxis:[
                            {
                                type:'value'
                            }
                        ],
                        yAxis:[
                            {
                                type:'category',
                                axisTick:{show:false},
                                data:yData
                            }
                        ],
                        series:series
                    };
                    return PNAxisOption;
                }

            },
            getGroupSubjectData: function (sheetArray, groupMapData, subject) {

                let selectedSheetArray = [];//已选表格数组
                let tempSubjectMap = new Map();
                //获取已选表格
                for (let sheet of sheetArray) {
                    if (sheet.selected === true) {
                        selectedSheetArray.push(sheet.sheetName);
                    }
                }
                for (let sheetName of selectedSheetArray) {
                    let mapData = groupMapData.get(sheetName),
                        sheetYear = mapData.sheetTime,
                        valueArray = this.getDataFromArray(subject, mapData.dataSets, mapData.sheetTime);

                    tempSubjectMap.set(sheetYear + subject, valueArray);
                }

                return tempSubjectMap;
            },
            sheetArrayChange: function (e) {
                let sheetName = e.target.getAttribute('data-sheet-name');
                if (sheetName !== null && sheetName !== undefined) { //点击会触发两次事件，代码中设置了checkbox的data-sheet-name
                    let subjectMap = this.subjectMap,
                        groupData = this.globalData.sheetsData[this.sheetData.group.replace(/Group/, 'Map')],
                        sheetTime = groupData.get(sheetName).sheetTime,
                        timeField1 = null,
                        timeField2 = null,
                        allSubjectMap = this.getAllSubjectMap(subjectMap);
                    [timeField1, timeField2] = this.getTimeFieldInGroup(groupData);
                    this.getTempSubjectMapInGroup(allSubjectMap, groupData).then((tempSubjectMap) => {
                        this.subjectMap = tempSubjectMap;
                        console.log(this.subjectMap);
                        if(this.subjectMap.size !== 0){
                            this.createEchartOption(this.chartOption, this.subjectMap, timeField1, timeField2);
                        }
                    });

                }
            },
            getChartOption: function (option) {

                console.log(this.subjectMap.size);
                this.chartOption = option;
                if(this.subjectMap.size !== 0){
                    console.log(this.echartOption);
                    let timeField1 = null, timeField2 = null;
                    if (this.sheetData.type === 'table') {
                        let map = this.globalData.sheetsData[this.sheetData.group],
                            data = map.get(this.sheetData.title);
                        timeField1 = data.timeField1;
                        timeField2 = data.timeField2;
                    } else if (this.sheetData.type === 'group') {
                        let groupData = this.globalData.sheetsData[this.sheetData.group.replace(/Group/, 'Map')];
                        [timeField1, timeField2] = this.getTimeFieldInGroup(groupData);
                    }
                    this.createEchartOption(option, this.subjectMap, timeField1, timeField2);
                }


            },
            close: function () {
                this.$emit('show-create-chart');
            },
            getDataFromArray: function (subject, dataSets, sheetTime) {
                for (let item of dataSets) {
                    if (item.name.indexOf(subject) !== -1) {
                        return [item.value1, item.value2, sheetTime, subject];
                    }
                }
                return null;
            },
            confirmOption: function () {

                let sheetData = this.sheetData;
                let chartOption = this.echartOption;
                if(chartOption !== null){
                    if (sheetData.type === 'table') {

                        let chartArray = this.globalData.sheetsData[sheetData.group].get(sheetData.title).charts;

                        chartArray.push(chartOption);


                    } else {
                        let chartArray = this.globalData.sheetsData[sheetData.group];

                        chartArray.push(chartOption);
                    }
                }

                this.$emit('show-create-chart');

            },
            chooseSubjects: function () {
                this.selectSubject = true;
            },
            chooseTables: function () {
                this.selectSubject = false;
            },
            getAllSubjectMap: function (subjectMap) {
                let allSubjectMap = new Map();
                for (let [key, subjectArray] of subjectMap) {
                    if (!allSubjectMap.has(subjectArray[3])) {
                        allSubjectMap.set(subjectArray[3], true)
                    }
                }
                return allSubjectMap;
            },
            getTimeFieldInGroup: function (groupData) {
                let timeField1 = null, timeField2 = null;
                for (let [key, sheet] of groupData) {

                    if (timeField1 === null) {
                        timeField1 = sheet.timeField1;
                        timeField2 = sheet.timeField2;
                        break;
                    }
                }
                return [timeField1, timeField2];
            },
            getTempSubjectMapInGroup: function (allSubjectMap, groupData) {
                // console.log(0);
                console.log(allSubjectMap);
                let p = new Promise((fufill, reject) => {
                    setTimeout(() => {
                        let tempSubjectMap = new Map();
                        if (this.selectedArray.length !== 0) {
                            for (let [subjectName, value] of allSubjectMap) {
                                for (let sheetName of this.selectedArray) {
                                    let data = groupData.get(sheetName);
                                    let valueArray = this.getDataFromArray(subjectName, data.dataSets, data.sheetTime);
                                    // console.log(valueArray);
                                    tempSubjectMap.set(data.sheetTime + subjectName, valueArray);
                                }
                            }
                        } else {
                            for (let [subjectName, value] of allSubjectMap) {
                                tempSubjectMap.set(subjectName, [null, null, null, subjectName])
                            }
                        }

                        fufill(tempSubjectMap)
                    }, 0)
                });
                return p;
            },
            getTempSubjectMapByFun: function (allSubjectMap, groupData) { //点击事件先于计算属性改变
                let tempSubjectMap = new Map();
                let selectedArray = [];
                for (let sheet of this.sheetArray) {
                    // console.log(sheet);
                    // (sheet.selected && selectedArray.push(sheet.sheetName));

                    if (sheet.selected === true) {

                        selectedArray.push(sheet.sheetName);
                    }
                }

                for (let [subjectName, value] of allSubjectMap) {
                    for (let sheetName of selectedArray) {
                        let data = groupData.get(sheetName);
                        let valueArray = this.getDataFromArray(subjectName, data.dataSets, data.sheetTime);

                        tempSubjectMap.set(data.sheetTime + subjectName, valueArray);
                    }
                }
                return tempSubjectMap;
            },
        },
        computed: {
            selectedArray: function () {//group，在改变科目时使用
                let newArray = [];
                for (let item of this.sheetArray) {
                    if (item.selected === true) {
                        newArray.push(item.sheetName)
                    }
                }
                return newArray;
            }
        },
        mounted: function () {
            let sheetName = null;//表名记录，用于获取所有科目
            let mapMatch = this.sheetData.group; //匹配表名，获取数据用
            //是组类型的时候
            if (this.sheetData.type === 'group') {
                let allMapName = this.sheetData.group.replace(/Group/, 'Map');
                mapMatch = this.sheetData.group.replace(/Group/, 'Map');
                let map = this.globalData.sheetsData[allMapName];
                for (let [key, value] of map) {
                    this.sheetArray.push({
                        sheetName: key,
                        selected: false,
                        sheetTime: value.sheetTime
                    });
                }
                console.log(this.sheetArray);
            }
            try{
                sheetName = this.sheetArray[0].sheetName
            }catch(e){
                sheetName = this.sheetData.title
            }
            let sheetMap = this.globalData.sheetsData[mapMatch].get(sheetName);
            let subjectArray = [];
            for(let item of sheetMap.dataSets){
                if( (item.value1 !== null && item.value2 !== null) && (item.value1 !== '-' && item.value2 !== '-')){
                    subjectArray.push({
                        name:item.name,
                        selected:false
                    });
                }
            }
            this.subjectArray = subjectArray;
            console.log(this.subjectArray);
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
        margin:  11px 0  20px 200px;
    }

    .chart-com {
        margin: 0 auto;
    }

    .sheet-unit {
        margin: 0 17px 0 17px;
        border-bottom: 1px solid #e9e6ed;
        padding: 0 0 0 13px;
        display: flex;
        align-items: center;
        min-height: 42px;
    }

    .sheet-unit input[type=checkbox] {
        visibility: hidden;
        zoom: 200%;
        vertical-align: center;
    }

    .sheet-unit input[type=checkbox]:checked + label::before {
        content: '\2714';
    }

    .sheet-unit label {
        font-size: 16px;
        color: #516b91;
        display: inline-block;
        cursor: pointer;
    }

    .sheet-unit label span {
        display: inline-block;
        vertical-align: 1px;
    }

    .sheet-unit label::before {
        font-size: 16px;
        width: 16px;
        height: 16px;
        content: '\a0';
        text-align: center;
        line-height: 16px;
        display: inline-block;
        vertical-align: center;
        border: 1px solid #e9e6ed;
        background-color: #f1f2fa;
        margin-right: 19px;
    }
    /*.menu-container{*/
        /*display:flex;*/
        /*width: 450px;*/
        /*flex-wrap: wrap;*/
        /*justify-content: space-around;*/
    /*}*/
</style>