import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css';
import 'vue3-drag-table/lib/drag-table.css';
import '@/utils/directives.js';
Vue.config.productionTip = false;

Vue.use(ElementUI);

// 模板权限

// router.beforeEach((to, from, next) => {
//   // sessionStorage.setItem('roles', '1202')
//   if (
//     sessionStorage.getItem('roles') &&
//     window.location.href === 'http://115.28.57.244/temp/#/Newlybuild'
//   ) {
//     let Str: any = sessionStorage.getItem('roles')
//     let Slit: any = Str.split(',')
//     Slit.forEach(item => {
//       if (item === '0801') {
//         window.location.href = 'http://115.28.57.244/temp/#/Newlybuild'
//       }
//     })
//     console.log('-------------------', sessionStorage.getItem('roles'), Slit)
//   } else if (
//     sessionStorage.getItem('roles') &&
//     window.location.href === 'http://115.28.57.244/temp/submit'
//   ) {
//     let Str: any = sessionStorage.getItem('roles')
//     let Slit: any = Str.split(',')
//     Slit.forEach(item => {
//       if (item === '0702' || item === '0802' || item === '13') {
//         window.location.href = 'http://115.28.57.244/temp/submit'
//       }
//     })
//   } else if (
//     sessionStorage.getItem('roles') &&
//     window.location.href === 'http://115.28.57.244/temp/suppliers'
//   ) {
//     let Str: any = sessionStorage.getItem('roles')
//     let Slit: any = Str.split(',')
//     Slit.forEach(item => {
//       if (item === '1202') {
//         window.location.href = 'http://115.28.57.244/temp/suppliers'
//       }
//     })
//   } else {
//     window.location.href = 'http://115.28.57.244/login'
//   }
//   next()
// })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
