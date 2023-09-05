import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// 登录
const signin = () => import("@/views/signin");
const reg = () => import("@/views/reg");
// 非登录页的包裹组件
const layout = () => import("@/layout");
// 嵌套的更深层级的包裹组件
const nested = () => import("@/layout/nested");
// 首页
const dashboard = () => import("@/views/dashboard");
// 空白页面
const blank = () => import("@/views/blank");
// 401
const unauthorized = () => import("@/views/401");
// 404
const notfound = () => import("@/views/404");

const config = () => import("@/views/config");
const mjtask = () => import("@/views/mjtask");
const mjkeys = () => import("@/views/mjkeys");
const users = () => import("@/views/users");

const router = new Router({
  routes: [
    // 首先是登录页的路由
    {
      path: "/signin",
      name: "signin",
      meta: {
        title: "用户登录",
      },
      component: signin,
    },
    {
      path: "/reg",
      name: "reg",
      meta: {
        title: "注册新用户",
      },
      component: reg,
    },
    {
      path: "/",
      name: "home",
      meta: {
        title: "首页",
        needLogin: true,
      },
      redirect: "/mjtask",
      component: layout,
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          meta: {
            title: "管理后台",
            needLogin: true,
          },
          component: dashboard,
        },
        {
          path: "mjtask",
          name: "mjtask",
          meta: {
            title: "绘图任务",
            needLogin: true,
          },
          component: mjtask,
        },
        {
          path: "mjkeys",
          name: "mjkeys",
          meta: {
            title: "我的密钥",
            needLogin: true,
          },
          component: mjkeys,
        },
        {
          path: "users",
          name: "users",
          meta: {
            title: "用户列表",
            needLogin: true,
          },
          component: users,
        },
        {
          path: "config",
          name: "config",
          meta: {
            title: "基础设置",
            needLogin: true,
          },
          component: config,
        },
      ],
    },
    {
      path: "/401",
      name: "401",
      meta: {
        title: "Unauthorized",
      },
      component: unauthorized,
    },
    {
      path: "*",
      meta: {
        title: "404",
      },
      component: notfound,
    },
  ],
});

// 当一个导航触发时，全局的 before 钩子按照创建顺序调用。钩子是异步解析执行，此时导航在所有钩子 resolve 完之前一直处于等待中。
router.beforeEach((to, from, next) => {
  // 自动化修改页面标签的 title
  document.title = to.meta.title;
  window.scrollTo(0, 0);
  const isLogin = localStorage.getItem("ai_token");
  // console.log(isLogin)
  if (to.meta.needLogin) {
    if (isLogin) {
      next();
    } else {
      next({
        path: "/signin",
      });
    }
  } else {
    next();
  }
});

export default router;
