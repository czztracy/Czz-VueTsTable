// 签章
import request from '@/utils/request';
import { qdca_signByUK, qdca_getclientcert, qdca_getSealData, qdca_getvcode, qdca_getcn } from '@/utils/signature/qdca';
import {security} from '@/utils/signature/securityPlugin.js';
import { signatureUrl } from '@/utils/api';
const djh = "22212712321547";
// 签章注册文件
export function register(params: any) {
  return request({
    url: signatureUrl() + 'file/register',
    method: 'post',
    data: params 
  });
}
// 签章文件
export function signatureNew(params: any) {
  return request({
    url: signatureUrl() + 'file/signature',
    method: 'post',
    data: params 
  });
}
// 签章V码判断
export function check(params: any) {
  return request ({
    url: signatureUrl() + 'file/check',
    method: 'get',
    params
  });
}
// 签章
// export function sign(pdfUrl: any, pdfPathDle: any, reportVersionId: any, reportId: any) {
export function sign() {
  // console.log(qdca_signByUK)
  // console.log(new security("Security"))
  let CASecurityClient: any = {};
  // 1、选择证书
  // try{
  //     CASecurityClient.SOF_GetVersion();
  //   }catch(e){
  //       CASecurityClient = new security("Security");			
  //   }
  CASecurityClient = new security("Security");
  // CASecurityClient =  security("Security");
  // const vId = VCode; // 用户V码
    // const certlist:any = {}
    // certlist = CASecurityClient.SOF_GetUserList();
  const certlist = CASecurityClient.SOF_GetUserList();
  const certid = certlist;
  if (certid == ""||certid==-3||certid==null) {
    // alert("未检测到您的数字证书");
    return ;
  }
  // 2、 获取CertID对应证书和印章文件（建议在此步添加一个 V码验证。当前登录用户的V码与数字证书的V码是否一致）
  const clientcert = qdca_getclientcert(certid,CASecurityClient); // clientcert 签署者公钥证书
  if (clientcert == "" || clientcert == null||clientcert=="null") {
        return ;
    }
  const sealdata = qdca_getSealData(certid, CASecurityClient); // sealdata 为 seal 印章加密信息 还要传单据号djh
  if (sealdata == "" || sealdata == null||sealdata=="null") {
        return ;
    }
  // 获取证书名称
  const certcn = qdca_getcn(clientcert, CASecurityClient);
  if (certcn == "" || certcn == null||certcn=="null") {				
      return ;
    }
  // alert(certcn);
  // 获取企业V码
  const certvcode = qdca_getvcode(clientcert, CASecurityClient);
  if (certvcode == "" || certvcode == null || certvcode=="null") {
      return ;
    }
  // alert(certvcode);
  const params = {seal: sealdata, clientcert, djh, certvcode: 'V12970'};
  // console.log(params, 'params');
  return params;
}
export function signature(msg: any, reportVersionId: any, reportId: any, fileName: any) { // msg为注册返回信息
  let CASecurityClient: any = {};
  // 1、选择证书
  // try{
  //     CASecurityClient.SOF_GetVersion();
  //   }catch(e){
  //       CASecurityClient = new security("Security");			
  //   }
  CASecurityClient = new security("Security");
  const certlist = CASecurityClient.SOF_GetUserList();
  const certid = certlist;
  if (certid == ""||certid==-3||certid==null) {
    // alert("未检测到您的数字证书");
    return ;
  }
  // 2、 获取CertID对应证书和印章文件（建议在此步添加一个 V码验证。当前登录用户的V码与数字证书的V码是否一致）
  const clientcert = qdca_getclientcert(certid,CASecurityClient); // clientcert 签署者公钥证书
  if (clientcert == "" || clientcert == null||clientcert=="null") {
        return ;
    }
  const sealdata = qdca_getSealData(certid, CASecurityClient); // sealdata 为 seal 印章加密信息 还要传单据号djh
  if (sealdata == "" || sealdata == null||sealdata=="null") {
        return ;
    }
  // 获取证书名称
  const certcn = qdca_getcn(clientcert, CASecurityClient);
  if (certcn == "" || certcn == null||certcn=="null") {				
      return ;
    }
  // alert(certcn);
  // 获取企业V码
  const certvcode = qdca_getvcode(clientcert, CASecurityClient);
  if (certvcode == "" || certvcode == null || certvcode=="null") {
      return ;
    }
  // alert(certvcode);
  const signvalue = qdca_signByUK(certid, msg, CASecurityClient);
  // 签章
  signatureNew({signvalue, reportVersionId, reportId, djh, staticResourceStoragePath: fileName}).then( result2 => {
  // console.log(result, '签章返回值')
    let obj2: any = {};
    obj2 = result2;
    if((window as any).sessionStorage.getItem("signature") !== null) {
      sessionStorage.clear();
    }
    if(obj2.success === true) {
      (window as any).sessionStorage.setItem("signature", true);
      // alert("签章成功！");
    } else {
      (window as any).sessionStorage.setItem("signature", false);
      // alert("签章失败，请重试！");
    }
    }).catch( err => {
      console.log(err);
    });
}