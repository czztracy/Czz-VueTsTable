/*
 * @Page: 模板/报价单整体展示
 * @Author: cls
 * @Date: 2018-12-13 09:05:00
 * @Last Modified by: cls
 */
<template>
  <div class="submit" v-loading="tableloading">
    <headers ref="childrenOne" :tab-head-json="tabHeadJson" @tableHeadeJson="getHeadJson"/>
    <TableCom v-for="table in tableList" :key="table.id" :inputTable="table"></TableCom>
    <footers ref="childrenTwo" :tab-foot-json="tabFootJson" @formJson="getFootJson"/>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { hisXuanran, requires } from '@/api/offersheet.ts';
import { getTemplate } from '@/api/moudle.ts';
import {
  TableCom, // 单表单vue组件
  TableListCom, // 多表单vue组件
  BaseTable, // BaseTable实体类
  BaseTableList, // BaseTableList实体类
  ParamTheadAdd
} from "vue3-drag-table/lib/drag-table.umd.min";
import footers from "@/components/Quotation/footer.vue";
import headers from "@/components/Quotation/header.vue";
import { judgeUrl } from "@/utils/api";
import {
  searchLending,
  searchLiscount
} from "@/utils/supplier.ts";
@Component({
  components: {
    TableCom,
    footers,
    headers
  }
})
export default class Submit extends Vue {
  // 表头信息
  tabHeadJson: any = {
    quotationName: '报价单',
    quotationNum: ''
  };  
  // 表尾信息
  tabFootJson: any = {
    Opinion: '', // 供应商意见（可填写）
    name: '', // 填写人签字
    tel: '', // 联系电话
    corporateName: '', // 公司名称（用户登录时获取）
    date: '', // 填写日期（需获取）
    // 填写说明（用户可修改）
    explain: `1、公式    计算单价 = ①＋②＋③＋④＋⑤＋⑥ + ⑦ + ⑧ - ⑨ + ⑩\r\n2、一般管理费、利润供应商根据公司自身管理实际填写。\r\n3、买方有权拒绝不完整或迟到的报价。\r\n4、供应商报价时，一定确保所填写数据真实有效。虚假报价一经查实，买方有权按照合同追责。`,
    Identification: '3'
  };
  // 渲染时的loading
  tableloading: any = false;
  // 接受外部传过来的参数
  srcs: any = {};
  tableCount: any = 0;
  tmpTHead: any = null;
  tmpTable: any = null;
  tableList: any = [];
  // 设置了贴现率的表头集合
  discountList: any = [];
  // 四种贴现率
  // discountName: any = ['付款条件','贷款利率','承兑期限','贴现率'];
  discountName: any = ['0004','0005','0006','0007'];
  // 设置了BOM的表头集合
  saveList: any = [];
  // 所有BOM数据的集合
  BOMTotal: any = [];
  // BOM字段名
  bomName: any = ['物料号', '物料描述', '耗用数量', 'BOM单位'];
  // BOM字段名对应的后台key
  bomNameAfter: any = ['materialCode', 'materialdesc', 'consumptionUnit', 'basicUnit'];
  // bomName与bomNameAfter对应的下标
  findIndex: any = 100;
  // 设置了req的表头集合
  reqList: any = [];
  // req字段名
  reqName: any = ['模块专用号', '模块描述', '资源量', '要求供货时间', '价格单位', '采购单位', '货币', '终投单价', '需求编码', '生产工厂', '高峰月产能', '模块编码'];
  // req字段名对应的后台key
  reqNameAfter: any = ['module_code', 'module_describe', 'resource_quantity', 'supply_time', 'price_unit', 'purchasing_unit', 'currency', 'price', 'demand_code', 'p_manufacturer', 'month_capacity', 'demand_code'];
  // reqName与reqNameAfter对应的下标
  reqIndex: any = 100;
  // 判断部署环境
  judgeUrls: any = '';
  created() {
    this.judgeUrls = judgeUrl();
    if (this.judgeUrls === '003') {
      this.dataStart();
    }
    this.tableloading = true;
    this.srcs = JSON.parse((window as any).sessionStorage.getItem("liziData"));
    // console.log(this.srcs, '1010');
    // 模板展示
    if (this.srcs.hasOwnProperty('templateId')) {
      getTemplate(this.srcs)
      .then((res: any) => {
        this.saveCommon(res, 'templateScript');
        this.tabFootJson.Identification = '3'; // 报价单展示标识
        this.tableloading = false;
      })
      .catch((err: any) => {
        this.tableloading = false;
      });
    } else {
      // 报价单展示
      hisXuanran(this.srcs)
      .then((res: any) => {
        this.saveCommon(res, 'reportScript');
        this.tabFootJson.Identification = '3';
        this.tableloading = false;
      })
      .catch((err: any) => {
        this.tableloading = false;
      });
    }
  }
  // 处理本地缓存的数据
  InitializationData(arr: any) {
    for (const i of Object.keys(arr)) {
      for (const j of Object.keys(arr[i])) {
        const index = 0;
        for (const m in arr[i][j]) {
          if (arr[i][j][m] !== "") {
            const target = this.tableList[+i].tableBody[+j];
            for (const xia of Object.keys(target)) {
              target[xia].id[0] += "";
              target[xia].id[1] += "";
              if (target[xia].id[0] === m || target[xia].id[1] === m) {
                target[xia].cell.content = arr[i][j][m];
                target[xia].cell.value = arr[i][j][m];
                break;
              }
            }
          }
        }
      }
    }
  }
  // 判断是模板还是报价单
  saveCommon(res: any, shu: any) {
    // console.log(res, '2020');
    // 取值渲染表的结构
    if (res.success === false) {
      this.$message.error(res.errorMsg);
      return;
    }
    // let tmpSaveJson = JSON.parse(<any>(window.sessionStorage.getItem("modulHass")));
    // console.log(res, '3030', shu);
    if (!res.resultData.hasOwnProperty(shu)) {
      this.$message.error(res.resultData);
      return;
    }
    const tmpSaveJson = JSON.parse(res.resultData[shu]);
    // console.log(tmpSaveJson, '4040', tmpSaveJson instanceof Array);
    if (tmpSaveJson instanceof Array) {
      if (tmpSaveJson[0] instanceof Array) {
        this.tabHeadJson.quotationNum = res.resultData.reportCode;
        // 报价单结构
        this.savecom(tmpSaveJson[0]);
        // 报价单数据
        this.InitializationData(tmpSaveJson[tmpSaveJson.length-1]);
        // 判断是否有从需求带过来的固定表头
        this.requiresH();
        // 贴现率操作
        this.discountSearch();
        // bom数据操作
        this.BOMTotal = res.resultData.bomPhotoList;
        this.bomsearchs(this.saveList, this.BOMTotal, this.bomNameAfter);
        // 报价单表尾结构
        if (tmpSaveJson.length > 2) {
          this.tabFootJson = tmpSaveJson[tmpSaveJson.length-2];
          // (this.$refs.childrenOne as any).tableHeadeJson();
          // (this.$refs.childrenTwo as any).tableFootJson();
          if (this.tabFootJson.corporateName===''&&this.srcs.hasOwnProperty('company')) {
            this.tabFootJson.corporateName = this.srcs.company;
          }
        }
      } else {
        // 老版模板结构
        this.savecom(tmpSaveJson);
      }
    } else {
      // 新版模板结构
      this.savecom(tmpSaveJson.serializedTemp);
      this.tabHeadJson = tmpSaveJson.headTemp;
      this.tabFootJson = tmpSaveJson.footTemp;
    }
  }
  // 回显结构
  savecom(arr: any) {
    this.tableList = [];
    arr.forEach((table: any) => {
      const tableListEntity = new BaseTableList("table", {
        tableGroupId: "yuhaier",
        hasLeftFixedTable: false
      });
      const tmpTable: BaseTable = tableListEntity.createTable(
        table.tableId
      );
      tmpTable.deserialize(table);
      tmpTable.tableSubject.subscribe(this.onTableChange, this);
      // 隐藏表头标记 设置不可编辑
      tmpTable.setDefaultConfig({
        table:{
          isShowColIndex: false,
          canResizeWidth: false,
          isShowRowIndex: false,
          isTopLeftShow: false
        },
        topThead: {
          readonly: true,
          draggable: false
        },
        leftThead: {
          readonly: true,
          draggable: false
        },
        baseTbody: {
          readonly: true
        }
      });
      this.tableList.push(tmpTable);
      this.tmpTable = tmpTable;
    });
    // // 取消默认拖拽
    // this.tableList.forEach((element: any) => {
    //   element.theadTopEntity.draggable = false;
    //   element.theadTopIndexEntity.draggable = false;
    //   element.theadLeftEntity.draggable = false;
    //   element.theadLeftIndexEntity.draggable = false;
    // });
  }
  // 表格回调
  onTableChange(msg: any) {
    console.log(msg);
  }
  // 取所有设置贴现率的 只限于列
  discountSearch() {
    this.discountList = new Array();
    this.saveList = new Array();
    this.tableList.forEach((element: any) => {
      element.tableHeadTop.forEach((elements: any) => {
        elements.forEach((ele: any) => {
          // 贴现率的表头搜索
          const findDiscount = this.discountName.indexOf(ele.userData.logicalAcquisitionType);
          if (findDiscount !== -1) {
            const arr: any= [];
            arr.push(ele.position, findDiscount);
            this.discountList.push(arr);
          }
          // bom数据的表头搜索
          this.findIndex = this.bomName.indexOf(ele.userData.name);
          if (ele.userData.logicalAcquisitionType==='0001'&&(this.findIndex !== -1)) {
            const arr: any = new Array();
            arr.push(ele.position, this.findIndex);
            this.saveList.push(arr);
          }
        });
      });
    });
    if (this.discountList.length) {
      this.discountList.forEach((element: any) => {
        const tableTar = this.tableList[parseInt(element[0].table.substring(1), 10)-1];
        switch(element[1]) {
          case 0:
            this.payment(tableTar, element, 'payterms');
            break;
          case 1:
            this.payment(tableTar, element, 'rate');
            break;
          case 2:
            this.discountRate(tableTar, element, 'imonthsCd');
            break;
          case 3:
            this.discountRate(tableTar, element, 'discountRate');
            break;
        }
      });
    }
  }
  // 贴现率或账期
  discountRate(tableTar: any,element: any, key: any) {
    const params: any = {
      resultDate: this.srcs.resultDate.split(' ')[0]
    };
    if (this.judgeUrls !== '002') {
      params.supplierCode = this.srcs.supplierCode;
    }
    searchLiscount(params, (ts) => {
      if (ts.success === false) {
        this.$message.error(ts.errorMsg);
        return;
      }
      for (let i = 0; i < tableTar.tableBody.length; i++) {
        const container = tableTar.getContainer({
          colNum: element[0].colNum,
          colStr: element[0].colStr,
          rowNum: tableTar.tableBody[i][0].position.rowNum,
          rowStr: tableTar.tableBody[i][0].position.rowStr,
          table: element[0].table
        });
        container.cell.displayClass.dbclick.displayType = "text";
        container.cell.content = ts.resultData[key];
        container.cell.value = ts.resultData[key];
      }
    });
  }
  // 付款条件或贷款利率  "V9039881", "2018-12-12"
  payment(tableTar: any,element: any, key: any) {
    const params: any = {
      resultDate: this.srcs.resultDate.split(' ')[0]
    };
    if (this.judgeUrls !== '002') {
      params.supplierCode = this.srcs.supplierCode;
    }
    searchLending(params, (ts) => {
      if (ts.success === false) {
        this.$message.error(ts.errorMsg);return;
      }
      for (let i = 0; i < tableTar.tableBody.length; i++) {
        const container = tableTar.getContainer({
          colNum: element[0].colNum,
          colStr: element[0].colStr,
          rowNum: tableTar.tableBody[i][0].position.rowNum,
          rowStr: tableTar.tableBody[i][0].position.rowStr,
          table: element[0].table
        });
        container.cell.displayClass.dbclick.displayType = "text";
        container.cell.content = ts.resultData[key];
        container.cell.value = ts.resultData[key];
      }
    });
  }
  // 渲染bom数据
  bomsearchs(array: any, total: any, after: any) {
    // 如果表头设置过BOM
    if (array.length !== 0) {
      array.forEach((element: any) => {
        const tableTar = this.tableList[parseInt(element[0].table.substring(1), 10)-1];
        const arr = this.getBom(element[1], total, after);
        if (arr.length === 0) {
          return;
        }
        // 自动加行
        const chang = arr.length - tableTar.tableBody.length;
        if (chang > 0) {
          for (let i = 0; i < chang; i++) {
            const tables: BaseTable = tableTar;
            tables.addOneRow();
          }
        }
        // 自动渲染BOM数据
        const row = tableTar.tableBody[0][0].position.rowStr;
        arr.forEach((elements: any, indexs: any) => {
          if (elements===''||(typeof elements==='undefined')) {return;}
          const container = tableTar.getContainer({
            colNum: element[0].colNum,
            colStr: element[0].colStr,
            rowNum: row + indexs - 1,
            rowStr: row + indexs,
            table: element[0].table
          });
          container.cell.content = elements;
          container.cell.value = elements;
          container.cell.displayClass.dbclick.displayType = "text";
        });
      });
    }
  }
  // 取对应表名的BOM数据集合
  getBom(str: any, target: any, after: any) {
    const arr: any = [];
    target.forEach((element: any) => {
      arr.push(element[after[str]]);
    });
    // 数组字符串元素去重
    for (let i = 0; i < arr.length; i++) {
      if (arr.indexOf(arr[i]) !== arr.lastIndexOf(arr[i])) {
        arr.splice(arr.lastIndexOf(arr[i]),1);
        i--;
      }
    }
    return arr;
  }
  // 根据填报单id查询需求带过来的表头
  requiresH() {
    requires(this.srcs.reportId)
      .then((res: any) => {
        // if (res.resultData.length!==0) {
        this.reqList = [];
        // this.tableList.forEach((element: any) => {
        this.tableList[0].tableHeadTop.forEach((elements: any) => {
          elements.forEach((ele: any) => {
            this.reqIndex = this.reqName.indexOf(ele.cell.content);
            if (this.reqIndex !== -1) {
              const arr: any = [];
              arr.push(ele.position, this.reqIndex);
              this.reqList.push(arr);
            }
          });
        });
        // });
        this.bomsearchs(this.reqList, res.resultData, this.reqNameAfter);
        // }
      })
      .catch((err: any) => {
        // 
      });
  }
  // 表头组件
  getHeadJson(data: any) {
    this.tabHeadJson = data;
  }
  getFootJson(data: any) {
    this.tabFootJson = data;
    console.log(this.tabFootJson, '子组件传的值');
  }
  // 本地测试数据
  dataStart() {
    const myUserData1 = {
      reportVersionId: "f30903d911af41a3a184513402a86571", // 报价单版本ID
      supplierCode: "V12680", // 供应商编码
      resultDate: "2018-08-16 15:41:50.0" // 结果公示时间
    };
    const myUserData2 = {
      templateId: "HR19012476746061774848", // 报价单版本ID
    };
    window.sessionStorage.setItem("liziData", JSON.stringify(myUserData2));
  }
}
</script>

<style lang='scss'>
.submit {
  position: relative;
  width: auto;
  float: left;
  // 修改插件的提示logo的大小
  svg {
    width: 13px !important;
  }
  .tablecom{
    &>div{
      float: none !important;
    }
  }
  .maskcon{
    // overflow: scroll;
    &>div{
      float: none !important;
    }
  }
}
</style>