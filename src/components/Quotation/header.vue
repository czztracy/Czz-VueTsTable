/*
 * @Page: 报价单表头
 * @Author: wangyadi
 * @Date: 2019-01-08 21:03:14
 * @Last Modified by: wangyadi
 */

<template>
  <div class="tabHeade">
    <div class="top">
      <span>报价单号：{{ quotationNum }}</span>
      <img src="../../assets/logoBg.png" alt>
    </div>
    <h1>{{ quotationName }}</h1>
  </div>
</template>

<script>
export default {
    name: 'tabHeade',
    props: {
        tabHeadJson: {
            type: Object,
            // required: true
        }
    },
    data() {
        return {
            quotationName: '报价单', // 报价单名称
            quotationNum: '', // 报价单号
        };
    },
    watch: {
        tabHeadJson:{
             handler(val, oldVal) {
                // console.log(val, oldVal, '表头监听的对象')
                this.quotationName = val.quotationName;
                this.quotationNum = val.quotationNum;
                // if(val.signal = true){
                //     this.$emit("tableHeadeJson", {'quotationName': this.quotationName, 'quotationNum': this.quotationNum})
                // }
            },
            deep:true
        }
    },
    mounted() {
        this.tableHeadeJson();
    },
    methods: {
        tableHeadeJson() {
            let tableHeadeJson = {quotationName: this.quotationName, quotationNum: this.quotationNum};
            tableHeadeJson = JSON.parse(JSON.stringify(tableHeadeJson));
            this.$emit("tableHeadeJson", tableHeadeJson);
            // console.log(this.tabHeadJson, '这是父组件返回的表头');
            this.quotationName = this.tabHeadJson.quotationName;
            this.quotationNum = this.tabHeadJson.quotationNum;
        },
    },
};
</script>

<style scoped>
.tabHeade {
  width: 100%;
  height: 100px;
  color: rgb(83, 141, 248);
  font-size: 13px;
}
.top span {
  float: left;
  font-weight: 900;
}
.top img{
    float:right
}
.tabHeade h1{
    font-size: 23px;
    color: rgb(0, 112, 192);
    padding-top: 60px;
    text-align: center
}
</style>
