<template>
    <form>
        <div class="drop-area" @drop="handleDrop" @dragover.prevent>drop!to here</div>
        <input type="file" @change="handleFiles"/>
        <div class="table-container">
            <div v-for="column in ALDataTable">
                <div class="table-unit" v-for="data in column">{{data}}</div>
            </div>
        </div>

    </form>
</template>

<script>
    import XLSL from 'xlsx'

    export default {
        name: "parse-sheet-com",
        data: function () {
            return {
                /**
                 * AL：AssetsLiabilities资产负债
                 * PF：profit，利润
                 * CF:cash flow 现金流量
                 **/
                paramSheetsArray: [],
                //AL
                ALDataTable: [],  //二维数组，每一个元素为一个数组，储存每列内容
                recordALPosArray1: [], //记录资产负债表'初'或'末'单元格位置，元素数据结构：{target:单元格位置，column:字母列，row：数字行}，下同
                recordALPosArray2: [],  //对应记录资产负债表'末'或 '初'单元格位置
                ALColumnsLength: null,//记录有多少列
                ALRowsLength: null, //记录有多少行
                ALDataSets: [], //数组，数据集，元素数据结构{name:科目名，value1：值1，value2：值2}

                //PF
                PFDataTable: [],
                recordPFPosArray1: [],
                recordPFPosArray2: [],
                PFColumnsLength: null,
                PFRowsLength: null,
                PFDataSets: [],
                
                //CF
                CFDataTable: [],
                recordCFPosArray1: [],
                recordCFPosArray2: [],
                CFColumnsLength: null,
                CFRowsLength: null,
                CFDataSets: []

            }
        },
        methods: {

            handleFiles: function (event) {
                let rABS = false;//true:readAsBinaryString;  false:readAsArrayBuffer
                let files = event.target.files, f = files[0];
                let reg = /^(.*)(\.)(\w*)$/;
                // console.log(f.name);
                let fileName = reg.exec(f.name)[3].toLowerCase();
                if (fileName === 'xlsx' || fileName === 'xls') {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        let data = e.target.result;
                        !rABS && (data = new Uint8Array(data));
                        let workbook = XLSL.read(data, {type: rABS ? 'binary' : 'array'});
                        this.getSheetNames(workbook);
                        console.log(this.paramSheetsArray);
                        let sheetsArrayLength = this.paramSheetsArray.length,
                            ALSheetName = '资产负债',//用于匹配
                            PFSheetName = '利润',
                            CFSheetName = '现金';
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
                        console.log(ALSheetName, PFSheetName, CFSheetName);
                        //获取资产负债表数据集
                        this.parseALSheet(workbook, ALSheetName);

                        //获取利润表数据集
                        this.parsePFSheet(workbook, PFSheetName);
                        //获取现金流量表数据集
                        this.parseCFSheet(workbook, CFSheetName)
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
            handleDrop: function (event) {
                console.log(222);
                let rABS = false;
                event.stopPropagation();
                event.preventDefault();
                let files = event.dataTransfer.files, f = files[0];

                let reg = /^(.*)(\.)(\w*)$/;
                // console.log(f.name);
                let fileName = reg.exec(f.name)[3].toLowerCase();
                if (fileName === 'xlsx' || fileName === 'xls') {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        let data = e.target.result;
                        !rABS && (data = new Uint8Array(data));
                        let workbook = XLSL.read(data, {type: rABS ? 'binary' : 'array'});
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


            parseALSheet: function (workbook, sheetName) {
                let ALData = workbook.Sheets[sheetName];
                let {columnsLength, rowsLength} = this.getSheetSize(ALData);
                this.ALColumnsLength = columnsLength;
                this.ALRowsLength = rowsLength;
                /**
                 * 获取表数据，以二维数组记录，每一个元素为数组，表示一列
                 **/
                let {dataTable, recordPosArray1, recordPosArray2} = this.getDataTable(ALData, columnsLength, rowsLength,'初', '末');
                this.ALDataTable = dataTable;
                this.recordALPosArray1 = recordPosArray1;
                this.recordALPosArray2 = recordPosArray2;
                /**
                 * 表数据已获得，开始解析获得数据集，用初，末位置进行定位
                 **/
                this.ALDataSets = this.getDataSets(recordPosArray1, recordPosArray2, dataTable, columnsLength, rowsLength)
            },
            parsePFSheet: function (workbook, sheetName) {
                let PFData = workbook.Sheets[sheetName];
                let {columnsLength, rowsLength} = this.getSheetSize(PFData);
                this.PFColumnsLength = columnsLength;
                this.PFRowsLength = rowsLength;
                /**
                 * 获取表数据，以二维数组记录，每一个元素为数组，表示一列
                 */
                let {dataTable, recordPosArray1, recordPosArray2} = this.getDataTable(PFData, columnsLength, rowsLength,'本年累计数','上年同期数');
                this.PFDataTable = dataTable;
                this.recordPFPosArray1 = recordPosArray1;
                this.recordPFPosArray2 = recordPosArray2;

                /**
                 * 表数据已获得，开始解析获得数据集，用初，末位置进行定位
                 **/
                console.log(recordPosArray1);
                console.log(recordPosArray2);
                this.PFDataSets = this.getDataSets(recordPosArray1, recordPosArray2, dataTable, columnsLength, rowsLength);
                
            },
            parseCFSheet: function (workbook, sheetName) {
                let CFData = workbook.Sheets[sheetName];
                let {columnsLength, rowsLength} = this.getSheetSize(CFData);
                this.CFColumnsLength = columnsLength;
                this.CFRowsLength = rowsLength;
                /**
                 * 获取表数据，以二维数组记录，每一个元素为数组，表示一列
                 */
                let {dataTable, recordPosArray1, recordPosArray2} = this.getDataTable(CFData, columnsLength, rowsLength,'本期金额','上期金额');
                this.CFDataTable = dataTable;
                this.recordCFPosArray1 = recordPosArray1;
                this.recordCFPosArray2 = recordPosArray2;

                this.CFDataSets = this.getDataSets(recordPosArray1, recordPosArray2, dataTable, columnsLength, rowsLength);


            },
            
            getDataSets:function (recordPosArray1, recordPosArray2, dataTable, columnLength, rowLength) {
                let dataSets = [];
                if (recordPosArray1.length !== recordPosArray2.length) {
                    alert('表格式有误，请确认格式');
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
                            while (true) {//为获取科目名
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
                console.log(dataSets);
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

            //弃用
            getALDataSets: function (recordPosArray1, recordPosArray2, dataTable) {
                let dataSets = [];//记录数据集
                if (recordPosArray1.length !== recordPosArray2.length) {
                    alert('表格式有误，请确认格式');
                    return null;
                }
                let length = recordPosArray1.length,
                    columnLength = this.ALColumnsLength,
                    rowLength = this.ALRowsLength;
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
                            while (true) {//为获取科目名
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
                console.log(dataSets);
                this.ALDataSets = dataSets;
            },
        }
    }
</script>

<style scoped>
    .drop-area {
        width: 200px;
        height: 200px;

        background-color: #fa8072;
    }

    .table-container {
        display: flex;
    }

    .table-unit {
        width: 100px;
        height: 40px;
        font-size: 10px;
        border: 1px solid #000000;
    }
</style>