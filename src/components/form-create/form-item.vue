<template>
  <el-config-provider :locale="elementPlusLocale">
    <slot />
    <template v-if="!formItem.hidden">
      <!-- 隐藏类型的字段-->
      <input v-if="formItem.type === 'hidden'" :key="formItem.field" type="hidden" />

      <!-- 展示类型的字段 -->
      <template v-else>
        <el-col
          class="form-create-col"
          v-bind="{ ...formLayout.col, span: formItem.span || (formLayout.col && formLayout.col.span) }"
        >
          <el-form-item
            class="form-create-item"
            :class="{ 'hide-field-label': formItem.labelWidth === 0 || formLayout.labelWidth === 0 }"
            :label="formItem.label"
            :prop="formItem.prop || formItem.field"
            :label-width="formItem.labelWidth || formLayout.labelWidth"
            :rules="formItem.rules || formRules[formItem.field]"
          >
            <!--表单标签插槽-->
            <template #label>
              <div v-if="slots.label" class="form-create-item-label" v-tooltips="{ enable: formLayout.showTooltips }">
                <slot name="label" :formItem="formItem" />
              </div>
              <div v-else class="form-create-item-label" v-tooltips="{ enable: formLayout.showTooltips }">
                {{ formItem.label }}
              </div>
            </template>

            <!-- Text 文本 -->
            <template v-if="formItem.type === 'text'">
              <div class="content">
                {{ formModel[formItem.fieldDesc || formItem.field] }}
              </div>
            </template>

            <!-- Input 输入框 -->
            <template v-if="formItem.type === 'input'">
              <el-input
                :ref="formItem.field"
                v-model="currentValue"
                v-bind="{
                  ...formItem.props,
                  class: formItem.class,
                  style: formItem.style,
                }"
                @change="handleEffectChanged"
                v-on="fieldEvents"
              />
            </template>

            <!-- Textarea 文本域-->
            <template v-if="formItem.type === 'textarea'">
              <el-input
                :ref="formItem.field"
                v-model="currentValue"
                v-bind="{
                  rows: 4,
                  ...formItem.props,
                  class: formItem.class,
                  style: formItem.style,
                  type: 'textarea',
                }"
                @change="handleEffectChanged"
                v-on="fieldEvents"
              />
            </template>

            <!-- InputNumber 数字输入框 -->
            <template v-if="formItem.type === 'input-number'">
              <el-input-number
                :ref="formItem.field"
                v-model="currentValue"
                v-bind="{
                  ...formItem.props,
                  class: formItem.class,
                  style: formItem.style,
                }"
                @change="handleEffectChanged"
                v-on="fieldEvents"
              />
            </template>

            <!-- InputNumberRange 数字区间输入框 -->
            <template v-if="formItem.type === 'input-number-range'">
              <input-number-range
                :ref="formItem.field"
                v-model="currentValue"
                :item="item"
                @change="handleEffectChanged"
                v-on="fieldEvents"
              />
            </template>

            <!-- Select 下拉框 -->
            <template v-if="formItem.type === 'select'">
              <el-select
                :ref="formItem.field"
                v-model="currentValue"
                :loading="fieldLoading"
                v-bind="{
                  ...formItem.props,
                  class: formItem.class,
                  style: formItem.style,
                }"
                @change="handleEffectChanged"
                @focus="handleFieldFocus"
                v-on="fieldEvents"
              >
                <el-option
                  v-for="(cItem, cIndex) in (formItem.props && formItem.props.options) || []"
                  :key="cIndex"
                  :label="cItem[_getLabelValue()['labelKey']]"
                  :value="cItem[_getLabelValue()['valueKey']]"
                />
              </el-select>
            </template>

            <!-- Radio 单选框 -->
            <template v-if="formItem.type === 'radio'">
              <el-radio-group
                :ref="formItem.field"
                v-model="currentValue"
                v-bind="{
                  ...formItem.props,
                  class: formItem.class,
                  style: formItem.style,
                }"
                @change="handleEffectChanged"
                v-on="fieldEvents"
              >
                <el-radio
                  v-for="(cItem, cIndex) in (formItem.props && formItem.props.options) || []"
                  :key="cIndex"
                  :label="cItem[_getLabelValue()['valueKey']]"
                >
                  {{ cItem[_getLabelValue()["labelKey"]] }}
                </el-radio>
              </el-radio-group>
            </template>

            <!-- Checkbox 复选框 -->
            <template v-if="formItem.type === 'checkbox'">
              <el-checkbox-group
                :ref="formItem.field"
                v-model="currentValue"
                v-bind="{
                  ...formItem.props,
                  class: formItem.class,
                  style: formItem.style,
                }"
                @change="handleEffectChanged"
                v-on="fieldEvents"
              >
                <el-checkbox
                  v-for="(cItem, index) in (formItem.props && formItem.props.options) || []"
                  :key="index"
                  :value="cItem[_getLabelValue()['valueKey']]"
                >
                  {{ cItem[_getLabelValue()["labelKey"]] }}
                </el-checkbox>
              </el-checkbox-group>
            </template>

            <!-- Switch 开关 -->
            <template v-if="formItem.type === 'switch'">
              <el-switch
                :ref="formItem.ref"
                v-model="currentValue"
                v-bind="{
                  ...formItem.props,
                  class: formItem.class,
                  style: formItem.style,
                }"
                @change="handleEffectChanged"
                v-on="fieldEvents"
              />
            </template>

            <!-- Date 日期 -->
            <template v-if="formItem.type === 'date'">
              <el-date-picker
                :ref="formItem.field"
                v-model="currentValue"
                v-bind="{
                  type: 'date',
                  valueFormat: 'YYYY-MM-DD',
                  ...formItem.props,
                  class: formItem.class,
                  style: formItem.style,
                }"
                @change="handleEffectChanged"
                v-on="fieldEvents"
              />
            </template>

            <!-- Time 时间 -->
            <template v-if="formItem.type === 'time'">
              <el-time-picker
                :ref="formItem.ref"
                v-model="currentValue"
                v-bind="{
                  type: 'time',
                  ...formItem.props,
                  class: formItem.class,
                  style: formItem.style,
                }"
                @change="handleEffectChanged"
                v-on="fieldEvents"
              />
            </template>

            <!-- DateTime 日期时间 -->
            <template v-if="formItem.type === 'datetime'">
              <el-date-picker
                :ref="formItem.field"
                v-model="currentValue"
                v-bind="{
                  type: 'datetime',
                  valueFormat: 'YYYY-MM-DD HH:mm:ss',
                  ...formItem.props,
                  class: formItem.class,
                  style: formItem.style,
                }"
                @change="handleEffectChanged"
                v-on="fieldEvents"
              />
            </template>

            <!-- Cascader 级联选择框 -->
            <template v-if="formItem.type === 'cascader'">
              <el-cascader
                :ref="formItem.field"
                v-model="currentValue"
                v-bind="{
                  emitPath: false,
                  props: {
                    label: _getLabelValue()['labelKey'],
                    value: _getLabelValue()['valueKey'],
                    children: _getLabelValue()['childrenKey'],
                  },
                  ...formItem.props,
                  class: formItem.class,
                  style: formItem.style,
                }"
                @change="handleEffectChanged"
                @focus="handleFieldFocus"
                v-on="fieldEvents"
              ></el-cascader>
            </template>

            <!-- 子级表单 -->
            <template v-if="formItem.type === 'children'">
              <el-row
                class="form-create-row has-buttons"
                type="flex"
                v-bind="formLayout.row"
                v-for="(childModel, childIndex) in currentValue || []"
                :key="childIndex"
                :span="24"
              >
                <FormCreateItem
                  v-for="(cItem, cIndex) in formItem.children || []"
                  :key="`form-create-item-${cItem.field}`"
                  :ref="`form-create-item-${cItem.field}`"
                  :item="cItem"
                  :model="childModel"
                  :rules="formRules"
                  :layout="formLayout"
                />
                <div class="form-create-item-buttons">
                  <el-button
                    type="primary"
                    icon="Plus"
                    circle
                    size="small"
                    @click="handleAdd(formModel[formItem.field], childIndex)"
                  />
                  <el-button
                    type="danger"
                    icon="Delete"
                    circle
                    size="small"
                    @click="handleDelete(formModel[formItem.field], childIndex)"
                  />
                </div>
              </el-row>
            </template>

            <!-- Slot 自定义 -->
            <template v-if="formItem.type === 'slot'">
              <!--优先以自定义slotName为插槽，不同字段可以定义同一个slotName-->
              <slot v-if="formItem.slotName" :name="formItem.slotName" v-bind="{ formModel, formRules, formItem }" />
              <!--否则默认用field为插槽-->
              <slot v-else :name="formItem.field" v-bind="{ formModel, formRules, formItem }" />
            </template>
          </el-form-item>
        </el-col>
      </template>
    </template>
  </el-config-provider>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, getCurrentInstance, inject, useSlots } from "vue";
import useFormCreateItem from "@/hooks/form-create-item.js";
import InputNumberRange from "./components/input-number-range.vue";
import axios from "axios";
import { Tooltips as vTooltips } from "@/directives/index.js";
import { isFunction, isFunctionString, getTargetValueByPath, setTargetValueByPath } from "@ivu-plus/i-utils";

// element-plus组件语言为中文
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

const elementPlusLocale = ref(zhCn);

defineOptions({ name: "FormCreateItem" });

// 插槽
const slots = useSlots();
// 属性
const props = defineProps({
  // 当前字段配置
  item: {
    type: Object,
    default: () => ({}),
  },
  // 表单数据配置
  model: {
    type: Object,
    default: () => ({}),
  },
  // 表单校验配置
  rules: {
    type: Object,
    default: () => ({}),
  },
  // 表单布局
  layout: {
    type: Object,
    default: () => ({}),
  },
});
// 事件
const emits = defineEmits([]);

// 当前字段配置
const formItem = computed(() => {
  return props.item;
});
// 表单数据配置
const formModel = computed(() => {
  return props.model;
});
// 表单校验配置
const formRules = computed(() => {
  return props.rules;
});
// 字段事件
const fieldEvents = computed(() => {
  if (formItem.value.events === null) return {};
  const events = {};
  for (let name in formItem.value.events) {
    events[name] = (...event) => {
      // 默认的参数
      let args = ["value", "item", "ref", "formRef"];
      // 数字输入框的参数
      if (formItem.value.type === "input-number") {
        args = ["newValue", "oldValue", "item", "ref", "formRef"];
      }
      // 是函数类型，直接回调
      if (isFunction(formItem.value.events[name])) {
        return formItem.value.events[name](...event, formItem.value, proxy, formRef);
      }
      // 是函数字符串类型，需要处理转换下，再回调
      else if (isFunctionString(formItem.value.events[name])) {
        const fn = new Function(...args, "return " + formItem.value.events[name]);
        // 传递组件回调的参数以及当前字段配置
        return fn.call(proxy, ...event, formItem.value, proxy, formRef)(...event, formItem.value, proxy, formRef);
      } else {
        throw new Error(`${formItem.value.field} event must be a function`);
      }
    };
  }
  return events;
});
// 表单布局
const formLayout = computed(() => {
  return props.layout;
});
// 表单字段的宽度
const formFieldWidth = computed(() => {
  if (typeof formLayout.value.fieldWidth === "number") {
    return formLayout.value.fieldWidth + "px";
  } else {
    return formLayout.value.fieldWidth;
  }
});
// 当前字段绑定的值
const currentValue = computed({
  get() {
    return getTargetValueByPath(formModel.value, formItem.value.field);
  },
  set(value) {
    setTargetValueByPath(formModel.value, formItem.value.field, `'${value}'`);
  },
});

/* 组件中声明的变量 */
// 获得父组件中传递的$axios，如果没有，则用包中的axios
let $axios = inject("$axios");
if (!$axios) {
  $axios = axios;
}
// 获取父组件实例
const formRef = inject("formRef");
// 获取当前组实例
const { proxy } = getCurrentInstance();
// 组件用的字段loading
const fieldLoading = ref(false);

// 使用form-create表单组件的hooks
const formCreateItem = useFormCreateItem({ props, emits, ref: proxy, formRef });

// 声明周期
onMounted(() => {
  initField();

  // 将操作字段方法绑定到当前实例
  for (let name in formCreateItem) {
    proxy[name] = formCreateItem[name];
  }
});

/* 组件中声明的方法 */
/**
 * 初始化字段配置
 */
const initField = async () => {
  // 初始化自定义request配置
  if (formItem.value.request) {
    // 是Object对象形式，可以通过配置的参数在这里发起请求
    if (typeof formItem.value.request === "object") {
      // 非懒加载，会自动调用接口
      if (!formItem.value.props || !formItem.value.props.lazy) {
        await _fieldRequest();
      }
    }
    // 是Function异步函数形式，可以获取到函数返回的结果
    else if (typeof formItem.value.request === "function") {
      // 判断是异步函数还是普通函数
      if (formItem.value.request.toString().indexOf("async") > -1) {
        formItem.value.props["options"] = await formItem.value.request();
      } else {
        formItem.value.props["options"] = formItem.value.request();
      }
    }
    // 其他request不合法
    else {
      console.error("request type error");
    }
  }

  // 初始化静态options数据列表
  else if (formItem.value.props && formItem.value.props.options && formItem.value.props.options.length) {
    formItem.value.props["options"] = await _filterOptions(formItem.value.props.options);
  }

  // 初始化联动effects
  if (formItem.value.effects) {
    await nextTick();
    handleEffectCreated(formModel.value[formItem.value.field]);
  }

  // 初始化懒加载的字段
  if (formItem.value.props && formItem.value.props.lazy) {
    await _fieldLazy();
  }
};

// 表单实例
/**
 * 获取父组件表单的实例
 * @description 必须父组件注入了formRef实例才可以
 * @returns {Object}
 */
const getFormRef = () => {
  return formRef;
};

/** ******************* 组件自身使用的方法 *********************/
/**
 * 字段聚焦
 */
const handleFieldFocus = () => {
  // 当字段配置了lazy懒加载，则聚焦时候调用
  formItem.value.props && formItem.value.props.lazy && _fieldRequest();
};

/**
 * 字段联动的操作，支持简单变量表达式和函数
 * @description 字段联动类型分为created和changed，区别是created是在初始化自动执行，changed是在字段改变时候执行
 * @param {Any} value 当前字段的值，可以是defaultValue和value
 */
// 初始化的联动
const handleEffectCreated = (value) => {
  _parseEffect(value, "created");
};
// 改变时的联动
const handleEffectChanged = (value) => {
  _parseEffect(value, "changed");
};

/**
 * 子级表单的按钮方法
 */
const handleAdd = (children, childIndex) => {
  children.splice(childIndex, 0, children.splice(childIndex, 1, {})[0]);
};
const handleDelete = (children, childIndex) => {
  children.splice(childIndex, 1);
};

/** ******************* 组件内部函数使用的方法 ******************** */
/**
 * 字段请求的处理
 * description 获取到request中的配置
 * @private
 */
const _fieldRequest = async () => {
  fieldLoading.value = true;
  // 动态api请求参数
  const api = {
    ...formItem.value.request,
    url: formItem.value.request.url,
    method: formItem.value.request.method || "get",
    headers: formItem.value.request.headers || {},
  };
  if (api.method === "get") {
    api.params = formItem.value.request.params;
  } else {
    api.data = formItem.value.request.data;
  }
  // 发起请求
  let res = await $axios(api).catch(() => {
    fieldLoading.value = false;
  });
  // 通过传递的数据路径名称，动态获取指定的属性，比如data.dicItems
  if (res && res.data && typeof res.data === "object") {
    formItem.value.props["options"] = getTargetValueByPath(res, formItem.value.request.dataName);
  }
  fieldLoading.value = false;
};

/**
 * 字段懒加载的处理
 * @private
 * @description 比如是下拉框，没有设置列表数据时，先设置了值是不会显示对应的label的，该方法会默认先显示对应的label
 */
const _fieldLazy = async () => {
  await nextTick();
};

/**
 * 解析字段联动的表达式
 * @private
 * @param {Any} value 当前字段的值
 * @param {String} eventName 字段联动的事件类型
 */
const _parseEffect = async (value, eventName) => {
  if (!formItem.value.effects || !formItem.value.effects[eventName]) return;

  // 是函数，直接执行
  if (isFunction(formItem.value.effects[eventName])) {
    return formItem.value.effects[eventName](value, formItem.value, proxy, formRef);
  }
  // 是函数字符串，需要处理转换下，再执行
  else if (isFunctionString(formItem.value.effects[eventName])) {
    let effectFn = new Function("value", "item", "ref", "formRef", "return " + formItem.value.effects[eventName]);
    return effectFn.call(proxy, value, formItem.value, proxy, formRef)(value, formItem.value, proxy, formRef);
  }
  // 是变量表达式
  else {
    await nextTick();
    const fxArr = formItem.value.effects[eventName]
      .split(";")
      .filter((v) => !!v)
      .map((v) => v.replace(/\s/g, ""));
    fxArr.forEach((fx) => {
      // 将表达式分割为属性和值，如 'deptOid.props.disabled=true' 获取到 ['deptOid.props.disabled',true];
      let fieldArr = fx.split("=");
      // 获取属性和值
      let attrKey = fieldArr[0];
      let attrValue = fieldArr[1];
      // 值支持占位符
      attrValue = attrValue.replace("%value", `'${value}'`);
      // 根据属性获取到该对象，如 'deptOid.props.disabled=true' 获取到deptOid该字段
      let fieldName = attrKey.substring(0, attrKey.indexOf("."));
      let item = formRef && formRef.getFieldRef(fieldName) && formRef.getFieldRef(fieldName).formItem;
      // 获取到对象中的属性路径，如 'deptOid.props.disabled=true' 会获取到'props.disabled'
      let fieldStr = attrKey.substring(attrKey.indexOf(".") + 1);
      // 根据属性路径，修改对应的值，注意：一些影响页面视图的属性在修改时，目前是需要在字段配置中有初始值
      item && setTargetValueByPath(item, fieldStr, attrValue);
    });
  }
};

/**
 * 获取选项数据对应的label和value的名称
 * @private
 * @description 默认返回label、value、children，否则返回labelKey/valueKey/childrenKey对应的值
 * @returns {Object} 返回labelKey、valueKey、childrenKey
 */
const _getLabelValue = () => {
  // 获取配置中的键名和值名，支持以下几种写法
  const labelKey = formItem.value.props["labelKey"] || formItem.value.props["label-key"];
  const valueKey = formItem.value.props["valueKey"] || formItem.value.props["value-key"];
  const childrenKey = formItem.value.props["childrenKey"] || formItem.value.props["children-key"];
  // 返回统一的key名称
  return {
    labelKey: labelKey || "label",
    valueKey: valueKey || "value",
    childrenKey: childrenKey || "children",
  };
};

/**
 * 过滤列表的数据，目前最多只计算两层
 * @private
 * @param {Array} source 列表数据
 * @returns {Object} 返回通过props中配置的includes和excludes过滤后的数据
 */
const _filterOptions = (source) => {
  const props = formItem.value.props || {};
  const includeArr = props.includes || [];
  const excludeArr = props.excludes || [];

  // 没有配置过滤条件，返回原数据
  if (includeArr.length === 0 && excludeArr.length === 0) {
    return source;
  }
  // 判断包含和排除关系只能存在一种
  if (includeArr.length > 0 && excludeArr.length > 0) {
    throw new Error(`${formItem.value.field} props only exists includes or excludes`);
  }

  // 获取到label和value的名称
  const { valueKey } = _getLabelValue();
  // 包含的数据
  const getIncludeData = function (arr) {
    const res = [];
    for (const v of arr) {
      const temp = { ...v };
      if (temp.children && temp.children.length) {
        temp.children = getIncludeData(temp.children);
      }
      if (includeArr.includes(v[valueKey])) {
        res.push(temp);
      }
    }
    return res;
  };
  // 排除的数据
  const getExcludeData = function (arr) {
    const res = [];
    for (const v of arr) {
      const temp = { ...v };
      if (temp.children && temp.children.length) {
        temp.children = getExcludeData(temp.children);
      }
      if (!excludeArr.includes(v[valueKey])) {
        res.push(temp);
      }
    }
    return res;
  };
  // 过滤后的数据
  if (includeArr.length > 0) {
    return getIncludeData(source);
  } else if (excludeArr.length > 0) {
    return getExcludeData(source);
  } else {
    return [];
  }
};

defineExpose({
  formItem: props.item,
  formModel: props.model,
  formRules: props.rules,
  formLayout: props.layout,
  ref: proxy,
  ...formCreateItem,
});
</script>

<style scoped lang="scss">
.form-create-col {
  :deep(.form-create-item) {
    margin-bottom: 16px;

    &.hide-field-label {
      .el-form-item__label {
        display: none;
      }

      .el-form-item__content {
        margin-left: 0 !important;
      }
    }

    .form-create-row {
      width: 100%;
      /* 包含按钮操作 */
      &.has-buttons {
        position: relative;

        .form-create-item-buttons {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          margin: auto;
        }
      }
    }

    .el-form-item__content {
      > .el-input,
      > .input-number-range-wrapper,
      > .el-input-number,
      > .el-select,
      > .el-date-editor,
      > .el-date-editor--daterange,
      > .el-cascader {
        width: calc(v-bind(formFieldWidth));
        min-width: var(--sp40);
        flex-shrink: 0;
      }

      /* 日期区间 */
      > .el-date-editor--daterange {
        flex-grow: 0;
        box-sizing: border-box;

        .el-range-input {
          flex: 1;
          width: 100%;
          flex-shrink: 0;
        }
      }

      /* 数字输入框 */
      > .input-number-range-wrapper {
        .el-input-number {
          flex: 1;
          flex-shrink: 0;
        }
      }

      /* 级联选择 */
      > .el-cascader {
        .el-input {
          .el-input__inner {
            height: var(--el-input-inner-height) !important;
          }
        }

        .el-cascader__tags {
          flex-wrap: nowrap;
          right: var(--sp32);
          left: var(--sp2);

          .el-tag.el-tag--info:nth-child(1) {
            flex: 1;
            overflow: hidden;
          }

          .el-tag.el-tag--info:nth-child(2) {
            flex: none;
            margin: 0;
            padding: 0 var(--sp2);
          }
        }
      }
    }
  }
}
</style>
