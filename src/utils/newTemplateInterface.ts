/*
 * @Page: 新建模板页面接口方法
 * @Author: cong
 * @Date: 2019-01-14 15:29:41
 * @Last Modified by: cong
 */
import { Vue } from "vue-property-decorator";
import { Message } from 'element-ui';
Vue.prototype.$message = Message;
import {
  saveTemplate,
  getTemplate
} from "@/api/moudle.ts";
// 保存，修改，提交相关接口
interface SaveParams {
  templateName: string;
  categoryId: string;
  templateScript: string;
  userCode?: string;
  templateId?: string;
  templateVersionId?: string;
}
function interfaceSave(params: SaveParams, callback: (a: any) => void) {
  saveTemplate(params)
    .then((res: any) => {
      if(res.success) {
        callback(res);
      } else {
        Vue.prototype.$message.error("操作失败:" + res.errorMsg);
      }
    })
    .catch((err: any) => {
      Vue.prototype.$message.error("接口失败:" + err.errorMsg);
    });
}
// 修改获取模板
function interfaceGetTemplate(templateId: string, callback: (a: any) => void) {
  const params = {
    templateId
  };
  getTemplate(params)
    .then((res: any) => {
      if(res.success) {
        callback(res);
      } else {
        Vue.prototype.$message.error("模板获取失败:" + res.errorMsg);
      }
    })
    .catch((err: any) => {
      Vue.prototype.$message.error("接口失败:" + err.errorMsg);
    });
}
export { interfaceSave, interfaceGetTemplate };