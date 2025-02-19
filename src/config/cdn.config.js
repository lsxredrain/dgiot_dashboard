/*
 * @Author: h7ml
 * @Date: 2021-03-15 09:07:01
 * @LastEditTime: 2021-03-18 15:18:53
 * @LastEditors: h7ml
 * @FilePath: \dgiot_dashboard\src\config\cdn.config.js
 * @Description:
 */
module.exports = {
  staticUrl: {
    css: [
      'https://unpkg.com/normalize.css@8.0.1/normalize.css',
      'https://unpkg.com/nprogress@0.2.0/nprogress.css',
      'https://unpkg.com/v-charts@1.19.0/lib/style.min.css',
      'https://unpkg.com/codemirror@5.58.2/lib/codemirror.css',
      'https://unpkg.com/codemirror@5.58.3/addon/lint/lint.css',
      'https://unpkg.com/codemirror@5.58.3/theme/rubyblue.css',
      'https://unpkg.com/zx-markdown-editor@0.0.2/dist/zx-markdown-editor.css',
      'https://unpkg.com/vab-contextmenu@0.0.1/dist/vab-contextmenu.css',
      'https://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/css/topology-vue/topology-vue.css',
    ],
    js: [
      'https://unpkg.com/vue@2.6.12/dist/vue.js', // 这里如果使用了min.js 则无法在控制台使用vue-devtools
      'https://unpkg.com/vue-router/dist/vue-router.min.js',
      'https://unpkg.com/vue-i18n@8.24.1/dist/vue-i18n.min.js',
      'https://unpkg.com/nprogress@0.2.0/nprogress.js',
      'https://unpkg.com/js-md5@0.7.3/build/md5.min.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/ace.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/ext-language_tools.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/mode-json.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/theme-monokai.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/mode-erlang.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/mode-sql.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/theme-eclipse.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/mode-json.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/mode-text.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/theme-gob.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/theme-twilight.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/mode-mysql.js',
      'https://unpkg.com/ace-builds@1.4.9/src-min/mode-python.js',
      'https://unpkg.com/vuedraggable@2.24.3/dist/vuedraggable.umd.min.js',
      'https://unpkg.com/qs@6.9.6/dist/qs.js',
      'https://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/js/mqttws31.js',
      'https://unpkg.com/mqtt@4.2.6/dist/mqtt.min.js',
      'https://unpkg.com/js-base64@3.6.0/base64.js',
      'https://unpkg.com/vuex@3.5.1/dist/vuex.min.js',
      'https://unpkg.com/sortablejs@1.13.0/Sortable.min.js',
      'https://unpkg.com/mqtt@4.2.6/dist/mqtt.min.js',
      'https://unpkg.com/jszip@3.6.0/dist/jszip.min.js',
      'https://unpkg.com/jquery@3.6.0/dist/jquery.min.js',
      'https://unpkg.com/echarts@5.0.2/dist/echarts.min.js',
      'https://unpkg.com/echarts@5.0.2/theme/macarons.js',
      'https://unpkg.com/dayjs@1.10.4/dayjs.min.js',
      'https://unpkg.com/lodash@4.17.21/lodash.min.js',
      'https://unpkg.com/clipboard@2.0.8/dist/clipboard.min.js',
      'https://unpkg.com/axios@0.21.1/dist/axios.min.js',
      'https://unpkg.com/js-cookie@2.2.1/src/js.cookie.js',
      'https://unpkg.com/vue-baidu-map@0.21.22/index.js',
      'https://unpkg.com/moment@2.29.1/min/moment.min.js',
      'https://unpkg.com/v-charts@1.19.0/lib/index.min.js',
      'https://unpkg.com/xlsx@0.16.9/dist/xlsx.min.js',
      'https://unpkg.com/screenfull@5.1.0/dist/screenfull.js',
      'https://unpkg.com/jsplumb@2.15.5/dist/js/jsplumb.min.js',
      'https://unpkg.com/jsencrypt@3.0.1/bin/jsencrypt.min.js',
      'https://unpkg.com/vuedraggable@2.24.3/dist/vuedraggable.umd.min.js',
      'https://unpkg.com/element-china-area-data@5.0.2/dist/app.js',
      'https://unpkg.com/codemirror@5.59.4/lib/codemirror.js',
      'https://unpkg.com/codemirror@5.58.3/mode/javascript/javascript.js',
      'https://unpkg.com/codemirror@5.58.3/addon/lint/json-lint.js',
      'https://unpkg.com/vue-codemirror@4.0.6/dist/vue-codemirror.js',
      'https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js',
      'https://api.map.baidu.com/getscript?v=3.0&ak=fnc5Z92jC7CwfBGz8Dk66E9sXEIYZ6TG',
    ],
  },
}
