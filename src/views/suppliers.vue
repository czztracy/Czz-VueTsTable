/*
 * @Page: 供应商填报
 * @Author: cls
 * @Date: 2018-12-13
 * @Last Modified by: cls
 */
<template>
  <div class="suppliers">
    <div class="matching" @mousedown="hideMenu($event)">
      <el-form
        ref="formInline"
        :inline="true"
        :model="formInline"
        class="Phistory"
        label-position="right"
      >
        <el-form-item label="匹配历史报价单" class="offerMan">
          <el-select v-model="formInline.reportVersionId" placeholder="请选择" filterable @change="chooseHis()">
              <el-option v-for="(item,index) in options" :key="index" :label="item.module_describe" :value="item.report_version_id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 上传下载 @click="downloadPDF" -->
      <div class="UpDown">
        <el-button id="downPdf"  @click="downloadPDF">
          <i class="fa fa-download"/>生成pdf
        </el-button>
        <el-upload
          :limit="13"
          :on-exceed="handleExceed1"
          :file-list="fileList1"
          :on-preview="handlePreview1"
          :on-remove="handleRemove1"
          :headers="fileHeaders"
          :before-remove="beforeRemove1"
          accept=".xls, .xlsx"
          style="display: inline-block"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
        >
          <el-button>
            <i class="fa fa-upload"/>上传
          </el-button>
        </el-upload>
        <el-button>
          <i class="fa fa-download"/>下载
        </el-button>
      </div>
    </div>
    <div v-loading="tableloading">
      <!-- 报价单 -->
      <div class="priceSheet" id="pdfDom">
        <headers ref="childrenOne" :tab-head-json="tabHeadJson" @tableHeadeJson="getHeadJson"/>
        <TableCom v-for="(table, index) in tableList" :key="index" :inputTable="table"></TableCom>
        <footers ref="childrenTwo" :tab-foot-json="tabFootJson" @formJson="getFootJson"/>
      </div>
      <!-- <TableCom class="old" v-for="(table,index) in exportResult" :key="index" :inputTable="table"></TableCom> -->
      <!-- 保存 提交 -->
      <div class="CommitCharge" @mousedown="hideMenu($event)">
        <el-button @click="saveInlocal(2, '')">保存</el-button>
        <el-button type="primary" @click="saveInlocal(3, '')">提交</el-button>
      </div>
    </div>
    <!-- 右键菜单 -->
    <div ref="tests" class="menuss">
      <div v-show="controlMenus" class="menuContent">
        <p @click="addUnit()">添加行</p>
        <div v-if="controlPar">
          <p class="huise">删除行</p>
          <!-- <p @click="controlWidth(1)">设置列宽</p> -->
          <!-- <p class="huise">设置行高</p> -->
        </div>
        <div v-else>
          <p @click="deleUnit('row')">删除行</p>
          <!-- <p class="huise">设置列宽</p> -->
          <!-- <p @click="controlWidth(2)">设置行高</p> -->
        </div>
      </div>
    </div>
    <!-- 上传签章的弹窗 -->
    <el-dialog title="您需要签章后才能提交" :visible.sync="dialogVisible" width="40%">
      <el-upload
        class="upload-demo"
        accept=".PDF,.pdf"
        :data="uploadData"
        :headers="fileHeaders"
        :action="UploadUrl()"
        :on-preview="handlePreview"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :show-file-list ="false"
        :before-upload="beforeAvatarUpload"
        multiple
        :limit="10">
        <el-button id="sign" v-loading="signatureloading" class="set"><i class="fa fa-upload"/>上传pdf签章</el-button>
      </el-upload>
    </el-dialog>
    <!-- 设置宽/高的弹窗 -->
    <el-dialog title="设置宽/高" :visible.sync="controldialog" width="500px" class="controlwh">
      <el-input type="number" min="1" max="500" v-if="controlWH === 1" placeholder="最大宽度：500px" v-model="widthHeight"/>
      <el-input type="number" min="1" max="500" v-else placeholder="最大高度：500px" v-model="Heightwidth"/>
      <div slot="footer">
        <el-button @click="controldialog = false">取 消</el-button>
        <el-button v-if="controlWH === 1" type="primary" @click="controlWidHeight(widthHeight, 500)">确 定</el-button>
        <el-button v-else type="primary" @click="controlWidHeight(Heightwidth, 500)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang='ts'>
import { downloadPdf } from "@/api/htmlToPdf"; // pdf下载方法
import { Component, Vue } from "vue-property-decorator";
import { 
  historys,
  hisXuanran,
  submitSave,
  requires
} from '@/api/offersheet.ts';
import {
  TableCom, // 单表单vue组件
  TableListCom, // 多表单vue组件
  BaseTable, // BaseTable实体类
  BaseTableList, // BaseTableList实体类
  ParamTheadAdd,
  ParamTheadDelete
} from "vue3-drag-table/lib/drag-table.umd.min";
import footers from "@/components/Quotation/footer.vue";
import headers from "@/components/Quotation/header.vue";
import { sign, signature } from "@/api/signature.ts";
import { judgeUrl, signatureUrl } from "@/utils/api";
import obj from "@/utils/bomdata.js";
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
export default class Suppliers extends Vue {
  // 上传pdf签章附加参数
  uploadData: any = {
    
  };
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
    Identification: '1'
  };
  // 设置表格宽高的弹窗
  controldialog: boolean = false;
  widthHeight: string = '';
  fileHeaders: any = {
    token: (window as any).sessionStorage.getItem("token")
  };
  Heightwidth: string = '';
  controlWH: any = 0;
  // 弹窗按钮loading
  signatureloading: boolean = false;
  // 签章弹窗
  dialogVisible: boolean = false;
  // 每一行选择后的公式
  linkageFormula: any = new Array();
  // 所有表区id的集合
  areaTable: any = new Array();
  // 所有公示表头的集合
  headTotal: any = [];
  // 获取存在公式关系单元格的行数
  formulaRow: any = new Array();
  // 表区公式关系数组
  formulaRelation: any = null;
  // 每一行公式关系的初始化
  arrayOneRow: any = new Array();
  // change事件找到的表头
  parentHead: any = null;
  // 报价单渲染时的loading
  tableloading: boolean = false;
  // 接受外部传过来的参数
  srcs: any = {};
  // 表格ID
  tableCount: any = 0;
  tmpTHead: any = null;
  tmpTable: any = null;
  tableList: any = new Array();
  // 设置了贴现率的表头集合
  discountList: any = new Array();
  // 四种贴现率
  // discountName: any = ['付款条件','贷款利率','承兑期限','贴现率'];
  discountName: any = ['0004','0005','0006','0007'];
  // 设置了BOM的表头集合
  saveList: any = new Array();
  // 所有BOM数据的集合
  BOMTotal: any = new Array();
  // BOM字段名
  bomName: any = ['物料号', '物料描述', '耗用数量', 'BOM单位'];
  // BOM字段名对应的后台key
  bomNameAfter: any = ['materialCode', 'materialdesc', 'consumptionUnit', 'basicUnit'];
  // bomName与bomNameAfter对应的下标
  findIndex: any = 100;
  // 设置了req的表头集合
  reqList: any = new Array();
  // req字段名
  reqName: any = ['模块专用号', '模块描述', '资源量', '要求供货时间', '价格单位', '采购单位', '货币', '终投单价', '需求编码', '生产工厂', '高峰月产能', '模块编码'];
  // req字段名对应的后台key
  reqNameAfter: any = ['module_code', 'module_describe', 'resource_quantity', 'supply_time', 'price_unit', 'purchasing_unit', 'currency', 'price', 'demand_code', 'p_manufacturer', 'month_capacity', 'demand_code'];
  // reqName与reqNameAfter对应的下标
  reqIndex: any = 100;
  // 报价单是否能编辑
  isedit: boolean = false;
  // 是否需要去签章
  isSignature: boolean = false;
  // 是否完成了签章 true表示没完成
  completeSignature: boolean = true;
  // 签章地址
  pdfPath: string = '';
  pdfPathDle: string = ''; // 需要删除的pdf地址
  // 签章成功地址
  pdfPathss: string = '';
  // 历史报价单下拉框
  options: any = new Array();
  // 控制右键菜单的显示
  controlMenus: boolean = false;
  heights: any = 0;
  widths: any = 0;
  // 控制右键菜单的添加父级
  controlPar: boolean = true;
  // 删除的行
  deleTarget: any = "";
  // 历史报价单的表格
  exportResult: any = new Array();
  // 保存时报价单的状态
  saveReportState: any = '';
  // 选择的历史报价单的id
  formInline: any = {
    reportVersionId: ''
  };
  // 历史报价单时间戳集合
  historyTime: any = new Array();
  // 选取最近的5个报价单
  chooseTime: any = new Array();
  // 联动表头数据
  tableHearderList: any = new Array();
  // 表尾时间
  date: any = null;
  // 上传的文件
  fileList1: any = new Array();
  // 判断部署环境
  judgeUrls: any = '';
  // loadRequest: any = {
  //   reportEntityList: []
  // };
  created() {
    this.judgeUrls = judgeUrl();
    if (this.judgeUrls === '003') {
      this.dataStart();
    }
    this.srcs = JSON.parse((window as any).sessionStorage.getItem("baojiaData"));
    this.handleDialog();
    const params: any = {
      reportVersionId: this.srcs.reportVersionId,
      resultDate: this.srcs.resultDate,
    };
    if (this.judgeUrls !== '002') {
      params.supplierCode = this.srcs.supplierCode;
    }
    this.InitializationTable(params);
    this.uploadData = sign(); // 签章注册附加参数
    // console.log(this.uploadData, '签章参数')
  }
  // 取所有设置贴现率、BOM数据的 只限于列
  discountSearch() {
    this.discountList = new Array();
    this.saveList = new Array();
    this.tableList.forEach((element: any) => {
      element.tableHeadTop.forEach((elements: any) => {
        elements.forEach((ele: any) => {
          // 贴现率的表头搜索
          const findDiscount = this.discountName.indexOf(ele.userData.logicalAcquisitionType);
          if (findDiscount !== -1) {
            const arr: any = new Array();
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
  discountRate(tableTar: any,element: any, key: string) {
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
  payment(tableTar: any,element: any, key: string) {
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
  // 渲染bom、贴现率、需求过来的数据
  bomsearchs(array: any, total: any, after: any) {
    // 如果表头设置过BOM
    console.log(array, total, '渲染外部数据');
    array.forEach((element: any) => {
      const tableTar = this.tableList[parseInt(element[0].table.substring(1), 10)-1];
      const arr = this.getBom(element[1], total, after);
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
  // 取对应表名的逻辑数据集合
  getBom(str: any, target: any, after: any) {
    const arr: any = new Array();
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
    this.reqList = new Array();
    this.reqIndex = -1;
    this.tableList[0].tableHeadTop.forEach((elements: any) => {
      elements.forEach((ele: any) => {
        this.reqIndex = this.reqName.indexOf(ele.cell.content);
        if (this.reqIndex !== -1&&ele.userData.logicalAcquisitionType==='0003') {
        // if (this.reqIndex !== -1&&ele.userData.acquisitionMode==='0002') {
          const arr: any = new Array();
          arr.push(ele.position, this.reqIndex);
          this.reqList.push(arr);
        }
      });
    });
    if (this.reqList.length!==0) {
      const params = {
        reportId: this.srcs.reportId
      };
      requires(params)
        .then((res: any) => {
          if (res.resultData.length!==0) {
            this.bomsearchs(this.reqList, res.resultData, this.reqNameAfter);
            // this.bomsearchs(this.reqList, obj[1], this.reqNameAfter);
          }
        })
        .catch((err: any) => {
          // 
        });
    }
  }
  // 保存/提交按钮
  saveInlocal(val: any, jiao: any) {
    this.signatureloading = false;
    const params: any = {
      report_version_id: this.srcs.reportVersionId, // 填报单标识
      report_state: this.saveReportState, // 填报单状态
      report_script: '' // 填报单回显脚本
    };
    // 提交按钮触发的
    if (val === 3) {
      if (!this.checkTable()) {
        this.$message.error('表格类型输入不正确 或 表格必填项存在空值！');return;
      }
      // 校验表尾
      if (!this.checkfooter()) {
        return;
      }
      // 需要线上签章
      if (this.isSignature) {
        // 是否完成了签章
        if (this.completeSignature) {
          this.dialogVisible = true;
          return;
        } else {
          params.signed_report_address = this.pdfPathss;
          params.sign_state = '0002';
        }
      }
      params.report_state = '0003';
      params.report_script = this.exportTbodyData();
    } else if (val === 2) {
      // 保存触发的
      params.report_script = this.exportTbodyData();
    } else {
      // 页面初始进入触发的
      params.report_script = jiao;
    }
    this.tableloading = true;
    submitSave(params)
      .then((res: any) => {
        this.tableloading = false;
        // 保存和提交都要更新一下报价单
        if (val !== 1) {
          if (res.success) {
            this.srcs.reportVersionId = res.resultData;
            this.$message.success('操作成功');
            const paramse: any = {
              reportVersionId: this.srcs.reportVersionId,
              resultDate: this.srcs.resultDate,
            };
            if (this.judgeUrls !== '002') {
              paramse.supplierCode = this.srcs.supplierCode;
            }
            this.InitializationTable(paramse);
          } else {
            this.$message.error('操作失败!');
          }
        } else {
          this.srcs.reportVersionId = res.resultData;
        }
      })
      .catch((err: any) => {
        this.tableloading = false;
      });
  }
  // 初始化表格
  InitializationTable(val: any) {
    this.tableloading = true;
    hisXuanran(val)
      .then((res: any) => {
        // const tmpSaveJson = JSON.parse((window as any).sessionStorage.getItem("thediffirent"));
        if (!res.resultData.hasOwnProperty('reportScript')) {
          this.tableloading = false;
          this.$message.error(res.resultData);return;
        }
        // 判断报价单状态
        let tableSubject = this.onTableChange;
        this.saveReportState = res.resultData.reportState;
        if (res.resultData.reportState === '0003') {
          this.isedit = true;
          tableSubject = this.onTableChanges;
        } else if (res.resultData.reportState === '0001') {
          this.saveReportState = '0002';
          this.saveInlocal(1, res.resultData.reportScript);
        }
        // 判断是否需要去签章
        if (res.resultData.signState==='0001'&&(res.resultData.signatureState==='0001'||res.resultData.signatureState==='线上CA签章')) {
          this.isSignature = true;
        }
        const tmpSaveJson = JSON.parse(res.resultData.reportScript);
        // 渲染结构
        if (tmpSaveJson instanceof Array) {
          if (tmpSaveJson[0] instanceof Array) {
            // 报价单结构
            this.savecom(tmpSaveJson[0], tableSubject);
            // // 报价单数据
            // // 报价单表尾结构
            this.tabFootJson = tmpSaveJson[1];
            this.tabFootJson = tmpSaveJson[2];
          } else {
            // 老版模板结构
            this.savecom(tmpSaveJson, tableSubject);
          }
        } else {
          // 新版模板结构
          this.savecom(tmpSaveJson.serializedTemp, tableSubject);
          this.tabHeadJson = tmpSaveJson.headTemp;
          this.tabFootJson = tmpSaveJson.footTemp;
        }
        this.tabFootJson.corporateName = this.srcs.company;
        this.tabHeadJson.quotationNum = res.resultData.reportCode;
        // 判断是否有从需求带过来的固定表头
        this.requiresH();
        // 贴现率操作
        this.discountSearch();
        // bom数据操作
        this.BOMTotal = res.resultData.bomPhotoList;
        // this.BOMTotal = obj[0];
        if (this.saveList.length!==0&&this.BOMTotal.length!==0) {
          this.bomsearchs(this.saveList, this.BOMTotal, this.bomNameAfter);
        }
        this.tableloading = false;
        // (window as any).sessionStorage.setItem("thediffirent", JSON.stringify(tmpSaveJson));
      })
      .catch((err: any) => {
        this.tableloading = false;
      });
  }
  // 取值渲染表的结构
  savecom(arr: any, fun: any) {
    // 初始化表格集合及公式关系数组，公式行数组
    this.tableList = new Array();
    this.linkageFormula = new Array();
    this.areaTable = new Array();
    this.formulaRow = new Array();
    const nullArray = new Array();
    arr.forEach((table: BaseTable) => {
      const tableJSON = JSON.parse(JSON.stringify(table));
      const tmpTable: BaseTable = new BaseTable(tableJSON.id, {
        tableGroupId: "yuhaier",
        hasLeftFixedTable: false
      });
      tmpTable.deserialize(table);
      tmpTable.tableSubject.subscribe(fun, this);
      // 隐藏表头标记
      tmpTable.setConfig({
        isShowColIndex: false,
        canResizeWidth: false,
        isShowRowIndex: false,
        isTopLeftShow: false
      });
      // 控制是否编辑
      if (this.isedit) {
        this.unSelect(tmpTable);
      }
      this.linkageFormula.push(nullArray.slice(0));
      this.formulaRow.push(nullArray.slice(0));
      this.tableList.push(tmpTable);
      this.areaTable.push(tmpTable.position.table);
      // this.tmpTable = tmpTable;
    });
    // 取消默认拖拽
    this.tableList.forEach((element: any) => {
      element.theadTopEntity.draggable = false;
      element.theadTopIndexEntity.draggable = false;
      element.theadLeftEntity.draggable = false;
      element.theadLeftIndexEntity.draggable = false;
      // 是否需要联动还原
      if (element.userData.isLinkage === true) {
        this.tabularLinkage(element.position);
      }
    });
  }
  // 导出结果
  exportTbodyData() {
    const ends: any = new Array();
    const xulie: any = new Array();
    // 导出结构
    this.tableList.forEach((table: BaseTable) => {
      const tmpSaveJson = table.serialize();
      for (const key in tmpSaveJson) {
        if (tmpSaveJson.hasOwnProperty(key)) {
          JSON.stringify(tmpSaveJson[key]);
        }
      }
      xulie.push(tmpSaveJson);
    });
    ends.push(xulie);
    // 导出表尾
    const footData = (this.$refs.childrenTwo as any).formJson;
    this.getDate();
    footData.date = this.date;
    footData.corporateName = this.srcs.company;
    ends.push(footData);
    // 导出表头
    ends.push(this.tabHeadJson);
    return JSON.stringify(ends);
  }
  // 可编辑表格回调
  onTableChange(msg: any) {
    switch (msg.ev_type) {
      case "click":
      this.tmpTHead = msg.data.object;
      this.tmpTable = this.tmpTHead.$rootTable;
      this.controlMenus = false;
      console.log(msg);
      // 取消默认表头可编辑
      if (msg.data.object.$rootParent.type !== "tbody") {
        msg.data.object.cell.displayClass.dbclick.displayType = "text";
      }
      break;
      case "rightClick":
      document.oncontextmenu = () => {
        return false;
      };
      // 更新定位
      this.tmpTHead = msg.data.object;
      this.deleTarget = msg.data.object;
      this.tmpTable = this.deleTarget.$rootTable;
      // 表头才有添加父级，表区才能删除
      if (msg.data.object.$rootParent.type !== "tbody") {
        this.controlPar = true;
      } else {
        this.controlPar = false;
      }
      // 菜单的位置
      this.controlMenus = true;
      // this.widths = msg.event.clientX;
      this.widths = msg.event.pageX;
      this.heights = msg.event.pageY;
      (this.$refs.tests as HTMLElement).style.left = this.widths + "px";
      (this.$refs.tests as HTMLElement).style.top = this.heights + "px";
      break;
      case "dbclick":
      this.tmpTHead.cell.style.backgroundColor = 'transparent';
      break;
      case "blur":
      // 失焦校验
      this.blurCheck(msg.data.object);
      if (this.tmpTHead.type === "tbody") {
        if (this.tmpTable.tableHeadLeft.length == 0) {
          if (
            this.tmpTable.tableHeadTop[0][this.tmpTHead.position.colNum]
              .userData.formulaMode == "0002"
          ) {
            this.cellCheck(
              this.tmpTHead.cell.value,
              this.tmpTable.tableHeadTop[0][this.tmpTHead.position.colNum]
                .userData
            );
          }
        } else if (this.tmpTable.tableHeadTop.length == 0) {
          if (
            this.tmpTable.tableHeadLeft[this.tmpTHead.position.rowNum][0]
              .userData.formulaMode == "0002"
          ) {
            this.cellCheck(
              this.tmpTHead.cell.value,
              this.tmpTable.tableHeadLeft[this.tmpTHead.position.rowNum][0]
                .userData
            );
          }
        }
      }
      break;
      case "change":
      this.formula(msg.data.object);
      this.changeLinkage(msg.data.object);
      break;
      default:
    }
  }
  // 不可编辑表格回调
  onTableChanges(msg: any) {
    console.log(msg);
    switch (msg.ev_type) {
      case "click":
        msg.data.object.cell.displayClass.dbclick.displayType = "text";
        break;
    }
  }
  // 非联动公式关系判断
  formula(objects: any) {
    this.tmpTable = objects.$parent.$rootTable;
    const pos = objects.$parent.position;
    const poss = {
      colNum: pos.colNum,
      colStr: pos.colStr,
      rowNum: 0,
      rowStr: 1,
      table: pos.table
    };
    // 判断该表区是否存在公式联动关系
    if (
      this.tmpTable.userData.hasOwnProperty("List") &&
      this.judgeHead(
        poss,
        this.tmpTable.userData.List[0].pos,
        this.tmpTable.tableHeadTop.length
      )
    ) {
      // 选中表区的index
      const chooseTheArea = this.areaTable.indexOf(pos.table);
      if (this.formulaRow[chooseTheArea].length === 0) {
        this.totalRowFormula(chooseTheArea);
      }
      const weizhi = this.formulaRow[chooseTheArea].indexOf(pos.rowStr);
      if (weizhi !== -1) {
        this.judgeFormula(
          this.chooseRowFormula(
            this.parentHead.id,
            objects.select.selectOption.value,
            weizhi,
            this.headTotal.indexOf(this.parentHead.position.colNum),
            chooseTheArea
          )
        );
      }
    }
  }
  // 判断对象是否在数组对象中
  judgeHead(str: any, arr: any, lang: any) {
    if (typeof arr === "string") {
      arr = JSON.parse(arr);
    }
    this.formulaRelation = arr;
    this.headTotal = [];
    arr.forEach((element: any) => {
      this.headTotal.push(element.colNum);
    });
    this.headTotal = this.headTotal.sort((a: any, b: any) => {
      return a-b;
    });
    for (let j = 0; j < lang; j++) {
      str.rowNum = j;
      str.rowStr = j + 1;
      for (let i = 0; i < arr.length; i++) {
        const poss = {
          colNum: arr[i].colNum,
          colStr: arr[i].colStr,
          rowNum: arr[i].rowNum,
          rowStr: arr[i].rowStr,
          table: arr[i].table
        };
        if (JSON.stringify(poss) === JSON.stringify(str)) {
          this.parentHead = this.tmpTable.getContainer(poss);
          return true;
        }
      }
    }
    return false;
  }
  // 存在公式关系单元格所在行集合
  totalRowFormula(index: any) {
    this.formulaRow[index] = [];
    this.linkageFormula[index] = [];
    this.arrayOneRow = new Array();
    for (let m = 0; m < this.headTotal.length; m++) {
      this.arrayOneRow.push('');
    }
    for (let i = 0; i < this.tmpTable.tableBody.length; i++) {
      this.formulaRow[index].push(this.tmpTable.tableBody[i][0].position.rowStr);
      this.linkageFormula[index].push(this.arrayOneRow.slice(0, this.arrayOneRow.length));
    }
    // 初始渲染时 加入脚本中的公式关系下拉选项值
    if (this.headTotal.length>1) {
      this.tmpTable.tableBody.forEach((element: any, indexss: any) => {
        this.headTotal.forEach((ele: any, indexs: any) => {
          const headCol = ele-this.tmpTable.tableHeadTop[0][0].position.colNum;
          if (element[headCol].cell.content!=='') {
            this.linkageFormula[index][indexss][indexs] = this.tmpTable.getContainer(this.formulaRelation[indexs]).id + "|" + this.chooseSelect(element[headCol].cell.content, element[headCol].cell.select.optionList);
          }
        });
      });
    }
    return this.formulaRow;
  }
  // 判断联动关系是否一致，一致才触发公式渲染
  judgeFormula(str: any) {
    let pand = false;
    for (let i = 0; i < this.tmpTable.userData.List[0].r.length; i++) {
      if (pand) {
        break;
      }
      for (
        let j = 0;
        j < this.tmpTable.userData.List[0].r[i].head.length;
        j++
      ) {
        const lalala = this.tmpTable.userData.List[0].r[i].head[j];
        const target = this.tmpTable.getContainer({
          colNum: lalala.position.colNum,
          colStr: lalala.position.colStr,
          rowNum: this.formulaRow[str.areas][str.ids] - 1,
          rowStr: this.formulaRow[str.areas][str.ids],
          table: lalala.position.table
        });
        // console.log(str, '判断联动关系是否一致', this.tmpTable.userData.List[0].r[i].g);
        if (str.vals === this.tmpTable.userData.List[0].r[i].g) {
          pand = true;
          target.renderByThead = false;
          target.cell.verification.hasVerification = true;
          target.cell.verification.vTypes = [];
          if (lalala.val !== "") {
            const ti = this.formulaRow[str.areas][str.ids] + "";
            let gong = lalala.val.replace(/{sr}/g, ti);
            // 优化   不管用户有没有输入“ = ”，都能正常计算
            if (gong[0]!=='=') {
              gong = "=" + gong;
            }
            target.cell.value = gong;
            target.cell.displayClass.dbclick.displayType = "text";
            this.tmpTable.render();
          } else if (lalala.type === "002") {
            target.cell.displayClass.dbclick.displayType = "text";
            target.cell.value = "\\";
            target.cell.content = "\\";
          } else if (lalala.type === "003") {
            target.cell.verification.vTypes = ["notNull"];
            target.cell.value = "必填";
            target.cell.content = "必填";
          } else if (lalala.type === "001") {
            target.cell.value = "选填";
            target.cell.content = "选填";
          }
        } else {
          pand = false;
          target.renderByThead = true;
          target.cell.value = "";
          target.cell.content = "";
          target.cell.verification.vTypes = [];
          target.cell.displayClass.dbclick.displayType = "input";
          target.cell.style.backgroundColor = "transparent";
        }
      }
    }
  }
  // 传值公式处理
  chooseRowFormula(str: any, strs: any, index: any, headIndex: any, area: any) {
    this.linkageFormula[area][index][headIndex] = str + "|" + strs;
    const chuans = {
      vals: this.linkageFormula[area][index].join(),
      ids: index,
      areas: area
    };
    console.log(this.linkageFormula,'公式集合', this.headTotal,'表头集合', this.formulaRow, '行数集合', area);
    return chuans;
  }
  // 初始公式下拉框选中值的id
  chooseSelect(val: any, arr: any) {
    for (let m = 1; m < arr.length; m++) {
      if (val === arr[m].text) {
        return arr[m].value;
      }
    } 
  }
  // select不可编辑
  unSelect(tmpTable: any) {
    tmpTable.setDefaultConfig({
      baseTbody: {
        readonly: true
      }
    });
  }
  // 失焦校验，false会清空value值
  blurCheck(container: any) {
    // 校验小数 自动补齐位数的功能
    container.verification.vTypes.forEach((element: any) => {
      if (/^decimal%\d+$/.test(element)) {
        const digits = +element.split('%')[1];
        if (/^\d$/.test(container.content)) {
          container.value += ".";
          this.addZero(container, digits);
        } else if (/^\d\.\d+$/.test(container.content)) {
          const decimal = digits - container.content.split('.')[1].length;
          if (decimal>0) {
            this.addZero(container, decimal);
          }
        }
      }
    });
    // 校验清空功能
    if (!container.verification.state) {
      container.content = '';
      container.value = '';
      if (container.verification.vTypes.indexOf('notNull')===-1) {
        container.verification.state = true;
      }
    }
  }
  // 补零
  addZero(val: any, index: any) {
    for (let i = 0; i < index; i++) {
      val.value += '0';
    }
    val.content = val.value;
  }
  // 单元格校验
  cellCheck(num: any, form: any) {
    if (/^[0-9]*$/.test(num)) {
      if (form.formulaSymbol1 && form.formulatxt2) {
        const b = num + form.formulaSymbol1 + form.formulatxt2;
        const c = num + form.formulaSymbol2 + form.formulatxt3;
        if (!eval(b)) {
          this.tmpTHead.cell.content = "";
          this.$alert(
            `单元格值需要：‘${form.formulaSymbol1 + form.formulatxt2}’`,
            "错误提示",
            {
              confirmButtonText: "确定"
            }
          );
        }
      }
      if (form.formulaSymbol2 && form.formulatxt3) {
        const c = num + form.formulaSymbol2 + form.formulatxt3;
        if (!eval(c)) {
          this.tmpTHead.cell.content = "";
          this.$alert(
            `单元格值需要：‘${form.formulaSymbol2 + form.formulatxt3}’`,
            "错误提示",
            {
              confirmButtonText: "确定"
            }
          );
        }
      }
    } else {
      this.tmpTHead.cell.content = "";
      this.$alert(`请输入数字`, "错误提示", {
        confirmButtonText: "确定"
      });
    }
  }
  // 保存提交时的表格校验（必填项+类型）
  checkTable() {
    for (let i = 0; i < this.tableList.length; i++) {
      for (let j = 0; j < this.tableList[i].tableBody.length; j++) {
        for (let m = 0; m < this.tableList[i].tableBody[j].length; m++) {
          const ele = this.tableList[i].tableBody[j][m];
          if (ele.cell.verification.state === false) {
            ele.cell.style.backgroundColor = 'red';
            return false;
          }
        }
      }
    }
    return true;
  }
  // 保存提交时表尾必填项的校验
  checkfooter() {
    const footData = (this.$refs.childrenTwo as any).formJson;
    if (footData.name===''||footData.tel==='') {
      this.$message.error('供应商签字 或 电话不能为空！');
      return false;
    } else if (!(/^1[3-9]\d{9}$/.test(footData.tel))) {
      this.$message.error('请填写合法的电话！');
      return false;
    } else {
      return true;
    }
  }
  // 联动数据处理
  tabularLinkage(position?: any) {
    const data = this.tableList[parseInt(position.table.substring(1))-1].userData.data;
    // 第一个表头的下拉列表
    const selectLinkageData: any = new Array(); // 获取data里面的一级表头的下拉数据
    data.forEach((element: any) => {
      if (element.type === "select") {
        const tmp = {
          text: element.name,
          value: element.id
        };
        selectLinkageData.push(element);
      }
    });
    // 获取第一级联动相关信息
    const firstLinkageData: any = new Array();
    data.forEach((element: any) => {
      if (element.rid === "") {
        firstLinkageData.push(element);
      }
    });
    const firstHeadMsg = selectLinkageData.find((element: any) => {
      return firstLinkageData[0].pid === element.id;
    });
    const selectListData: any = [{ text: "", value: "" }]; // 往cell里面塞得数据
    data.forEach((element: any) => {
      if (element.pid === firstHeadMsg.id) {
        const tmp = {
          text: element.name,
          value: element.id
        };
        selectListData.push(tmp);
      }
    });
    // this.tableList[1] 要换成具体的哪个表
    const container = this.tableList[parseInt(position.table.substring(1))-1].getContainer(
      firstHeadMsg.position
    );
    this.typeEnumeration(container, selectListData);
    this.tableList[parseInt(position.table.substring(1))-1].render();
  }
  // 枚举类型数据处理
  typeEnumeration(container: any, data: any) {
    const myTbodyConfig = {
      weight: {
        // 提高权重
        cell: {
          displayClass: {
            normal: 101,
            dbclick: 101
          }
        }
      },
      container: {
        // style:{backgroundColor: "#b7d4f8"},
        cell: {
          displayClass: {
            normal: {
              displayType: "select",
              select: {
                optionList: data
              }
            },
            dbclick: {
              displayType: "text"
            }
          }
        }
      }
    };
    container.tbodyConfig = myTbodyConfig;
    this.tmpTable.render();
  }
  // 联动
  changeLinkage(msg: any) {
    const headTopData = this.tmpTHead.getTopIndexContainer(
      this.tmpTHead.position
    ).$theadContainer;
    if (headTopData.userData.linkageSet === "是") {
      const myLinkageData: any = {
        data: this.tmpTable.userData.data, // 全部联动数据
        selectData: this.tmpTable.userData.tableHearderList, // 全部type=slelct的联动数据
        valueData: [], // 全部type=value的联动数据
        nowHeadData: {}, // 当前表头信息
        nowValueId: this.tmpTHead.cell.select.selectOption.value
          ? this.tmpTHead.cell.select.selectOption.value
          : "", // 当前选中数据的id
        nowValueData: {}, // 当前选中值的数据
        nextHeadData: [], // 下一级联动的所有表头信息
        nextHeadId: [], // 下一级联动的表头id
        nextOtherHeadId: [], // 下一级关联表头除选中表头的其他表头id
        nextOtherHeadData: [], // 下一级关联表头除选中表头的其他表头数据
        nextAllListData: [], // 下一级联动的所有列表数据
        nextAllIdHeadId: [], // 下一级联动的所有表头id
        tempPosition: {}
      };
      // console.log("全部select",this.tmpTable.userData.tableHearderList)
      if (myLinkageData.nowValueId != "") {
        myLinkageData.nowValueData = myLinkageData.data.find((element: any) => {
          return element.id === myLinkageData.nowValueId;
        });
        // console.log("当前选中值的数据", myLinkageData.nowValueData);
        myLinkageData.nowHeadData = myLinkageData.selectData.find(
          (element: any) => {
            return element.id === myLinkageData.nowValueData.pid;
          }
        );
        // console.log("当前表头信息", myLinkageData.nowHeadData);
        myLinkageData.data.forEach((element: any) => {
          if (element.type === "value") {
            myLinkageData.valueData.push(element);
            if (element.rid === myLinkageData.nowValueId) {
              myLinkageData.nextAllListData.push(element);
              myLinkageData.nextAllIdHeadId.push(element.pid);
            }
          }
        });
        // 下一级联动的所有表头id（去重）
        myLinkageData.nextHeadId = myLinkageData.nextAllIdHeadId.filter(
          (keyword: any, index: any) => {
            return myLinkageData.nextAllIdHeadId.lastIndexOf(keyword) === index;
          }
        );
        // console.log("下一级联动的表头id", myLinkageData.nextHeadId);
        myLinkageData.nextOtherHeadId = JSON.parse(
          JSON.stringify(myLinkageData.nowHeadData.linkeageId)
        );
        myLinkageData.nextHeadId.forEach((element: any) => {
          myLinkageData.nextOtherHeadId.splice(
            myLinkageData.nextOtherHeadId.indexOf(element),
            1
          );
        });
        // console.log("下一级关联表头除选中表头的其他表头id", myLinkageData.nextOtherHeadId);
        if (myLinkageData.nextHeadId.length > 0) {
          myLinkageData.selectData.forEach((element: any) => {
            myLinkageData.nextHeadId.forEach((ele: any) => {
              if (element.id === ele) {
                myLinkageData.nextHeadData.push(element);
              }
            });
          });
        }
        // console.log("下一级联动的表头数据", myLinkageData.nextHeadData);
        // 其他表头数据清空
        if (myLinkageData.nextOtherHeadId.length > 0) {
          this.getNextLinkageNull(
            myLinkageData.nextOtherHeadId,
            myLinkageData.selectData
          );
        }
        // console.log(
        //   "下一级联动的其他的表头数据",
        //   myLinkageData.nextOtherHeadData
        // );
        // 下一级数据联动
        if (myLinkageData.nextHeadData.length > 0) {
          myLinkageData.nextHeadData.forEach((a: any) => {
            const listData: any = [{ text: "", value: "" }];
            myLinkageData.tempPosition = {
              colNum: a.position.colNum,
              colStr: a.position.colStr,
              rowNum: this.tmpTHead.position.rowNum,
              rowStr: this.tmpTHead.position.rowStr,
              table: this.tmpTHead.position.table
            };
            // console.log("下一个联动位置", myLinkageData.tempPosition);
            const container = this.tmpTable.getContainer(a.position);
            // console.log("下一集联动表头的下一级联动表头",a.linkeageId)
            myLinkageData.nextAllListData.forEach((b: any) => {
              if (a.id === b.pid) {
                const tempEle = {
                  text: b.name,
                  value: b.id
                };
                // console.log(tempEle);
                listData.push(tempEle);
              }
            });
            // console.log("select数据", listData);
            this.typeEnumeration(container, listData);
            // *********** 往下一个联动单元格塞数据 start ****************
            const nextContainer = this.tmpTable.getContainer(
              myLinkageData.tempPosition
            );
            nextContainer.cell.setCellData({
              displayClass: {
                normal: {
                  displayType: "select",
                  select: { optionList: listData }
                }
              }
            });
            nextContainer.renderByThead = false;
            this.tmpTable.render();
            // console.log("nextContainer.cell", nextContainer.cell);
            // *********** 往下一个联动单元格塞数据 end ****************
            this.getNextLinkageNull(a.linkeageId, myLinkageData.selectData);
          });
        }
      } else {
        // 空值时，清空下一级数据
        let nextCell: any = {};
        const headTopDataStr = JSON.stringify(headTopData.position);
        myLinkageData.selectData.forEach((a: any) => {
          if (headTopDataStr == JSON.stringify(a.position)) {
            nextCell = a;
          }
        });
        // console.log("nextCell.linkeageId", nextCell.linkeageId);
        this.getNextLinkageNull(nextCell.linkeageId, myLinkageData.selectData);
      }
    }
  }
  // 联动数据清空方法
  getNextLinkageNull(nowData: any, allData: any) {
    if (nowData.length > 0) {
      nowData.forEach((b: any) => {
        allData.find((a: any) => {
          if (a.id == b) {
            // console.log("联动数据清空方法---a",a)
            const position = {
              colNum: a.position.colNum,
              colStr: a.position.colStr,
              rowNum: this.tmpTHead.position.rowNum,
              rowStr: this.tmpTHead.position.rowStr,
              table: this.tmpTHead.position.table
            };
            // console.log("联动数据清空方法---position",position)
            const container = this.tmpTable.getContainer(position);
            container.cell.setProperty("value", "");
            // container.cell.setProperty("title", "");
            container.cell.setCellData({
              displayClass: {
                normal: { displayType: "select", select: { optionList: new Array(),selectOption:null } }
              }
            });
            container.renderByThead = false;
            // console.log("联动数据清空方法---container",container)
            if (a.linkeageId.length > 0) {
              this.getNextLinkageNull(a.linkeageId, allData);
            }
            return;
          }
        });
      });
      // allData.forEach((a: any) => {
      //   nowData.forEach((b: any) => {
      //     if (a.id == b) {
      //       const position = {
      //         colNum: a.position.colNum,
      //         colStr: a.position.colStr,
      //         rowNum: this.tmpTHead.position.rowNum,
      //         rowStr: this.tmpTHead.position.rowStr,
      //         table: this.tmpTHead.position.table
      //       };
      //       const container = this.tmpTable.getContainer(position);
      //       container.cell.setProperty("value", "");
      //       container.cell.setProperty("title", "");
      //       container.cell.setCellData({displayClass:{normal: {displayType: "select",select: {optionList:[]}}}});
      //       if (a.linkeageId.length > 0) {
      //         this.getNextLinkageNull(a.linkeageId,allData)
      //       }
      //     }
      //   });
      // });
    }
  }
  // 历史报价单 下拉框选项
  handleDialog() {
    const params: any = {
      module_code: this.srcs.moduleCode, // 模块专用号
      module_describe: '' // 物料号关键字
    };
    if (this.judgeUrls !== '002') {
      params.supplier_code = this.srcs.supplierCode;
    }
    this.historyTime = new Array();
    historys(params)
      .then((res: any) => {
        res.resultData.forEach((element: any) => {
          // 日期转时间戳
          const date = new Date(element.report_date.replace(/-/g, '/'));
          this.historyTime.push(date.getTime());
        });
        // 找出报价单最近的5个日期
        this.chooseTime = JSON.parse(JSON.stringify(this.historyTime));
        const dates = new Date(this.srcs.resultDate.replace(/-/g, '/'));
        const dateTar = dates.getTime();
        this.chooseTime.push(dateTar);
        this.chooseTime = this.chooseTime.sort((a: any, b: any) => {
          return b-a;
        });
        let target = 0;
        this.chooseTime.some((ele: any, index: any) => {
          target = index;
          return ele === dateTar;
        });
        this.chooseTime.splice(target,1);
        if (target < 3) {
          this.chooseTime.splice(5,this.historyTime.length-4);
        } else if (target > this.historyTime.length-3) {
          this.chooseTime.splice(0,this.historyTime.length-5);
        } else {
          const tarArr = new Array();
          tarArr.push(this.chooseTime[target+1], this.chooseTime[target], this.chooseTime[target-1], this.chooseTime[target-2]);
          if ((this.chooseTime[target+2]-dateTar)<(this.chooseTime[target-3]-dateTar)) {
            tarArr.unshift(this.chooseTime[target+2]);
          } else {
            tarArr.push(this.chooseTime[target-3]);
          }
          this.chooseTime = tarArr;
        }
        // 找出对应的报价单信息
        this.chooseTime.forEach((element: any) => {
          let findIndex = 0;
          for (let i = 0; i < this.historyTime.length; i++) {
            if (element === this.historyTime[i]) {
              findIndex = i;
              break;
            }
          }
          const theOption = {
            report_version_id: res.resultData[findIndex].report_version_id+','+res.resultData[findIndex].report_date,
            module_describe: res.resultData[findIndex].module_describe
          };
          this.options.push(theOption);
        });
        console.log(this.options, '最近的5个报价单，升序');
      })
      .catch((err: any) => {
        //
      });
  }
  // 匹配某个历史报价单的对应数据
  chooseHis() {
    const operate = this.formInline.reportVersionId.split(',');
    const params: any = {
      reportVersionId: operate[0],
      resultDate: operate[1],
    };
    if (this.judgeUrls !== '002') {
      params.supplierCode = this.srcs.supplierCode;
    }
    this.tableloading = true;
    hisXuanran(params)
      .then((res: any) => {
        this.exportResult = new Array();
        // 渲染结构
        // const tmpSaveJsons = JSON.parse((window as any).localStorage.getItem("thediffirent"));
        const tmpSaveJsons = JSON.parse(res.resultData.reportScript);
        let tmpSaveJsonHis = tmpSaveJsons;
        if (tmpSaveJsons instanceof Array) {
          if (tmpSaveJsons[0] instanceof Array) {
            tmpSaveJsonHis = tmpSaveJsons[0];
          }
        } else {
          tmpSaveJsonHis = tmpSaveJsons.serializedTemp;
        }
        tmpSaveJsonHis.forEach((savetable: BaseTable) => {
          const tableJSON = JSON.parse(JSON.stringify(savetable));
          const tmpTableSave: BaseTable = new BaseTable(tableJSON.id, {
            tableGroupId: "haier",
            isTopLeftShow: false,
            isShowColIndex: false,
            isShowRowIndex: false,
            hasLeftFixedTable: false
          });
          tmpTableSave.deserialize(savetable);
          tmpTableSave.tableSubject.subscribe(this.onTableChanges, this);
          tmpTableSave.render();
          this.exportResult.push(tmpTableSave);
        });
        console.log(this.exportResult, '旧的');
        this.tableList.forEach((element: any, index: any) => {
          if (this.exportResult[index]) {
            const lengths = element.tableHeadTop.length - this.exportResult[index].tableHeadTop.length;
            element.tableHeadTop.forEach((ele: any) => {
              ele.forEach((head: any) => {
                // console.log(head.cell.content!=='', head.children.length===0, head.userData.acquisitionMode, head.userData.type);
                if (head.cell.content!==''&&head.children.length===0&&head.userData.acquisitionMode!=='0002'&&head.userData.type!=='0001') {
                  this.historyCell(head, index, lengths);
                }
              });
            });
            element.render();
          }
        });
        this.tableloading = false;
        this.$message.success('历史数据渲染成功');
      })
      .catch((err: any) => {
        this.$message.error('历史数据渲染失败');
        this.tableloading = false;
      });
  }
  // 渲染同表区 同字段名称的单元格值
  historyCell(head: any, index: any, lengths: any) {
    const target = this.exportResult[index].tableHeadTop;
    for (let i = 0; i < target.length; i++) {
      for (let j = 0; j < target[i].length; j++) {
        if (target[i][j].children.length===0&&head.cell.content === target[i][j].cell.content) {
          const oldArr = target[i][j].getColObj(target[i][j].position);
          const newArr = head.getColObj(head.position);
          for (const key in newArr) {
            if (!newArr[key].hasOwnProperty('$dragType')) {
              const oldindex = (+key-lengths).toString();
              if(oldArr[oldindex]!==undefined&&!/^=/.test(newArr[key].cell.value)) {
                newArr[key].cell.content = oldArr[oldindex].cell.content;
                newArr[key].cell.value = oldArr[oldindex].cell.content;
              }
            }
          }
          return;
        }
      }
    }
  }
  // 表头组件
  getHeadJson(data: any) {
    this.tabHeadJson = data;
  }
  getFootJson(data: any) {
    this.tabFootJson = data;
  }
  // 上传下载
  handleRemove1(file: any, fileList: any) {
    //
  }
  handlePreview1(file: any) {
    //
  }
  handleExceed1(files: any, fileList: any) {
    this.$message.warning(
      `当前限制选择 1 个文件，本次选择了 ${
        files.length
      } 个文件，共选择了 ${files.length + fileList.length} 个文件`
    );
  }
  beforeRemove1(file: any, fileList: any) {
    return this.$confirm(`确定移除 ${file.name}？`);
  }
  // 上传签章的
  handleAvatarSuccess(res: any, file: any, fileList: any) {
    if(res.success === true) {
      this.dialogVisible = false;
      this.signatureloading = false;
      signature(res.resultData.message, this.srcs.reportVersionId, this.srcs.reportId, res.resultData.fileName); // 注册成功返回的message/版本id/报价单id/fileName
      this.completeSignature = true;
      let t;
      clearTimeout(t);
      t = setTimeout(() => {
        console.log((window as any).sessionStorage.getItem("signature"), 'signature');
        if ((window as any).sessionStorage.getItem("signature")) {
          this.$message.success('签章成功');
          this.completeSignature = false;
          this.saveInlocal(3, '');
        } else {
          this.$message.error('签章失败，请重试！');
        }
      }, 500);
    } else {
      this.$message.error(res.errorMsg + '，请重试！');
      this.dialogVisible = false;
    }
  }
  handlePreview(file: any) {
    //
  }
  handleExceed(files: any, fileList: any) {
    this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
  }
  UploadUrl() {
    // return "http://10.163.2.19:80/haiercostsupport/file/upload"; // pdf上传地址
    // return signatureUrl() + 'file/upload';
    return signatureUrl() + 'file/checkAndRegister';
  }
  beforeAvatarUpload(file: any) {
    // const isJPG = file.type === 'image/pdf';
    const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isJPG) {
    // this.$message.error('上传图片只能是 PDF 格式!');
    // }
    if (!isLt2M) {
      this.$message.error('上传图片大小不能超过 2MB!');
    }
    this.signatureloading = true;
    return isLt2M;
    // return isJPG && isLt2M;
  }
  handleRemove(file: any, fileList: any) {
    //
  }
  beforeRemove(file: any, fileList: any) {
    return this.$confirm(`确定移除 ${ file.name }？`);
  }
  // 生成pdf
  downloadPDF() {
    const title = '下载的报价单'; // 这是下载后文件的名称
    downloadPdf();
  }
  // 菜单
  addUnit() {
    // 添加行
    this.controlMenus = false;
    const table: BaseTable = this.tmpTable;
    table.addOneRow();
    // 添加某行时，对该表区公式关系的优化处理
    const area = this.areaTable.indexOf(this.deleTarget.position.table);
    if (this.tableList[area].userData.hasOwnProperty("List")&&this.formulaRow[area].length!==0) {
      this.formulaRow[area].push(this.tmpTable.tableBody[this.tmpTable.tableBody.length-1][0].position.rowStr);
      const insert = this.tmpTHead.position.rowStr - this.tmpTable.tableBody[0][0].position.rowStr;
      this.linkageFormula[area].splice(insert, 0 ,this.arrayOneRow.slice(0, this.arrayOneRow.length));
    }
  }
  deleUnit(data: any) {
    // 删除行和列
    this.controlMenus = false;
    const table: BaseTable = this.tmpTable;
    table.delOneRowCol(data);
    table.render();
    // this.destroyTmptable(this.tmpTable);
    // 删除某行时，对该表区公式关系的优化处理
    const area = this.areaTable.indexOf(this.deleTarget.position.table);
    if (data === "row" && this.tableList[area].userData.hasOwnProperty("List")&&this.formulaRow[area].length!==0) {
      this.formulaRow[area].pop();
      const insert = this.tmpTHead.position.rowStr - this.tmpTable.tableBody[0][0].position.rowStr;
      this.linkageFormula[area].splice(insert, 1);
    }
  }
  hideMenu($event: any) {
    // 隐藏菜单
    this.controlMenus = false;
  }
  controlWidth(val: any) {
    // 设置列宽或行高
    this.controlMenus = false;
    this.controldialog = true;
    this.controlWH = val;
    if (val === 2) {
      this.Heightwidth = this.deleTarget.style.height.split('px')[0];
    } else {
      this.widthHeight = this.deleTarget.style.width.split('px')[0];
    }
  }
  controlWidHeight(val: any, limit: any) {
    // 列宽或行高的弹窗
    this.controldialog = false;
    if (val === '') {
      return;
    } else if (+val > limit || (+val < 1)) {
      this.$message.error("不在范围1~500内！");
      return;
    }
    if (this.controlWH === 1) {
      this.deleTarget.setWidthOrHeight("width", val);
      this.deleTarget.$rootTable.tableBody.forEach((element: any) => {
        const position = {
          colNum: this.deleTarget.position.colNum,
          colStr: this.deleTarget.position.colStr,
          rowNum: element[0].position.rowNum,
          rowStr: element[0].position.rowStr,
          table: this.deleTarget.position.table
        };
        const container = this.deleTarget.$rootTable.getContainer(position);
        container.setWidthOrHeight("width", val);
      });
    } else {
      const indexs = this.deleTarget.position.rowNum - this.deleTarget.$rootTable.tableBody[0][0].position.rowNum;
      this.deleTarget.$rootTable.tableBody[indexs].forEach((element: any) => {
        element.setWidthOrHeight("height", val);
      });
      if (this.deleTarget.$rootTable.tableHeadLeft.length !== 0) {
        this.deleTarget.$rootTable.tableHeadLeft[indexs][0].setWidthOrHeight("height", val);
      }
    }
  }
  // 销毁表区，保持表区table顺序一致
  destroyTmptable(table: any) {
    const tables: BaseTable = table;
    if (table.tableHeadTop.length === 0 && table.tableHeadLeft.length === 0) {
      const deleteIndex = parseInt(table.position.table.substring(1))-1;
      this.tableList.splice(deleteIndex, 1);
      this.areaTable.splice(deleteIndex, 1);
      this.formulaRow.splice(deleteIndex, 1);
      this.linkageFormula.splice(deleteIndex, 1);
      tables.onDestroy();
      this.tableList.forEach((element: any) => {
        element.topLeftValue = element.position.table;
        // element.render();
      });
    }
  }
  // 获取当前日期
  getDate() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const newDate = date.getDate();
    this.date = date.getFullYear() + '-' + this.timeAdd0(month + '') + '-' + this.timeAdd0(newDate + '');
  }
  // 日期补零
  timeAdd0(str: any) {
    if(str.length <= 1) {
      str='0'+str;
    }
    return str;
  }
  // 本地测试数据
  dataStart() {
    const myUserData1 = {
      reportId: "02b448f2e4734db5a18c29641e8a856b",
      reportState: "0002", // 报价单状态
      reportVersionId: "8b2c16466b304ca4a80fccfe113b6afc", // 报价单版本ID
      supplierCode: "V12680", // 供应商编码
      moduleCode: "0010870653D", // 物料号
      resultDate: "2019-01-21 15:46:21.0", // 结果公示时间
      company: "江苏宏宝集团有限公司"
    };
    window.sessionStorage.setItem("baojiaData", JSON.stringify(myUserData1));
  }
}
</script>

<style lang='scss'>
.suppliers {
  background: #fff;
  position: relative;
  width: auto;
  float: left;
  /* 匹配历史报价单顶部 */
  .matching {
    overflow: hidden;
    margin-bottom: 17px;
    .UpDown {
      float: right;
      .el-button {
        vertical-align: top;
        font-size: 16px;
        border: 1px solid #4a90e2;
        color: #4a90e2;
        &:nth-child(1) {
          margin-right: 14px;
        }
      }
    }
    .Phistory {
      float: left;
    }
    .el-form-item__label {
      font-weight: 500;
    }
    .el-input--suffix .el-input__inner {
      background: #f9f9f9;
    }
    .el-form--inline .el-form-item {
      margin-bottom: 0;
    }
    .el-input span.pic {
      border-left: 1px solid #cecece;
      display: inline-block;
      height: 60%;
      width: 32px;
      margin-top: 24%;
      .img {
        font-size: 18px;
        vertical-align: top;
        margin-top: 4px;
        cursor: pointer;
      }
    }
  }
  /* 报价单 */
  .priceSheet {
    min-height: calc(100vh - 173px) !important;
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
  /* 保存提交 */
  .CommitCharge {
    padding-top: 30px;
    text-align: center;
    .el-button {
      padding: 12px 5.8%;
      font-size: 18px;
      margin-top: 40px;
      &:nth-child(1) {
        color: #1875f0;
        border-color: #1875f0;
        margin-right: 10px;
      }
      &:nth-child(2) {
        border-color: #d1d1d1;
      }
    }
  }
  .menuss {
    width: 125px;
    float: left;
    position: absolute;
    z-index: 999999;
    background-color: #fff;
    .menuContent {
      border: 1px solid;
    }
    .huise {
      color: #999;
      cursor: not-allowed;
    }
    p {
      cursor: pointer;
      border-bottom: 1px solid;
      margin: 0 0;
      &:last-child {
        border-bottom: 0;
      }
    }
  }
  .set {
    border: 1px solid #4a90e2;
    color: #4a90e2;
  }
  .controlwh {
    z-index: 1000000 !important;
  }
}
</style>