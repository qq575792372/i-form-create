import { FormCreate, FormCreateItem } from "./components/index.js";
import { Tooltips } from "./directives/index.js";

// 安装组件
FormCreate.install = function (app) {
  app.component("FormCreate", FormCreate);
  app.component("FormCreateItem", FormCreateItem);
};

// 安装指令
Tooltips.install = function (app) {
  app.directive("tooltips", Tooltips);
};

// 导出所有
export { FormCreate, FormCreateItem, Tooltips };
