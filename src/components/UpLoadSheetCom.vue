<template>
    <div class="container">
        <div class="up-load-div" v-show="step === 1" @drop="handleDrop" @dragover.prevent>
            <p class="line drag-p">直接将文件拖拽到这里</p>
            <p class="line or-p">或者</p>
            <button class="choose-file-btn" @click="upLoad">选择文件</button>
            <button class="close-btn" @click="close">X</button>
        </div>

        <div class="time-field-div" v-show="step === 2">
            <!--时间段标题-->
            <div class="time-field-container">
                <div class="div0"><p>表名</p>
                    <div class="down-triangle"></div>
                </div>
                <div class="div1"><p>填写时间字段一</p>
                    <div class="down-triangle"></div>
                </div>
                <div class="div2"><p>填写时间字段二</p>
                    <div class="down-triangle"></div>
                </div>
            </div>
            <!--资产负债表-->
            <div class="field-input-container">

                <input class="input0" v-model="customALSheetName"/>
                <input class="input1" v-model="ALTime[0]"/>
                <input class="input2" v-model="ALTime[1]"/>
            </div>
            <!--利润表-->
            <div class="field-input-container">

                <input class="input0" v-model="customPFSheetName"/>
                <input class="input1" v-model="PFTime[0]"/>
                <input class="input2" v-model="PFTime[1]"/>
            </div>
            <!--现金流量表-->
            <div class="field-input-container">

                <input class="input0" v-model="customCFSheetName"/>
                <input class="input1" v-model="CFTime[0]"/>
                <input class="input2" v-model="CFTime[1]"/>
            </div>
            <!--填写时间-->
            <div class="field-input-container inline-block-div">
                <p>
                    <span>表时间</span>
                    <!--<span class="time-tips">(将自动加在表名前)</span>-->
                </p>
                <input class="input1" v-model="sheetTime"/>
                <button class="create-btn" @click="finishGetTime">完成</button>
            </div>

            <button class="close-btn" @click="close">X</button>
        </div>

    </div>
</template>

<script>
    import XLSL from 'xlsx'

    export default {
        name: "up-load-sheet-com",
        data: function () {
            return {
                /**
                 * AL：AssetsLiabilities资产负债
                 * PF：profit，利润
                 * CF:cash flow 现金流量
                 **/
                workbook: null, //解析之后的excel表格
                paramSheetsArray: [],//记录有什么表
                sheetTime:"",//表时间，点击完成后加于表名前
                //AL
                ALSheetName: null,
                customALSheetName:'',//用户自定义表名
                ALDataTable: [],  //二维数组，每一个元素为一个数组，储存每列内容
                recordALPosArray1: [], //记录资产负债表'初'或'末'单元格位置，元素数据结构：{target:单元格位置，column:字母列，row：数字行}，下同
                recordALPosArray2: [],  //对应记录资产负债表'末'或 '初'单元格位置
                ALColumnsLength: null,//记录有多少列
                ALRowsLength: null, //记录有多少行
                ALDataSets: [], //数组，数据集，元素数据结构{name:科目名，value1：值1，value2：值2}
                ALTime: [null, null],//时间字段记录

                //PF
                PFSheetName: null,
                customPFSheetName:'',
                PFDataTable: [],
                recordPFPosArray1: [],
                recordPFPosArray2: [],
                PFColumnsLength: null,
                PFRowsLength: null,
                PFDataSets: [],
                PFTime: [null, null],

                //CF
                CFSheetName: null,
                customCFSheetName:'',
                CFDataTable: [],
                recordCFPosArray1: [],
                recordCFPosArray2: [],
                CFColumnsLength: null,
                CFRowsLength: null,
                CFDataSets: [],
                CFTime: [null, null],

                //    UI控制
                step:1 //1：上传文件 2：填写时间字段
            }
        },
        methods: {
            upLoad: function () {
                let input = document.createElement('input');
                input.type = 'file';
                input.onchange = this.handleFiles;
                input.click();

            },
            finishGetTime: function () {

                let workbook = this.workbook,
                    ALSheetName = this.ALSheetName,
                    PFSheetName = this.PFSheetName,
                    CFSheetName = this.CFSheetName;
                //完成时间字段填写，获取数据集
                let [ALTime1, ALTime2] = this.ALTime,
                    [PFTime1, PFTime2] = this.PFTime,
                    [CFTime1, CFTime2] = this.CFTime;
                //获取资产负债表数据集
                try {
                    this.parseALSheet(workbook, ALSheetName, ALTime1, ALTime2);
                    console.log()
                } catch (e) {
                    console.log(e);
                }

                //获取利润表数据集
                try {
                    this.parsePFSheet(workbook, PFSheetName, PFTime1, PFTime2);
                } catch (e) {
                    console.log(e);
                }
                //获取现金流量表数据集
                try {
                    this.parseCFSheet(workbook, CFSheetName, CFTime1, CFTime2);
                } catch (e) {
                    console.log(e);
                }
                //传递数据
                this.$emit('collect-data', {
                    name: this.sheetTime + this.customALSheetName,
                    dataSets: this.ALDataSets,
                    timeField1: ALTime1,
                    timeField2: ALTime2,
                    sheetTime:this.sheetTime
                }, {
                    name: this.sheetTime + this.customPFSheetName,
                    dataSets: this.PFDataSets,
                    timeField1: PFTime1,
                    timeField2: PFTime2,
                    sheetTime:this.sheetTime
                }, {
                    name: this.sheetTime + this.customCFSheetName,
                    dataSets: this.CFDataSets,
                    timeField1: CFTime1,
                    timeField2: CFTime2,
                    sheetTime:this.sheetTime
                });
                //关闭组件
                this.close();
            },
            handleFiles: function (event) {
                let rABS = false;//true:readAsBinaryString;  false:readAsArrayBuffer
                let files = event.target.files, f = files[0];
                let reg = /^(.*)(\.)(\w*)$/;

                let fileName = reg.exec(f.name)[3].toLowerCase();
                if (fileName === 'xlsx' || fileName === 'xls') {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        let data = e.target.result;
                        !rABS && (data = new Uint8Array(data));
                        let workbook = XLSL.read(data, {type: rABS ? 'binary' : 'array'});
                        this.workbook = workbook;
                        console.log(workbook);
                        this.getSheetNames(workbook);
                        let sheetsArrayLength = this.paramSheetsArray.length,
                            ALSheetName = '资产负债',//用于匹配
                            PFSheetName = '利润',
                            CFSheetName = '现金';
                        for (let i = 0; i < sheetsArrayLength; i++) {
                            if (ALSheetName === '资产负债' && this.paramSheetsArray[i].indexOf(ALSheetName) !== -1) {
                                ALSheetName = this.paramSheetsArray[i];
                                this.ALSheetName = this.paramSheetsArray[i];
                                this.customALSheetName = this.paramSheetsArray[i];
                                continue;
                            }
                            if (PFSheetName === '利润' && this.paramSheetsArray[i].indexOf(PFSheetName) !== -1) {
                                PFSheetName = this.paramSheetsArray[i];
                                this.PFSheetName = this.paramSheetsArray[i];
                                this.customPFSheetName = this.paramSheetsArray[i];
                                continue;
                            }
                            if (CFSheetName === '现金' && this.paramSheetsArray[i].indexOf(CFSheetName) !== -1) {
                                CFSheetName = this.paramSheetsArray[i];
                                this.CFSheetName = this.paramSheetsArray[i];
                                this.customCFSheetName = this.paramSheetsArray[i];
                                continue;
                            }
                        }

                    };
                    if (rABS) {
                        reader.readAsBinaryString(f);
                    } else {
                        reader.readAsArrayBuffer(f);
                    }
                } else {
                    alert('请上传后缀为.xlsx的excel表格');
                }
                this.step = 2;
            },
            handleDrop: function (event) {

                let rABS = false;
                event.stopPropagation();
                event.preventDefault();
                let files = event.dataTransfer.files, f = files[0];

                let reg = /^(.*)(\.)(\w*)$/;

                let fileName = reg.exec(f.name)[3].toLowerCase();
                if (fileName === 'xlsx' || fileName === 'xls') {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        let data = e.target.result;
                        !rABS && (data = new Uint8Array(data));
                        let workbook = XLSL.read(data, {type: rABS ? 'binary' : 'array'});
                        this.getSheetNames(workbook);
                        let sheetsArrayLength = this.paramSheetsArray.length,
                            ALSheetName = '资产负债',//用于匹配
                            PFSheetName = '利润',
                            CFSheetName = '现金';
                        //设置各个表名叫什么
                        for (let i = 0; i < sheetsArrayLength; i++) {
                            if (ALSheetName === '资产负债' && this.paramSheetsArray[i].indexOf(ALSheetName) !== -1) {
                                ALSheetName = this.paramSheetsArray[i];
                                continue;
                            }
                            if (PFSheetName === '利润' && this.paramSheetsArray[i].indexOf(PFSheetName) !== -1) {
                                PFSheetName = this.paramSheetsArray[i];
                                continue;
                            }
                            if (CFSheetName === '现金' && this.paramSheetsArray[i].indexOf(CFSheetName) !== -1) {
                                CFSheetName = this.paramSheetsArray[i];
                                continue;
                            }
                        }
                        //获取资产负债表数据集
                        this.parseALSheet(workbook, ALSheetName);

                        //获取利润表数据集
                        this.parsePFSheet(workbook, PFSheetName);
                        //获取现金流量表数据集
                        this.parseCFSheet(workbook, CFSheetName);
                    };
                    if (rABS) {
                        reader.readAsBinaryString(f);
                    } else {
                        reader.readAsArrayBuffer(f);
                    }
                } else {
                    alert('请上传后缀为.xlsx的excel表格');
                }
            },
            parseALSheet: function (workbook, sheetName, timeField1, timeField2) {
                let ALData = workbook.Sheets[sheetName];
                let {columnsLength, rowsLength} = this.getSheetSize(ALData);
                this.ALColumnsLength = columnsLength;
                this.ALRowsLength = rowsLength;
                /**
                 * 获取表数据，以二维数组记录，每一个元素为数组，表示一列
                 **/
                let {dataTable, recordPosArray1, recordPosArray2} = this.getDataTable(ALData, columnsLength, rowsLength, timeField1, timeField2);
                this.ALDataTable = dataTable;
                this.recordALPosArray1 = recordPosArray1;
                this.recordALPosArray2 = recordPosArray2;

                /**
                 * 表数据已获得，开始解析获得数据集，用初，末位置进行定位
                 **/
                this.ALDataSets = this.getDataSets(recordPosArray1, recordPosArray2, dataTable, columnsLength, rowsLength)
            },
            parsePFSheet: function (workbook, sheetName, timeField1, timeField2) {
                let PFData = workbook.Sheets[sheetName];
                let {columnsLength, rowsLength} = this.getSheetSize(PFData);
                this.PFColumnsLength = columnsLength;
                this.PFRowsLength = rowsLength;
                /**
                 * 获取表数据，以二维数组记录，每一个元素为数组，表示一列
                 */
                let {dataTable, recordPosArray1, recordPosArray2} = this.getDataTable(PFData, columnsLength, rowsLength, timeField1, timeField2);
                this.PFDataTable = dataTable;
                this.recordPFPosArray1 = recordPosArray1;
                this.recordPFPosArray2 = recordPosArray2;

                /**
                 * 表数据已获得，开始解析获得数据集，用初，末位置进行定位
                 **/
                this.PFDataSets = this.getDataSets(recordPosArray1, recordPosArray2, dataTable, columnsLength, rowsLength);

            },
            parseCFSheet: function (workbook, sheetName, timeField1, timeField2) {
                let CFData = workbook.Sheets[sheetName];
                let {columnsLength, rowsLength} = this.getSheetSize(CFData);
                this.CFColumnsLength = columnsLength;
                this.CFRowsLength = rowsLength;
                /**
                 * 获取表数据，以二维数组记录，每一个元素为数组，表示一列
                 */
                let {dataTable, recordPosArray1, recordPosArray2} = this.getDataTable(CFData, columnsLength, rowsLength, timeField1, timeField2);
                this.CFDataTable = dataTable;
                this.recordCFPosArray1 = recordPosArray1;
                this.recordCFPosArray2 = recordPosArray2;

                this.CFDataSets = this.getDataSets(recordPosArray1, recordPosArray2, dataTable, columnsLength, rowsLength);


            },
            getDataSets: function (recordPosArray1, recordPosArray2, dataTable, columnLength, rowLength) {
                let dataSets = [];
                if (recordPosArray1.length !== recordPosArray2.length) {
                    alert('时间字段有误或漏填，请确认格式');
                    return null;
                }
                let length = recordPosArray1.length;
                /**
                 * 注意！是以recordPosArray1为基准！
                 **/
                for (let i = 0; i < length; i++) {
                    let target = recordPosArray1[i].target,
                        targetRow = recordPosArray1[i].row,//'初'或'末'单元格位于第x行
                        targetColumn = this.letterToNum(recordPosArray1[i].column); //'初'或'末'单元格位于第y列

                    for (let row = targetRow + 1; row <= rowLength; row++) {
                        if (dataTable[targetColumn][row] !== null) {//有数据
                            let data = dataTable[targetColumn][row],
                                tempColumn = targetColumn;
                            while (true) {//获取科目名
                                tempColumn--;
                                if (typeof dataTable[tempColumn][row] === 'string') {//找到科目名
                                    let obj = {};
                                    obj.name = dataTable[tempColumn][row];//科目名
                                    obj.value1 = dataTable[targetColumn][row];//此数据
                                    obj.value2 = dataTable[targetColumn + 1][row];//用Array，故用相邻数据
                                    dataSets.push(obj);
                                    break;
                                }
                            }
                        }
                    }
                }

                return dataSets;
            },
            getSheetSize: function (dataSheet) {//返回对象，包含列数和行数
                let startToEnd = dataSheet['!ref'],
                    startToEndReg = /^(\w*):(\w*)$/,
                    start = startToEndReg.exec(startToEnd)[1], end = startToEndReg.exec(startToEnd)[2],
                    numLetterReg = /^([A-Z]*)([0-9]*)$/,
                    startLetter = numLetterReg.exec(start)[1],
                    startNum = numLetterReg.exec(start)[2],
                    endLetter = numLetterReg.exec(end)[1],
                    endNum = numLetterReg.exec(end)[2],
                    columnsLength = endLetter.charCodeAt(0) - startLetter.charCodeAt(0) + 1, //记录有多少列
                    rowsLength = parseInt(endNum, 10) - parseInt(startNum, 10) + 1; //记录有多少行
                return {
                    columnsLength: columnsLength,
                    rowsLength: rowsLength
                }
            },
            getDataTable: function (data, columnsLength, rowsLength, firstField, secondField) {//同时定位时间字段单元格位置，需要用户提供时间段命名！
                let dataTable = [],
                    recordPosArray1 = [],
                    recordPosArray2 = [];
                //初始化表格数组，以列为单位,每个元素为数组，其长度为行
                for (let i = 1; i <= columnsLength; i++) {
                    dataTable[i] = new Array(rowsLength + 1);//下标1开始，故+1
                }
                //以列为组单位
                for (let column = 1; column <= columnsLength; column++) {
                    let letter = String.fromCharCode(column + 64); //ASCII码65：'A'
                    //每行
                    for (let row = 1; row <= rowsLength; row++) {
                        let num = row,
                            target = letter + num.toString();
                        if (data.hasOwnProperty(target)) {
                            dataTable[column][row] = data[target].v;
                            if (typeof data[target].v === 'string' && data[target].v.indexOf(firstField) !== -1) { //寻找数据单元格位置
                                recordPosArray1.push({
                                    target: target,
                                    column: letter,
                                    row: row
                                });
                            }
                            if (typeof data[target].v === 'string' && data[target].v.indexOf(secondField) !== -1) { //寻找数据单位格位置
                                recordPosArray2.push({
                                    target: target,
                                    column: letter,
                                    row: row
                                });
                            }
                        } else {
                            dataTable[column][row] = null;//无数据，令其为null
                        }
                    }
                }
                return {
                    dataTable: dataTable,
                    recordPosArray1: recordPosArray1,
                    recordPosArray2: recordPosArray2
                }
            },
            getSheetNames: function (workbook) {
                this.paramSheetsArray = workbook.SheetNames;

            },
            letterToNum: function (letter) {//将大写字母转为数组下标，A表示1，B表示2，C表示3，以此类推
                return letter.charCodeAt(0) - 64; //65 = 'A'
            },
            close: function () {
                this.$emit('show-up-load');
            }
        }


    }
</script>

<style scoped>
    .container {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .up-load-div {
        width: 568px;
        height: 274px;
        border: dashed 4px #e9e6ed;
        border-radius: 10px;
        position: relative;
    }

    .line {
        text-align: center;
        margin-bottom: 28px;
    }

    .drag-p {
        margin-top: 66px;
        font-size: 36px;
        color: #e9e6ed;
    }

    .or-p {
        font-size: 16px;
        color: #fafaf8;
    }

    .choose-file-btn {
        width: 108px;
        height: 36px;
        margin: auto;
        background-color: #f6b73f;
        color: #ffffff;
        border-radius: 6px;
    }

    .time-field-div {
        position: relative;
        width: 800px;
        height: 431px;
        background-color: #f8f9ff;

    }

    .time-field-container {
        margin: 49px 0 25px 0;
        display: flex;
    }
    .time-field-container .div0{
        margin-left: 85px;
    }
    .time-field-container .div1 {
        margin-left: 160px;
    }

    .time-field-container .div2 {
        margin-left: 180px;
    }

    .time-field-div .no-create-btn {
        width: 90px;
        height: 36px;
        border-radius: 8px;
        border: solid 1px #f6b73f;
        background-color: #f8f9ff;
        font-size: 14px;
        color: #f6b73f;
        display: inline-block;
        margin-left: 525px;
    }

    .time-field-div .create-btn {
        width: 90px;
        height: 36px;
        border-radius: 8px;
        border: solid 1px #f6b73f;
        background-color: #f6b73f;
        font-size: 14px;
        color: #fafaf8;
        display: inline-block;
        margin: 10px 0 0 200px;
    }

    .field-input-container {
        display: flex;
        align-items: center;
        margin-bottom: 35px;
    }

    .field-input-container p {
        width: 100px;
        font-size: 16px;
        color: #f6b73f;
        text-align: right;
        margin-left: 60px;
        padding-right: 10px;
    }

    .field-input-container input {
        width: 260px;
        height: 40px;
        background-color: #f1f2fa;
        border-radius: 8px;
    }
    .field-input-container .input0 {
        width: 130px;
        height: 40px;
        color: #f6b73f;
        text-align: right;
        padding-right: 20px;
        margin-left: 20px;
    }

    .field-input-container .input1 {
        margin-left: 31px;
    }

    .field-input-container .input2 {
        margin-left: 30px;
    }
    .field-input-container span{
        color: #f6b73f;
        display: inline-block;
        margin-left: 25px;
        /*vertical-align: text-bottom;*/
    }
    .field-input-container .time-tips{
        font-size: 10px;
        color: #bfbcd3;
        margin:5px 25px 0 0;
        /*vertical-align: t ext-bottom;*/
    }
    .inline-block-div{
        /*display: inline-block;*/
    }

    .close-btn {
        width: 30px;
        height: 30px;
        background-color: #e9e6ed;
        color: #bfbcd3;
        border-radius: 50%;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);

    }

    .down-triangle {
        width: 0;
        height: 0;
        margin: 10px 0 0 50%;
        transform: translateX(-50%);
        text-align: center;
        border-top: 8px;
        border-left: 4px;
        border-right: 4px;
        border-color: #f6b73f transparent transparent transparent;
        border-style: solid;
        /*border-left: ;*/
    }
</style>