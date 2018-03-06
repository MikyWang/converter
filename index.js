var xlsx = require("node-xlsx");
var writeFile = require('./writeFile');
var converter = require('./converter');
var readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// var catalogConfig = {
//     path: 'RRR.xlsx', //文件路径
//     fileName: 'RRR.xlsx', //文件名
//     sheetName: '交易接口',//目录名
//     newIndex: 4, //新增标志所属列
//     sheetIndex: 2, //交易所属列
//     CNnameIndex: 3, //交易中文名所在列
//     dataType: true, //长度类型 true:长度和类型分开 false:长度和类型一起
// }

// var fileConfig = {
//     fieldIndex: 1, //字段名所属列
//     noteIndex: 6, //字段中文名所属列
//     tranlenIndex: 3, //长度
//     typeIndex: 5,//类型
//     dataIndex: 3,//长度及类型一起
//     decimalIndex: 4,//小数位
// }

var catalogConfig = {
    // path: '回单补打.xlsx', //文件路径
    // fileName: '回单补打.xlsx', //文件名
    path: '120.xlsx', //文件路径
    fileName: '120.xlsx', //文件名
    sheetName: '交易接口',//目录名
    newIndex: 4, //新增标志所属列
    sheetIndex: 1, //交易所属列
    CNnameIndex: 2, //交易中文名所在列
    dataType: false, //长度类型 true:长度和类型分开 false:长度和类型一起
}

var fileConfig = {
    fieldIndex: 2, //字段名所属列
    // noteIndex: 7, //字段中文名所属列
    noteIndex: 4, //字段中文名所属列
    tranlenIndex: 4, //长度
    typeIndex: 6,//类型
    dataIndex: 3,//长度及类型一起
    decimalIndex: 5,//小数位
}

var list = xlsx.parse('./' + catalogConfig.fileName);
var trans = list.find(item => item.name == catalogConfig.sheetName).data.filter(item => item[catalogConfig.newIndex] == "新增");

main();
console.log('生成成功！');

function main() {

    trans.forEach(tran => {
        var name = tran[catalogConfig.sheetIndex].toString().replace(' ', '');
        writeFile.headerInfo.resName = name;
        writeFile.headerInfo.resNote = tran[catalogConfig.CNnameIndex];
        var page = list.find(item => item.name.indexOf(name) >= 0);
        if (page && page.data) {
            var sheet = page.data.filter(cow => cow.length >= 5);
            console.log(page.name);
            var XMLI1Infos = readInfos('I1', sheet, true);
            var ICXPI1Infos = readInfos('I1', sheet, false);
            var XMLI2Infos = readInfos('I2', sheet, true);
            var ICXPI2Infos = readInfos('I2', sheet, false);
            var XMLO1Infos = readInfos('O1', sheet, true);
            var ICXPO1Infos = readInfos('O1', sheet, false);
            var XMLO2Infos = readInfos('O2', sheet, true);
            var ICXPO2Infos = readInfos('O2', sheet, false);
            if (ICXPI1Infos) {
                writeFile.headerInfo.resType = 'req';
                if (ICXPI2Infos.length > 0) {
                    writeFile.headerInfo.repeatFlag = true;
                    writeFile.writeCountSubFile(XMLI2Infos);
                    writeFile.writeSubHostBank(ICXPI2Infos);
                }
                writeFile.writeCount(XMLI1Infos);
                writeFile.writeHostBank(ICXPI1Infos);
                writeFile.headerInfo.repeatFlag = false;
            }
            if (ICXPO1Infos) {
                writeFile.headerInfo.resType = 'resp';
                if (ICXPO2Infos.length > 0) {
                    writeFile.headerInfo.repeatFlag = true;
                    writeFile.writeCountSubFile(XMLO2Infos);
                    writeFile.writeSubHostBank(ICXPO2Infos);
                }
                writeFile.writeCount(XMLO1Infos);
                writeFile.writeHostBank(ICXPO1Infos);
                writeFile.headerInfo.repeatFlag = false;
            }
        }
    });
}

function old() {
    trans.forEach(tran => {
        var name = tran[catalogConfig.sheetIndex].substr(-6, 6);
        var page = list.find(item => item.name.indexOf(name) > 0);
        if (page) {
            var sheet = page.data.filter(cow => cow.length >= 5);
            var lastNumber = Number.parseInt(name.substr(-1, 1));
            writeFile.headerInfo.repeatFlag = false;
            if (lastNumber == 1) {
                writeFile.headerInfo.resName = tran[catalogConfig.sheetIndex].substr(2, 4);
                writeFile.headerInfo.resNote = tran[catalogConfig.CNnameIndex];
                var XMLI1Infos = readInfos('I1', sheet, true);
                var ICXPI1Infos = readInfos('I1', sheet, false);
                var XMLO1Infos = readInfos('O1', sheet, true);
                var ICXPO1Infos = readInfos('O1', sheet, false);
                var subPkgName = name.substr(0, 5) + (lastNumber + 1);
                var subPage = list.find(item => item.name.indexOf(subPkgName) > 0);
                if (subPage) {
                    var subSheet = subPage.data.filter(cow => cow.length >= 5);;
                    writeFile.headerInfo.repeatFlag = true;
                    var XMLI2Infos = readInfos('I2', subSheet, true);
                    var ICXPI2Infos = readInfos('I2', subSheet, false);
                    var XMLO2Infos = readInfos('O2', subSheet, true);
                    var ICXPO2Infos = readInfos('O2', subSheet, false);
                    if (XMLI2Infos) {
                        writeFile.headerInfo.resType = 'req';
                        writeFile.writeCountSubFile(XMLI2Infos);
                        writeFile.writeSubHostBank(ICXPI2Infos);
                    }
                    if (XMLO2Infos) {
                        writeFile.headerInfo.resType = 'resp';
                        writeFile.writeCountSubFile(XMLO2Infos);
                        writeFile.writeSubHostBank(ICXPO2Infos);
                    }
                }
                if (XMLI1Infos) {
                    writeFile.headerInfo.resType = 'req';
                    writeFile.writeCount(XMLI1Infos);
                    writeFile.writeHostBank(ICXPI1Infos);
                }
                if (XMLO1Infos) {
                    writeFile.headerInfo.resType = 'resp';
                    writeFile.writeCount(XMLO1Infos);
                    writeFile.writeHostBank(ICXPO1Infos);
                }
            }
        }
    });
}


/**
 * 读取指定报文数据
 * @param {string} type 报文类型
 * @param {[]} sheet 所在工作簿
 * @param {boolean} isXML 判断格式化字段类型是否是XML
 */
function readInfos(type, sheet, isXML) {
    var typeSheet = sheet.filter(cow => cow[fileConfig.fieldIndex].indexOf(type) >= 0);
    if (!typeSheet) {
        return null;
    }
    if (type == 'I1') {
        typeSheet = typeSheet.filter(cow => cow[fileConfig.noteIndex].indexOf('重复次数') < 0);
    }
    if (typeSheet.length == 0) {
        return [];
    }
    var infos = [];
    if (type == 'I1') {
        for (var i = 0; i < 6; i++) {
            typeSheet.shift();
        }
    }
    if (type == 'O1') {
        for (var i = 0; i < 5; i++) {
            typeSheet.shift();
        }
    }

    typeSheet.forEach(ts => {
        var info;
        if (catalogConfig.dataType) {
            info = {
                nodeName: ts[fileConfig.fieldIndex].substr(2, ts[fileConfig.fieldIndex].length),
                note: ts[fileConfig.noteIndex],
                type: ts[fileConfig.typeIndex],
                tranlen: ts[fileConfig.tranlenIndex],
                decimal: ts[fileConfig.decimalIndex]
            }
        } else {
            info = {
                nodeName: ts[fileConfig.fieldIndex].substr(2, ts[fileConfig.fieldIndex].length),
                note: ts[fileConfig.noteIndex],
                data: ts[fileConfig.dataIndex]
            }

        }
        var formatType = (type == 'I1' || type == 'I2') ? true : false;
        var repeatFlag = (type == 'I2' || type == 'O2') ? true : false;
        infos.push(converter.formatChild(info, formatType, catalogConfig.dataType, isXML, repeatFlag));
    });
    return infos;
}