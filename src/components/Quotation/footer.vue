/*
 * @Page: 报价单表尾
 * @Author: wangyadi
 * @Date: 2019-01-08 21:03:07
 * @Last Modified by: wangyadi
 */

<template>
    <div>
        <el-form class="tabFoot" :model="formJson">
            <!-- <el-form-item label="供应商意见：" class="Opinion">
                <el-input :disabled="supplierAble" v-model="formJson.Opinion" placeholder="填写：报价补充说明等" type="input"/>
            </el-form-item> -->
            <el-form-item label="填写人签字：" class="reportMan">
                <el-input :disabled="supplierAble" placeholder="" v-model="formJson.name" type="input"/>
            </el-form-item>
            <el-form-item label="联系电话：" class="reportMan">
                <el-input :disabled="supplierAble" placeholder="" v-model="formJson.tel" type="input"/>
            </el-form-item>
            <el-form-item label="公司名称：" class="reportMan name">
                <el-input placeholder="" v-model="formJson.corporateName" type="input" disabled/>
            </el-form-item>
            <!-- <span>(签章位置)</span> -->
            <el-form-item label="填写日期：" class="reportMan name">
                <el-input placeholder="" v-model="date" type="input" disabled/>
            </el-form-item>
            <el-form-item label="填写说明：" class="reportMan name explain">
                <el-input :disabled="explainAble" autosize placeholder="请输入填写说明" v-model="formJson.explain" resize="none" type="textarea" class="explainInput"/>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'TabFooter',
    props: {
        tabFootJson: {
            type: Object
        }
    },
    data() {
        return {
            date: '', // 填写日期（当前系统时间）
            formJson: {
                Identification: '0',
                date: '',
                Opinion: '', // 供应商意见（可填写）
                name: '', // 填写人签字
                tel: '', // 联系电话
                corporateName: '', // 公司名称（用户登录时获取）
                // 填写说明（用户可修改）
                explain: `1、公式    计算单价 = ①＋②＋③＋④＋⑤＋⑥＋⑦＋⑧—⑨＋⑩。\r\n2、一般管理费、利润供应商根据公司自身管理实际填写。\r\n3、买方有权拒绝不完整或迟到的报价。\r\n4、供应商报价时，一定确保所填写数据真实有效。虚假报价一经查实，买方有权按照合同追责。`
            },
            explainAble: false, // 小微可编辑填写说明
            supplierAble: false, // 供应商可编辑 供应商意见/填写人签字/联系电话
            userName: '小微', // 当前用户,根据用户角色区分哪里可编辑
            Identification: '0'
        };
    },
    watch: {
        tabFootJson:{
             handler(val, oldVal) {
                // console.log(val.Identification, '表尾监听的对象')
                // if(val.signal = true){
                //     this.$emit("formJson", this.formJson)
                // }
                // val = JSON.parse(JSON.stringify(val))
                this.formJson = Object.assign({}, this.tabFootJson); // 对象复制
                if(val.Identification === '2') { // 小微
                    this.supplierAble = true;
                } else if(val.Identification === '1') { // 供应商 ，当前日期
                    this.explainAble = true;
                    this.formJson.Opinion = val.Opinion;
                    this.formJson.name = val.name;
                    this.formJson.tel = val.tel;
                    this.formJson.corporateName = val.corporateName;
                } else if(val.Identification === '3') { // 报价单展示时不能编辑
                    this.date = val.date;
                    this.supplierAble = true;
                    this.explainAble = true;
                } else if(val.Identification === '4') { // 预览时均不可编辑
                    this.supplierAble = true;
                    this.explainAble = true;
                }
            },
            deep:true
        }
    },
    created() {
        this.getDate();
    },
    mounted() {
        this.tableFootJson();
    },
    methods:{
        tableFootJson() {
            this.getDate();
            this.formJson.date = this.date;
            this.formJson = JSON.parse(JSON.stringify(this.formJson));
            this.$emit("formJson", this.formJson);
            // this.tableFootJson = JSON.parse(JSON.stringify(this.tableFootJson))
            this.formJson = Object.assign({}, this.tabFootJson); // 对象复制
            // console.log(this.tabFootJson, '父组件传过来的值');
            if(this.formJson.Identification === '2') { // 小微编辑模板的表头表尾信息,不可修改填写日期
                this.supplierAble = true;
            } else if(this.formJson.Identification === '1') { // 供应商填报时日期为当前日期
                this.explainAble = true;
            } else if(this.formJson.Identification === '3') {
                this.date = this.tabFootJson.date;
                this.supplierAble = true;
                this.explainAble = true;
            } else if(this.formJson.Identification === '4') { // 预览时均不可编辑
                this.supplierAble = true;
                this.explainAble = true;
            }
        },
        // 获取当前日期
        getDate() {
            const date = new Date();
            const month = date.getMonth() + 1;
            const newDate = date.getDate();
            this.date = date.getFullYear() + '-' + this.timeAdd0(month + '') + '-' + this.timeAdd0(newDate + '');
        },
        // 日期补零
        timeAdd0(str) {
            if(str.length<=1) {
                str='0'+str;
            }
            return str;
        }
    }
  };
</script>

<style scope>
.tabFoot {
  width: 90%;
  margin: auto;
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-family: "Microsoft YaHei";
}
.tabFoot .el-input.is-disabled .el-input__inner {
  background: none;
  border-color: #000;
}
.tabFoot .el-input.is-disabled .el-input__inner {
  color: #606266;
}
.tabFoot .el-form-item__content {
  white-space: nowrap;
  margin-left: 100px;
}
.tabFoot .el-form-item__label {
  font-size: 12px;
}
.Opinion {
  width: 70%;
}
.Opinion .el-input__inner {
  border: 0;
}
.reportMan {
  width: 40%;
}
.reportMan .el-input__inner {
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #000;
}
.name {
  width: 40%;
}
.Opinion span {
  float: left;
}
.Opinion .input1 {
  float: left;
}
.explain {
  width: 80%;
  font-size: 8px;
}
.explainInput {
  padding-top: 20px;
}
.explainInput .el-textarea__inner{
    height: 210px;
    line-height: 27px;
    font-size: 16px;
    border-color: #fff
}

.explain .el-input__inner{
    border: 0
}
</style>
<style>
.el-textarea.is-disabled .el-textarea__inner{
    color: #000;
    background-color: #fff;
    border-color: #fff
}
</style>
