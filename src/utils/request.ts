import axios from 'axios';
import { api } from '@/utils/api';
import { Message, MessageBox } from 'element-ui';
// 创建axios实例
const service = axios.create({
  baseURL: api(), // api 的 base_url
  timeout: 5000000 // 请求超时时间
});

// 添加请求拦截器
service.interceptors.request.use(
  (config: any) => {
    config.headers['token'] = (window as any).sessionStorage.getItem('token'); // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['ticket'] = (window as any).sessionStorage.getItem('ticket');

    // if (config.url.indexOf('?') !== -1) {
    //   if ((window as any).sessionStorage.getItem('avatarCode') !== '0006') {
    //     config.url =
    //       config.url +
    //       '&' +
    //       'managercode=' +
    //       (window as any).sessionStorage.getItem('avatarCode') +
    //       '&' +
    //       'suppliercode=""' +
    //       '&' +
    //       't=' +
    //       Date.parse(new Date() as any);
    //   } else {
    //     config.url =
    //       config.url +
    //       '&' +
    //       'managercode=""' +
    //       '&' +
    //       'suppliercode=' +
    //       (window as any).sessionStorage.getItem('avatarCode') +
    //       '&' +
    //       't=' +
    //       Date.parse(new Date() as any);
    //   }
    // } else {
    //   if ((window as any).sessionStorage.getItem('avatarCode') !== '0006') {
    //     config.url =
    //       config.url +
    //       '?' +
    //       'managercode=' +
    //       (window as any).sessionStorage.getItem('avatarCode') +
    //       '&' +
    //       'suppliercode=""' +
    //       '&' +
    //       't=' +
    //       Date.parse(new Date() as any);
    //   } else {
    //     config.url =
    //       config.url +
    //       '?' +
    //       'managercode=""' +
    //       '&' +
    //       'suppliercode=' +
    //       (window as any).sessionStorage.getItem('avatarCode') +
    //       '&' +
    //       't=' +
    //       Date.parse(new Date() as any);
    //   }
    // }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response: any) => {
    const res = response.data;
    // 50008:非法的token;
    if (res === 50008) {
      MessageBox.confirm(
        '你已被登出，可以取消继续留在该页面，或者重新登录',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // window.location.href = 'http://115.28.57.244/login'
        console.log(11111111);
      });
    }
    return res;
  },
  error => {
    console.log('err' + error);
    return Promise.reject(error);
  }
);

export default service;
