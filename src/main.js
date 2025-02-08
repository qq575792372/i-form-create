import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";

const app = createApp(App);

// 引入 vue-router
import router from "./router";

app.use(router);

// element-plus需要手动引入的样式
import "element-plus/es/components/message/style/css";
import "element-plus/theme-chalk/el-message-box.css";
import { ElMessage, ElMessageBox } from "element-plus";

// 使用 element-plus 图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

/* 绑定全局变量 */
// 绑定element-plus的
app.config.globalProperties.$message = ElMessage;
app.config.globalProperties.$alert = ElMessageBox.alert;
app.config.globalProperties.$confirm = ElMessageBox.confirm;
app.config.globalProperties.$prompt = ElMessageBox.prompt;

// 绑定axios的
app.config.globalProperties.$request = axios;

// 挂载实例
app.mount("#app");
