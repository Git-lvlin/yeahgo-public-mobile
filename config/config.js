// https://umijs.org/config/
import { defineConfig } from 'umi'
import defaultSettings from './defaultSettings'
import proxy from './proxy'
import user from './routes/user'
import setting from './routes/setting'
import communityStore from './routes/community-store'
import mail from './routes/mail'
import earningReport from './routes/earning-report'
import deliveryOrderManagement from './routes/delivery-order-management'
import outboundWarehouseManagement from './routes/outbound-warehouse-management'
import financialManagement from './routes/financial-management'
import intensiveManagement from './routes/intensive-management'
import backordersManagement from './routes/backorders-management'

const { REACT_APP_ENV } = process.env;
const config = {
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  fastRefresh: {},
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        user,
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/workplace',
            },
            {
              path: '/workplace',
              name: 'workplace',
              component: './workplace',
            },
            setting,
            communityStore,
            mail,
            earningReport,
            intensiveManagement,
            deliveryOrderManagement,
            outboundWarehouseManagement,
            financialManagement,
            backordersManagement,
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  esbuild: {},
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
}
if (process.env.NODE_ENV !== 'development') {
  config.chunks = ['vendors', 'umi'];
  config.chainWebpack = function (config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
          },
        },
      }
    });
  }
}
export default defineConfig(config);
