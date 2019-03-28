<template>
    <TabFooter :getData="getData"/>
</template>

<script>
import TabFooter from "@/components/Quotation/footer.vue";
export default {
    components:{
        TabFooter
    },
    data() {
        return {
            getData: {
                Opinion: '这是供应商意见', // 供应商意见（可填写）
                name: '', // 填写人签字
                tel: '', // 联系电话
                corporateName: '', // 公司名称（用户登录时获取）
                date: '', // 填写日期（需获取）
                // 填写说明（用户可修改）
                explain1: '1、公式    计算单价 = ①＋②＋③＋④＋⑤＋⑥ + ⑦ + ⑧ - ⑨ + ⑩',
                explain2: '2、一般管理费、利润供应商根据公司自身管理实际填写。',
                explain3: '3、买方有权拒绝不完整或迟到的报价 。',
                explain4: '4、供应商报价时，一定确保所填写数据真实有效。虚假报价一经查实，买方有权按照合同追责。'
            }
        };
    },
};
</script>

<style>

</style>

