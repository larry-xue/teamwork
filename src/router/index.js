import Vue from 'vue';
import VueRouter from 'vue-router';
import login from '../views/user_new/user_login.vue';

Vue.use(VueRouter);

// const routerPush = VueRouter.prototype.push;
// VueRouter.prototype.push = (location) => routerPush.call(this, location).catch((error) => error);


const routes = [
  {
    path: '/',
    redirect: '/team',
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user_new/user.vue'),
    children: [
      {
        path: '/user/register',
        name: 'register',
        component: () => import('../views/user_new/user_register.vue'),
      },
      {
        path: '/user/login',
        name: 'login',
        component: login,
      },
    ],
  },

  {
    path: '/team',
    name: 'team',
    component: () => import('../views/team/team.vue'),
    children: [
      {
        path: '/team/myself',
        name: 'myself',
        component: () => import('../views/team/myself/team_myself.vue'),
        children: [
          {
            path: '/team/myself/settings',
            name: 'settings',
            component: () => import('../views/team/myself/team_myself_settings.vue'),
          },
        ],
      },
      {
        path: '/team/work',
        name: 'work',
        component: () => import('../views/team/work/team_work.vue'),
      },
      {
        path: '/team/calendar',
        name: 'calendar',
        component: () => import('../views/team/calendar/team_calendar.vue'),
      },
      {
        path: '/team/member',
        name: 'member',
        component: () => import('../views/team/member/team_member.vue'),
      },
    ],
  },
  {
    path: '/document/word',
    name: 'word',
    component: () => import('../views/doc/doc_word.vue'),
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export default router;
