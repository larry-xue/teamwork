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
          {
            path: '/team/myself/todos',
            name: 'todo',
            component: () => import('../views/team/myself/team_myself_todos.vue'),
          },
        ],
      },
      {
        path: '/team/library',
        name: 'library',
        component: () => import('../views/team/library/team_library.vue'),
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
      {
        path: '/team/affair',
        name: 'affair',
        component: () => import('../views/team/affair/team_affair.vue'),
      },
    ],
  },

  {
    path: '/document',
    name: 'document',
    component: () => import('../views/doc/doc.vue'),
    children: [
      {
        path: '/document/markdown',
        name: 'markdown',
        component: () => import('../components/markdown.vue'),
      },
      {
        path: '/document/word',
        name: 'word',
        component: () => import('../components/word.vue'),
      },
    ],
  },

  {
    path: '/questionnaire',
    component: () => import('../views/questionnaire/questionnaire.vue'),
    children: [
      {
        path: '/questionnaire/create',
        name: 'questionnaire_cr',
        component: () => import('../views/questionnaire/questionnaire_cr.vue'),
      },
      {
        name: 'questionnaire_fill',
        path: '/questionnaire/fill',
        component: () => import('../views/questionnaire/questionnaire_fill.vue'),
      },
      {
        path: '/questionnaire/show',
        name: 'questionnaire_show',
        component: () => import('../views/questionnaire/questionnaire_show.vue'),
      },
    ],
  },

];

const router = new VueRouter({
  routes,
  mode: 'hash',
});

export default router;
