var fs = require('fs');

var headerInfo = {
    resName: '',
    resNote: '',
    createDate: '2017-8-30-10:29:39',
    resCreator: '王齐源',
    lastModify: '2017-8-30-10:29:39',
    lastmodifer: '王齐源',
    // subClass: '261文件',
    // subClass: '核心计结息改造项目',
    // subClass: '支付宝业务',
    subClass: '120号文件',
    resType: '',
    repeatFlag: false
}

function writeCount(infos) {
    var content = `<?xml version="1.0" encoding="UTF-8"?>
<pxml:PXMLModel xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:pxml="http://www.hundsun.com/ares/studio/pkgide/pxml/1.0">
  <basicmodel resname="pkg_count2corebank_`+ headerInfo.resName + `_` + headerInfo.resType + `" note="` + headerInfo.resNote + `" createdate="` + headerInfo.createDate + `" rescreator="` + headerInfo.resCreator + `" lastmodify="` + headerInfo.lastModify + `" lastmodifer="` + headerInfo.lastmodifer + `" subclass="` + headerInfo.subClass + `">
    <versioncontrol reversion="$Rev$ " date="$Date$ " author="$Author$  " url="$URL$ "/>
  </basicmodel>
  <root nodename="root">
    <convfunc/>
    <dctname/>`;

    if (headerInfo.repeatFlag && headerInfo.resType == 'req') {
        content += `
            <children xsi:type="pxml:XMLNode" nodename="cfcs" note="重复次数" inodexp="[/EFS/PRI/ACUR]">
      <convfunc/>
      <dctname/>
    </children>
        `
    }
    if (headerInfo.resType == 'resp') {
        content += `
                <children xsi:type="pxml:SubPacket" inodexp="0">
      <pxmlsubpacket referdata="subpkg_count2corebank_pub_resp"/>
    </children>
      <children xsi:type="pxml:XMLNode" nodename="PRI">
      <convfunc/>
      <dctname/>
        <children xsi:type="pxml:XMLNode" nodename="ACUR" note="重复次数" inodexp="[/cfcs]">
        <convfunc/>
        <dctname/>
      </children>
      <children xsi:type="pxml:XMLNode" nodename="TRDT" note="交易日期" inodexp="[/jyrq]">
        <convfunc/>
        <dctname/>
      </children>
      <children xsi:type="pxml:XMLNode" nodename="TRTM" note="交易时间" inodexp="[/jysj]">
        <convfunc/>
        <dctname/>
      </children>
      <children xsi:type="pxml:XMLNode" nodename="TLSQ" note="柜员流水号" inodexp="[/jylsh]">
        <convfunc/>
        <dctname/>
      </children>
    `
    }

    infos.forEach(info => {
        var children = `
                <children xsi:type="pxml:XMLNode" nodename="` + info.nodeName + `" note="` + info.note + `" inodexp="` + info.inodexp + `">
      <convfunc/>
      <dctname/>
    </children>`;
        content += children;

    });
    if (headerInfo.resType == 'resp') {
        content += `
                </children>`
    }
    if (headerInfo.repeatFlag) {
        if (headerInfo.resType == 'req') {
            content += `
            <children xsi:type="pxml:SubPacket" inodexp=" [/EFS/PRI/ACUR]" cycletype="1_for循环">
      <pxmlsubpacket referdata="subpkg_count2corebank_`+ headerInfo.resName + `_req_mx"/>
    </children>`;
        } else {
            content += `
            <children xsi:type="pxml:SubPacket" inodexp="[/cfcs]" cycletype="1_for循环">
      <pxmlsubpacket referdata="subpkg_count2corebank_`+ headerInfo.resName + `_resp_mx"/>
    </children>`;
        }
    }
    content += `
        </root>
</pxml:PXMLModel>`

    console.log(content);

    fs.writeFileSync('./pkg_count/pkg_count2corebank_' + headerInfo.resName + `_` + headerInfo.resType + '.pkgidexml', content);
    // fs.writeFileSync('D:/wangqy/KF/GZPKG_NL_DEP/PKG_GXP_NL/pkg_count/pkg_count2corebank_' + headerInfo.resName + `_` + headerInfo.resType + '.pkgidexml', content);

}


function writeHostBank(infos) {
    var content = `<?xml version="1.0" encoding="UTF-8"?>
<picxp:PICXPModel xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:picxp="http://www.hundsun.com/ares/studio/pkgide/picxp/v1.0">
  <basicmodel resname="pkg_hostbank_`+ headerInfo.resName + `_` + headerInfo.resType + `" note="` + headerInfo.resNote + `" createdate="` + headerInfo.createDate + `" rescreator="` + headerInfo.resCreator + `" lastmodify="` + headerInfo.lastModify + `" lastmodifer="` + headerInfo.lastmodifer + `" subclass="` + headerInfo.subClass + `">
    <versioncontrol reversion="$Rev$ " date="$Date$ " author="$Author$  " url="$URL$ "/>
  </basicmodel>
         <fields xsi:type="picxp:SubPacket">
    <icxppacket referdata="pkg_hostbank_pub_`+ headerInfo.resType + `"/>
  </fields>
  `
    if (headerInfo.repeatFlag && headerInfo.resType == 'req') {
        content += `
                 <fields xsi:type="picxp:PICXPField" fldref="/cfcs" note="重复次数2P0" tranlen="2" convexp="2|0">
    <convfunc referdata="COMPRESSA2E"/>
    <dctname/>
  </fields>
      `
    }
    infos.forEach(info => {
        var children = `
            <fields xsi:type="picxp:PICXPField" fldref="/` + info.nodeName + `" note="` + info.note + `" tranlen="` + info.tranlen + `" convexp="` + info.convexp + `">
    <convfunc referdata="`+ info.convfunc + `"/>
    <dctname/>
  </fields>`
        content += children;
    });
    if (headerInfo.repeatFlag) {
        var child = '';
        if (headerInfo.resType == 'req') {
            child = `
            <fields xsi:type="picxp:SubPacket" tranlen="[/cfcs]" cycletype="1_for循环">
    <icxppacket referdata="subpkg_hostbank_`+ headerInfo.resName + `_` + headerInfo.resType + `_mx"/>
  </fields>`;
        } else {
            child = `
            <fields xsi:type="picxp:SubPacket" tranlen="[/cfcs]" cycletype="1_for循环">
    <icxppacket referdata="subpkg_hostbank_`+ headerInfo.resName + `_` + headerInfo.resType + `_mx"/>
  </fields>`
        }
        content += child;
    }
    content += `
 </picxp:PICXPModel>`

    console.log(content);
    // fs.writeFileSync('D:/wangqy/KF/GZPKG_NL_DEP/PKG_GXP_NL/pkg_hostbank/pkg_hostbank_' + headerInfo.resName + `_` + headerInfo.resType + '.pkgideicxp', content);
    fs.writeFileSync('./pkg_hostbank/pkg_hostbank_' + headerInfo.resName + `_` + headerInfo.resType + '.pkgideicxp', content);
}

function writeCountSubFile(infos) {
    var content = `<?xml version="1.0" encoding="UTF-8"?>
<pxml:PXMLModel xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:pxml="http://www.hundsun.com/ares/studio/pkgide/pxml/1.0">
  <basicmodel resname="subpkg_count2corebank_`+ headerInfo.resName + `_` + headerInfo.resType + `_mx" note="` + headerInfo.resNote + `" createdate="` + headerInfo.createDate + `" rescreator="` + headerInfo.resCreator + `" lastmodify="` + headerInfo.lastModify + `" lastmodifer="` + headerInfo.lastmodifer + `" subclass="` + headerInfo.subClass + `">
    <versioncontrol reversion="$Rev$ " date="$Date$ " author="$Author$  " url="$URL$ "/>
  </basicmodel>
  <root nodename="root">
    <convfunc/>
    <dctname/>`;
    if (headerInfo.resType == 'resp') {
        content += `
        <children xsi:type="pxml:XMLNode" nodename="PRI">
      <convfunc/>
      <dctname/>
       <children xsi:type="pxml:XMLNode" nodename="RESULT">
        <convfunc/>
        <dctname/>
        <children xsi:type="pxml:XMLNode" nodename="ROW|n">
          <convfunc/>
          <dctname/>`
    } else {
        content += `
         <children xsi:type="pxml:XMLNode" nodename="list|n">
      <convfunc/>
      <dctname/>`
    }
    infos.forEach(info => {
        var children = `
                <children xsi:type = "pxml:XMLNode" nodename= "` + info.nodeName + `" note= "` + info.note + `" inodexp= "` + info.inodexp + `" >
            <convfunc />
            <dctname />
    </children > `;

        content += children;

    });
    if (headerInfo.resType == 'resp') {
        content += `
                </children >
                  </children>
      </children> `
    }
    else if (headerInfo.resType == 'req') {
        content += `
                </children >`
    }
    content += `
        </root >
</pxml:PXMLModel > `

    console.log(content);
    fs.writeFileSync('./pkg_count/subpkg_count2corebank_' + headerInfo.resName + `_` + headerInfo.resType + '_mx.pkgidexml', content);
}

function writeSubHostBank(infos) {
    var content = `<?xml version= "1.0" encoding= "UTF-8" ?>
            <picxp:PICXPModel xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:picxp="http://www.hundsun.com/ares/studio/pkgide/picxp/v1.0">
                <basicmodel resname="subpkg_hostbank_`+ headerInfo.resName + `_` + headerInfo.resType + `_mx" note="` + headerInfo.resNote + `" createdate="` + headerInfo.createDate + `" rescreator="` + headerInfo.resCreator + `" lastmodify="` + headerInfo.lastModify + `" lastmodifer="` + headerInfo.lastmodifer + `" subclass="` + headerInfo.subClass + `">
                    <versioncontrol reversion="$Rev$ " date="$Date$ " author="$Author$  " url="$URL$ " />
                </basicmodel>`;

    infos.forEach(info => {
        var children = `
                <fields xsi:type="picxp:PICXPField" fldref="` + info.nodeName + `" note="` + info.note + `" tranlen="` + info.tranlen + `" convexp="` + info.convexp + `">
    <convfunc referdata="`+ info.convfunc + `" />
                <dctname />
  </fields>`
        content += children;
    });

    content += `
 </picxp:PICXPModel> `;
    console.log(content);
    fs.writeFileSync('./pkg_hostbank/subpkg_hostbank_' + headerInfo.resName + `_` + headerInfo.resType + '_mx.pkgideicxp', content);

}

module.exports = {
    headerInfo: headerInfo,
    writeCount: writeCount,
    writeHostBank: writeHostBank,
    writeCountSubFile: writeCountSubFile,
    writeSubHostBank: writeSubHostBank
};
