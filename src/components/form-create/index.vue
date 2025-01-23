<template>
  <el-form class="easy-form" ref="formRef" :model="formModel" :rules="formRules" v-bind="formLayout" @submit.prevent>
    <el-row class="easy-form-row" type="flex" v-bind="formLayout.row">
      <!--默认插槽-->
      <slot v-bind="{ formModel, formFields, formRules }" />
      <!--字段配置-->
      <template v-for="item in formFields" :key="`easy-form-item-${item.field}`">
        <easy-form-item
          :ref="`easy-form-item-${item.field}`"
          :item="item"
          :model="formModel"
          :rules="formRules"
          :layout="formLayout"
        >
          <!--字段自定义插槽-->
          <template v-if="item.type === 'slot'" #[getSlotName(item)]="slotProps">
            <slot :name="getSlotName(item)" v-bind="{ formModel, formFields, formRules, ...slotProps }" />
          </template>
        </easy-form-item>
      </template>
    </el-row>
  </el-form>
</template>

<script setup>
import { computed, ref, onMounted, provide, getCurrentInstance, useSlots } from "vue";
import useEasyForm from "@/hooks/easy-form.js";
import EasyFormItem from "./form-item.vue";

defineOptions({ name: "FormCreate" });

// 插槽
const slots = useSlots();
// 属性
const props = defineProps({
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
  // 表单字段配置
  fields: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 表单布局配置
  layout: {
    type: Object,
    default: () => ({}),
  },
});
// 事件
const emits = defineEmits(["submit", "failed", "reset", "cancel"]);

// 获得easy-form-item的插槽名称
const getSlotName = computed(() => {
  return (item) => {
    // 如果该字段配置了slotName，则用slotName，否则默认用field当做插槽名
    return item.slotName || item.field;
  };
});
// 表单布局配置
const formLayout = computed(() => {
  const defaultLayout = {
    /* 表单基础属性 */
    inline: false,
    labelPosition: "right", // 标签文本对齐方式，值：left/right
    labelWidth: 120, // 标签宽度
    labelSuffix: "", // 标签的后缀字符
    hideRequiredAsterisk: false, // 是否隐藏必填星号
    requireAsteriskPosition: "left", // 必填星号的位置
    showMessage: true, // 是否显示校验错误信息
    statusIcon: false, // 是否在输入框中显示校验反馈图标
    validateOnRuleChange: true, // 是否在校验属性改变后立即触发验证
    size: "default", // 表单尺寸
    disabled: false, // 表单元素是否禁用

    /* 表单响应式属性 */
    row: { gutter: 0 }, // 表单的响应式布局，对应el-row接收的参数
    col: { span: 12, offset: 0 }, // 表单字段的响应式布局，对应el-col接收的参数

    /* 表单字段属性 */
    fieldWidth: 240, // 表单字段宽度，默认是240，支持：240/240px/100%/auto等 的width值
  };
  return { ...defaultLayout, ...props.layout };
});
// 表单数据配置
const formModel = computed(() => {
  return props.model;
});
// 表单校验配置
const formRules = computed(() => {
  return props.rules;
});
// 表单字段配置
const formFields = computed(() => {
  return props.fields;
});

// easy-form组件ref
const formRef = ref(null);

// 注入到子组件表单实例
const { proxy } = getCurrentInstance();
provide("formRef", proxy);

// 表单字段初始值，用作重置表单
const resetFormModel = ref({});

/**
 * 初始化表单模型数据
 */
const initFormModel = () => {
  // 初始化字段默认值
  for (let item of formFields.value) {
    // 初始化formModel，无该字段或者该字段没有值，则会默认取字段配置的defaultValue
    if (!formModel.value[item.field]) {
      formModel.value[item.field] = item.defaultValue || "";
    }
    // 初始化表单值，在重置时候用到
    resetFormModel.value[item.field] = item.defaultValue || "";
  }
};

// 使用easy-form表单组件的hooks
const easyForm = useEasyForm({ props, emits, formRef: proxy });

onMounted(() => {
  initFormModel();

  // 将操作字段方法绑定到当前实例
  for (let name in easyForm) {
    proxy[name] = easyForm[name];
  }
});

/** ******************* 以下是表单组件对外部提供的方法 ******************** */
// 表单方法
/**
 * 表单提交
 */
const submit = async (callback) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const valid = await validate();
      if (valid) {
        emits("submit", formModel.value);
      } else {
        emits("failed", "submit failed");
      }
      callback && callback(formModel.value);
      resolve(formModel.value);
    } catch (err) {
      reject();
    }
  });
};
/**
 * 表单重置，并移除所有校验
 */
const reset = async () => {
  formRef.value && formRef.value.resetFields();
  emits("reset");
};
/**
 * 表单取消，一般用作弹框表单关闭
 */
const cancel = async () => {
  emits("cancel");
};

// 校验方法
/**
 * 表单校验
 * @param {Function} callback 回调函数
 * @returns {Promise} 返回校验结果
 */
const validate = async (callback) => {
  return new Promise((resolve) => {
    formRef.value.validate((valid) => {
      callback && callback(valid);
      resolve(valid);
    });
  });
};
/**
 * 表单单个字段进行校验
 * @param {String} field 字段名称
 * @param {Function} callback 回调函数
 * @returns {Promise} 返回校验错误信息
 */
const validateField = async (field, callback) => {
  return new Promise((resolve) => {
    formRef.value.validateField(field, (error) => {
      callback && callback(error);
      resolve(error);
    });
  });
};
/**
 * 重置单个表单项，将其值重置为初始值，并移除校验结果
 * @param {String} field 字段名称
 */
const resetField = async (field) => {
  formModel.value[field] = resetFormModel[field];
  clearValidate(field);
};
/**
 * 重置所有表单项，将其值重置为初始值，并移除校验结果
 */
const resetFields = async () => {
  formRef.value && formRef.value.resetFields();
  _resetCascader();
};
/**
 * 清除单个字段的校验
 * @param {(String|Array|Null)} field 字段名，可以是prop名称，数组，传空则清楚所有校验
 */
const clearValidate = async (field) => {
  formRef.value && formRef.value.clearValidate(field || undefined);
};

/* 内部使用方法 */
/**
 * 重置级联选择组件
 * @private
 */
const _resetCascader = () => {
  // fix：重置时恢复el-cascader的初始状态
  let list = formFields.value.filter((v) => v.type === "cascader");
  for (let item of list) {
    let fieldRef = easyForm.getFieldRef(item.field);
    if (fieldRef) {
      // 清空并收起级联的菜单
      let cascaderPanelRef = fieldRef.ref.$refs[item.field].cascaderPanelRef;
      cascaderPanelRef && cascaderPanelRef.clearCheckedNodes();
    }
  }
};

// 暴露组件方法
defineExpose({
  // easy-form表单ref
  formRef: proxy,

  // easy-form表单方法
  submit,
  reset,
  cancel,
  validate,
  validateField,
  resetField,
  resetFields,
  clearValidate,

  // easy-form提供的操作字段方法
  ...easyForm,
});
</script>

<style scoped lang="scss"></style>
