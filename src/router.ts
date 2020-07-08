import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: { name: 'mint-assets' }
    },
    {
      path: '/manage/verify',
      name: 'manage-verify',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Verify.vue'),
    },
    {
      path: '/manage/update',
      name: 'manage-update',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Update.vue'),
    },
    {
      path: '/user-access',
      name: 'user-access',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Access.vue'),
    },
    {
      path: '/token-transfers',
      name: 'token-transfers',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Account.vue'),
    },
    {
      path: '/mint/assets',
      name: 'mint-assets',
      component: Home,
    },
    {
      path: '/mint/real-estate',
      name: 'mint-real-estate',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/MintRealEstate.vue'),
    },
    {
      path: '/mint/video-latino',
      name: 'mint-video-latino',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/MintVideoLatino.vue'),
    },
  ],
});
