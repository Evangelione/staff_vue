module.exports = {
  devServer: {
    // proxy: 'http://cs.7youke.com',
    proxy: 'https://www.9youke.com',
    // proxy: 'http://cs.czg365.cn',
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'nav-bar-background-color': '@primary-c',
          'nav-bar-icon-color': 'white',
          'nav-bar-text-color': 'white',
          'nav-bar-title-text-color': 'white',
          'button-primary-background-color': '@primary-c',
          'button-primary-border-color': '@primary-c',
          'tag-primary-color': '@primary-c',
          'switch-on-background-color': '@primary-c',
          'dropdown-menu-title-active-text-color': '@primary-c',
          'dropdown-menu-option-active-color': '@primary-c',
          'tabs-default-color': '@primary-c',
          'picker-action-text-color': '@primary-c',
          'checkbox-checked-icon-color': '@primary-c',
          'radio-checked-icon-color': '@primary-c',
          'primary-c': '#dd8e59',
          'primary-deep-c': '#dd884e',
          'gray-light-c': '#f7f7f7',
          'gray-c': '#dfdfdf',
          'gray-deep-c': '#888',
          'gray-background-c': '#fafafa',
          'font-gray-c': '#666666',
          'red-c': '#ff4646',
          'green-c': '#77ca35',
          'black-c': '#444',
          'black-light-c': '#333',
        },
      },
    },
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/neworder/' : '/',
  configureWebpack: {
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      moment: 'moment',
    },
  },
}
