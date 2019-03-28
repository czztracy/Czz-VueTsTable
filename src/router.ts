import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      // path: '/temp/',
      // path: '/tableTemplate/',
      // path: '/table/',
      path: '/',
      name: 'home',
      component: () =>
        import(/* webpackChunkName: "about" */ './views/Newlybuild.vue')
    },
    {
      path: '/Newlybuild',
      // path: '/temp/Newlybuild',
      // path: '/tableTemplate/Newlybuild',
      // path: '/table/Newlybuild',
      name: 'newlybuild',
      component: () =>
        import(/* webpackChunkName: "about" */ './views/Newlybuild.vue')
    },
    {
      path: '/submit',
      // path: '/temp/submit',
      // path: '/tableTemplate/submit',
      // path: '/table/submit',
      name: 'submit',
      component: () =>
        import(/* webpackChunkName: "about" */ './views/submit.vue')
    },
    {
      path: '/suppliers',
      // path: '/temp/suppliers',
      // path: '/tableTemplate/suppliers',
      // path: '/table/suppliers',
      name: 'suppliers',
      component: () =>
        import(/* webpackChunkName: "about" */ './views/suppliers.vue')
    }
  ]
});
