/*
 * @Page: 模板创建 --> 左侧树
 * @Author: csg
 * @Date: 2018-12-11 14:57:45
 * @Last Modified by: csg
 */
<template>
  <div class="TEMPLATEMAPTREE">
    <el-input
      v-model="searchinp"
      placeholder="请输入关键字"
      prefix-icon="el-icon-search"
      class="searchinp"
    />
    <el-tree
      ref="templateTree"
      :data="setTree"
      :props="defaultProps"
      :allow-drop="allowDrop"
      :allow-drag="allowDrap"
      :filter-node-method="filterNode"
      class="expand-tree"
      node-key="id"
      draggable
      highlight-current
      @node-click="handleNodeClick"
      @node-drag-start="handleDragStart"
    >
      <span slot-scope="{ node, data }" :title="node.label" class="slot-t-node">
        <!-- 未编辑状态 -->
        <span
          :class="[data.group === '0' ? 'childeNode' : 'parentNode']"
          style="overflow: hidden;white-space: nowrap;text-overflow:ellipsis;width: 135px;display: inline-block;"
        >
          <i :class="[ data.group === '0' ? 'fa fa-file-o' : 'fa fa-folder-o']"/>
          {{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { searchFieldList } from "@/api/fieldData";
@Component
export default class TemplateMapTree extends Vue {
  public a: number = 0;
  defaultProps: any = {
    children: "childFieldClassList",
    label: "name"
  };
  setTree: any = [];
  childrenShowBool: any = false;
  searchinp: any = "";
  @Watch("searchinp")
  // 搜索监听
  mohu() {
    // console.log(this.searchinp,this.$refs.templateTree
    (this as any).$refs.templateTree.filter(this.searchinp);
  }
  mounted() {
    this.getFieldTreeData();
  }
  // 模糊搜索
  filterNode(value: any, data: any) {
    if (!value) {
      return true;
    }
    return data.name.indexOf(value) !== -1;
  }
  // node 点击事件
  handleNodeClick(node: any, data: any) {
    console.log(node, data);
  }
  // 拖拽
  handleDragStart(node: any, ev: any, item: any) {
    const obj = {
      name: node.data.name,
      info: node.data.message,
      fillIn: node.data.state,
      type: node.data.type,
      acquisitionMode: node.data.way,
      formulaMode: node.data.computingMode,
      logicalAcquisitionType: node.data.logicAcquisition
    };
    this.a++;
    const dragStartData = {
      operationType: "add",
      containerData: {
        cell: {
          value: node.data.name,
          data: node.data
        },
        userData: obj,
        systemData: {
          canSum: node.data.name.canSum
        },
        test: 111,
        id: node.data.fieldId + this.a
      }
    };
    console.log(ev, node.data, dragStartData);
    ev.dataTransfer.setData("dragStartData", JSON.stringify(dragStartData));
  }
  // 拖拽结束时
  handleDragEnd(node: any, ev: any) {
    this.$confirm("是否隐藏?", "提示", {
      cancelButtonText: "否",
      confirmButtonText: "是",
      type: "warning"
    })
      .then(() => {
        this.childrenShowBool = true;
        // console.log(this.childrenShowBool);
      })
      .catch(() => {
        this.childrenShowBool = false;
        // console.log(this.childrenShowBool);
      });
  }
  // 拖拽不能在节点之间放置
  allowDrop(draggingNode: any, dropNode: any, type: any) {
    // console.log(draggingNode, dropNode, type)
    // return type !== 'inner'
    // 同级拖拽
    if (draggingNode.level === dropNode.level) {
      // id相同才可拖拽放入
      if (draggingNode.id === dropNode.id) {
        return type === "prev";
      }
    } else {
      // 不同级进行处理
    }
  }
  // 组不能拖拽
  allowDrap(draggingNode: any) {
    return draggingNode.data.group === "0";
  }
  // 获取字段库列表
  getFieldTreeData() {
    searchFieldList()
      .then((res: any) => {
        this.setTree = res.resultData;
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
</script>

<style>
.TEMPLATEMAPTREE {
  display: inline-block;
  text-align: left;
  height: 790px;
  overflow-y: auto;
  width: 100%;
}
.TEMPLATEMAPTREE .searchinp {
  margin-top: 20px;
}
.TEMPLATEMAPTREE .el-tree {
  margin-top: 20px;
  margin-left: 10px;
}
.TEMPLATEMAPTREE .el-tree-node__content .childeNode {
  font-size: 13px;
}
.TEMPLATEMAPTREE .el-tree-node__content .parentNode {
  font-size: 14px;
}
.TEMPLATEMAPTREE .el-tree-node__content .slot-t-node .fa-folder-o {
  font-size: 15px;
}
.TEMPLATEMAPTREE .el-tree-node__content .slot-t-node .fa-file-o {
  font-size: 10px;
}
/*滚动条整体样式 高宽分别对应横竖滚动条的尺寸*/
.TEMPLATEMAPTREE::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/*滚动条里面小方块*/
.TEMPLATEMAPTREE::-webkit-scrollbar-thumb {
  border-radius: 5px;
  /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
  background: rgba(0, 0, 0, 0.2);
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
/*滚动条里面轨道*/
.TEMPLATEMAPTREE::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
</style>
