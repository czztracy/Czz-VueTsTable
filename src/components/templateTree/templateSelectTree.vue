/*
 * @Page: 模板创建 --> 搜索模板组件
 * @Author: csg
 * @Date: 2018-12-11 14:56:03
 * @Last Modified by: csg
 */
<template>
  <div class="treeBOX" v-if="message.showTree" :style="{ height: loadingBool? '468px' : '440px' }">
    <el-input v-model="filterText" placeholder="请输入内容" @keyup.enter.native="handleSearch">
      <i slot="prefix" class="el-input__icon el-icon-search" @click="handleSearch"/>
    </el-input>
    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      class="filter-tree"
      default-expand-all
      @node-click="handleNodeClick"
    >
      <span slot-scope="{ node, data }" :title="data.templateName" class="slot-t-node">
        <i class="fa fa-bandcamp"/>
        <span v-loading.fullscreen.lock="fullscreenLoading">{{ data.templateName }}</span>
      </span>
    </el-tree>
    <div class="bottom" @click="loadMore" v-if="loadingBool">加载更多</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { getTemplateList, getTemplate } from "@/api/moudle";
@Component
export default class TemplateSelectTree extends Vue {
  @Prop() message!: any;

  filterText: any = "";
  data2: any = [];
  defaultProps: any = {
    children: "children",
    label: "templateName"
  };
  currentPage: any = 1;
  pageSize: any = 10;
  count: any = 0;
  loadingBool: boolean = true;
  // 模板脚本
  templateScript: any = "";
  // 数据请求时loading加载
  fullscreenLoading: boolean = false;
  mounted() {
    // 全部模板
    const params = {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      type: "1"
    };
    getTemplateList(params)
      .then((res: any) => {
        console.log(res);
        this.data2 = this.data2.concat(res.resultData.list);
        this.count = res.resultData.count;
      })
      .catch((err: any) => {
        console.log(err);
      });
    // document.addEventListener('click', () => {
    //   this.showTree = false
    // })
  }
  // 点击节点
  handleNodeClick(node: any, data: any) {
    console.log("-------", node, data);
    // 查找脚本
    const params = {
      templateId: node.templateId
    };
    this.fullscreenLoading = true;
    getTemplate(params)
      .then((res: any) => {
        this.templateScript = res.resultData.templateScript;
        this.$emit("tolisten", res.resultData);
        console.log(res, this.templateScript);
        this.message.showTree = false;
        this.fullscreenLoading = false;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  // 搜索
  handleSearch() {
    console.log("搜索", this.filterText);
    const params = {
      templateName: this.filterText,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    };
    getTemplateList(params)
      .then((res: any) => {
        console.log(res);
        this.data2 = res.resultData.list;
        if (res.resultData.list.length < this.pageSize) {
          this.loadingBool = false;
        } else {
          this.loadingBool = true;
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  // 加载更多
  loadMore() {
    this.currentPage = ++this.currentPage;
    const params = {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      type: "1"
    };
    if (params.currentPage <= Math.ceil(this.count / this.pageSize)) {
      getTemplateList(params)
        .then((res: any) => {
          console.log(res);
          this.data2 = this.data2.concat(res.resultData.list);
          this.count = res.resultData.count;
          if (res.resultData.list.length < this.pageSize) {
            this.loadingBool = false;
          } else {
            this.loadingBool = true;
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
      console.log("加载更多");
    } else {
      this.loadingBool = false;
    }
  }
}
</script>

<style scoped>
/* .templateBoxTree {
  border: 1px solid #cecccc;
  margin: 0 auto;
  position: relative;
  display: inline-block;
  float: left;
} */
.treeBOX {
  position: absolute;
  top: 40px;
  left: 0;
  min-width: 200px;
  height: 468px;
  z-index: 999;
  /* border: 1px solid #cecccc; */
  display: inline-block;
  box-shadow: 6px 0 25px 0 rgba(0, 0, 0, 0.16);
}
</style>
<style>
.treeBOX .el-tree-node__expand-icon.is-leaf {
  display: none;
}
.treeBOX .el-input--prefix .el-input__inner {
  border: 0;
  border-bottom: 1px solid #cecccc;
  border-radius: 0;
  text-indent: 8px;
}
.treeBOX .el-input.el-input--prefix i {
  color: #333333;
  font-weight: 600;
}
.treeBOX .el-tree-node__content {
  padding-left: 20px;
  height: 40px;
}
.treeBOX .slot-t-node i {
  margin-right: 10px;
  margin-left: 20px;
  font-size: 24px;
}
.treeBOX .el-tree {
  overflow-y: auto;
  height: 400px;
}
/*滚动条整体样式 高宽分别对应横竖滚动条的尺寸*/
.treeBOX .el-tree::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/*滚动条里面小方块*/
.treeBOX .el-tree::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
/*滚动条里面轨道*/
.treeBOX .el-tree::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
.treeBOX .el-input__icon.el-icon-search:hover {
  cursor: pointer;
}
.treeBOX .bottom:hover {
  cursor: pointer;
}
</style>
