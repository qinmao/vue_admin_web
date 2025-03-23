const Layout = () => import('@/layout/index.vue')
// interface RouteConfigsTable {
//     // 路由地址
//     path: string;
//     // 路由重定向
//     redirect: string;
//     meta: {
//       title: string;
//       // 菜单图标
//       icon: string;
//       // 是否在菜单中显示
//       hidden: boolean;
//     };
//     // 子路由配置项
//     children: [
//       {
//         // 路由地址
//         path: string;
//         // 路由重定向
//         redirect: string;
//         // 按需加载需要展示的页面
//         component: RouteComponent;
//         // 路由元信息
//         meta: {
//           // 菜单名称
//           title: string;
//           // 菜单图标
//           icon: string;
//           // 是否显示该菜单
//           hidden: boolean;
//           // 需要内嵌的iframe链接地址
//           frameSrc: string;
//         };
//       },
//     ],
// };

// 配置的原始路由

/**
 *  constantRoutes
 *  不需要权限的基本页面
 */
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    // redirect: '/demo/chat',
    // redirect: '/demo/remote',
    meta: {
      icon: 'ep-histogram',
      title: '数据大屏'
    },
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '仪表盘'
        }
      },
      {
        path: 'home2',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '数据大屏1'
        }
      }
    ]
  },
  {
    path: '/demo-case',
    meta: {
      icon: 'ep-document',
      title: 'Demo-案例中心'
    },
    component: Layout,
    children: [
      {
        path: 'chat',
        component: () => import('@/views/demo-case/socket/index.vue'),
        meta: {
          title: 'socketIO信令服务'
        }
      },
      {
        path: 'webRTC',
        component: () => import('@/views/demo-case/webrtc/webrtc.vue'),
        meta: {
          //   icon: 'ep-video-camera',
          title: 'webRTC1v1视频通话'
        }
      },
      {
        path: 'remote-control',
        component: () => import('@/views/demo-case/remote/index.vue'),
        meta: {
          title: 'robots远程控制'
        }
      },
      {
        path: 'live',
        component: () => import('@/views/demo-case/live/index.vue'),
        meta: {
          title: 'FFmpeg直播推流'
        }
      },
      {
        path: 'facial-recognition',
        component: () => import('@/views/demo-case/face/index.vue'),
        meta: {
          title: '实时人脸识别'
        }
      },
      {
        path: 'facial-analysis',
        component: () => import('@/views/demo-case/face/log.vue'),
        meta: {
          title: '视频人脸解析'
        }
      }
    ]
  },
  {
    path: '/demo-util',
    meta: {
      icon: 'ep-document',
      title: 'Demo-组件与功能'
    },
    redirect: '/demo-util/i18n',
    component: Layout,
    children: [
      {
        path: 'i18n',
        component: () => import('@/views/demo-util/i18n/index.vue'),
        meta: {
          title: '国际化'
        }
      },
      {
        path: 'alert',
        component: () => import('@/views/demo-util/test/index.vue'),
        meta: {
          title: '命令式组件'
        }
      },
      {
        path: 'excel',
        component: () => import('@/views/demo-util/excel/index.vue'),
        meta: {
          title: 'Excel案例'
        }
      }
    ]
  },
  {
    path: '/msg',
    meta: {
      icon: 'ep-message',
      title: '消息中心'
    },
    component: Layout,
    children: [
      {
        path: 'sms',
        component: () => import('@/views/msg/sms.vue'),
        meta: {
          icon: 'ep-message',
          title: '短信消息'
        }
      },
      {
        path: 'task',
        component: () => import('@/views/msg/feedback.vue'),
        meta: {
          icon: 'ep-chat-dot-round',
          title: '反馈消息'
        }
      }
    ]
  },
  {
    path: '/error',
    meta: {
      title: '异常页面',
      hidden: true
    },
    children: [
      {
        path: '404',
        component: () => import('@/views/error/404.vue'),
        meta: {
          title: '404'
        }
      },
      {
        path: '500',
        component: () => import('@/views/error/500.vue'),
        meta: {
          title: '500'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/regist',
    component: () => import('@/views/login/regist.vue'),
    meta: {
      title: '注册',
      hidden: true
    }
  },
  {
    path: '/test',
    component: () => import('@/views/home/test.vue'),
    meta: {
      title: 'test',
      hidden: true
    }
  },
  {
    path: '/chatgpt',
    component: () => import('@/views/demo-case/chatgpt/index.vue'),
    meta: {
      title: 'chatgpt',
      hidden: true
    }
  }
]

/**
 * asyncRoutes
 * 根据用户权限动态加载
 */
export const asyncRoutes = [
  {
    path: '/system',
    meta: {
      icon: 'ri-settings-3-line',
      title: '系统管理'
    },
    redirect: '/system/user',
    component: Layout,
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          icon: 'ri-admin-line',
          title: '用户管理'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          icon: 'ri-admin-fill',
          title: '角色管理'
        }
      },
      {
        path: 'permission',
        component: () => import('@/views/system/permission/index.vue'),
        meta: {
          icon: 'ri-admin-fill',
          title: '权限管理'
        }
      },
      {
        path: 'dept',
        component: () => import('@/views/system/dept/index.vue'),
        meta: {
          icon: 'ri-git-branch-line',
          title: '部门管理'
        }
      },
      {
        path: 'job',
        component: () => import('@/views/system/job/index.vue'),
        meta: {
          icon: 'ep-monitor',
          title: '任务调度'
        }
      },
      {
        path: 'sms',
        component: () => import('@/views/system/sms/index.vue'),
        meta: {
          icon: 'ep-message',
          title: '短信配置'
        }
      },
      {
        path: 'profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          hidden: true,
          title: '个人信息'
        }
      }
    ]
  },
  {
    path: '/monitor',
    meta: {
      icon: 'ep-monitor',
      title: '系统监控'
    },
    redirect: '/monitor/online-user',
    component: Layout,
    children: [
      {
        path: 'online-user',
        component: () => import('@/views/monitor/online/index.vue'),
        meta: {
          icon: 'ri:user-voice-line',
          title: '在线用户'
        }
      },
      {
        path: 'login-log',
        component: () => import('@/views/monitor/logs/login-log.vue'),
        meta: {
          icon: 'ri:window-line',
          title: '登录日志'
        }
      },
      {
        path: 'access-log',
        component: () => import('@/views/monitor/logs/access-log.vue'),
        meta: {
          icon: 'ri:file-search-line',
          title: '访问日志'
        }
      },
      {
        path: 'sys-log',
        component: () => import('@/views/monitor/logs/operation-log.vue'),
        meta: {
          icon: 'ri:history-fill',
          title: '操作日志'
        }
      }
    ]
  }
]

/**
 * 异常处理路由
 */
export const redirectRoutes = [
  // 打算直接使用未匹配的路径名称导航到该路径，这是必要的
  { path: '/:pathMatch(.*)*', meta: { hidden: true }, redirect: '/error/404' }
]
