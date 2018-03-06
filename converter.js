var getFirstLetter = require('./getFirstLetter');

/**
 * 格式化核心字段
 * @param {{data:string,nodeName:string,type:string,note:string,tranlen:string,decimal:string}} info 字段数据
 * @param {boolean} type 请求:true 响应:false
 * @param {boolean} dataType true:长度和类型分开 false:长度和类型一起
 * @param {boolean} isXML 判断格式化字段类型是否是XML
 * @param {boolean} repeatFlag 判断是否为子报文
 */
function formatChild(info, type, dataType, isXML, repeatFlag) {
    if (!info) {
        return null;
    }
    if (dataType) {
        info.type = info.type.replace(' ', '');
        info.data = info.type == 'P' ? (info.tranlen + info.type + info.decimal) : (info.tranlen + info.type);
    }
    if (isXML) {
        return xmlConverter(info.nodeName, info.note, type, repeatFlag);
    } else {
        var icxpData = icxpConverter(info.data, type);
        var nodeName = '';
        if (repeatFlag) {
            nodeName = type ? '/list|N/' : '/List|N/';
        }
        if (icxpData) {
            return {
                nodeName: (nodeName + getFirstLetter.makePy(info.note)).trim().replace(' ', ''),
                note: (info.note + info.data).replace(' ', ''),
                tranlen: icxpData.tranlen.replace(' ', ''),
                convexp: icxpData.convexp.replace(' ', ''),
                convfunc: icxpData.convfunc.replace(' ', '')
            };
        }
    }

    return null;
}


/**
 *xml字段参数转换
 * @param {string} name 字段名
 * @param {string} note 字段中文名
 * @param {boolean} type 请求:true 响应:false
 * @param {boolean} repeatFlag 是否是子报文字段
 */
function xmlConverter(name, note, type, repeatFlag) {
    if (!name || !note) {
        return null;
    }
    name = name.replace(' ', '');
    note = note.replace(' ', '');
    var inodexp = '';
    if (repeatFlag) {
        inodexp = type ? '[/EFS/PRI/RESULT/ROW|n/' : '[/List|n/';
    } else {
        inodexp = type ? '[/EFS/PRI/' : '[/';
    }
    var nodeName = type ? getFirstLetter.makePy(note).trim() : name;
    inodexp += (type ? name : getFirstLetter.makePy(note)).trim() + ']';

    return {
        nodeName: nodeName.replace(' ', '').trim(),
        note: note.replace(' ', ''),
        inodexp: inodexp.replace(' ', '')
    };
}


/**
 * icxp字段参数转换
 * @param {string} str 长度及类型
 * @param {boolean} type 请求:true 响应:false
 */
function icxpConverter(str, type) {
    if (!str) {
        return null;
    }
    str = str.replace(' ', '');
    var isFloat = false;
    var transType = {
        tranlen: '',
        convexp: '',
        convfunc: ''
    }
    var regex = `^[0-9]*P[0-9]*$`;
    var answer = str.match(regex);
    if (answer) {
        var trans = answer.pop();
        transType.convexp = trans.replace('P', '|').replace(' ', '');
        transType.tranlen = (parseInt(trans.match('^[0-9]*').pop() / 2) + 1).toString().replace(' ', '');
        isFloat = true;
    }
    else {
        transType.tranlen = transType.convexp = str.match('^[0-9]*').pop().toString().replace(' ', '');
    }
    if (type) {
        transType.convfunc = isFloat ? 'COMPRESSA2E' : 'ATOE';
    } else {
        transType.convfunc = isFloat ? 'COMPRESSE2A' : 'ETOA';
    }
    return transType;
}



module.exports = {
    formatChild: formatChild
};

// test:
// console.log(formatChild({ data: '15P2', nodeName: 'MGID', type: 'P', note: '信息标识', tranlen: '15', decimal: '2' }, false, false, false, false));