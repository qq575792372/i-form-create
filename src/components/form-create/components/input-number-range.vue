<template>
  <div class="input-number-range-wrapper">
    <el-input-number
      :ref="formItem.field"
      v-model="startValue"
      v-bind="{
        ...formItem.props,
        class: formItem.class,
        style: formItem.style,
      }"
      v-on="getEvents"
    />
    <span class="range-separator">{{ formItem.rangeSeparator || "-" }}</span>
    <el-input-number
      :ref="formItem.field"
      v-model="endValue"
      v-bind="{
        ...formItem.props,
        class: formItem.class,
        style: formItem.style,
      }"
      v-on="getEvents"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

defineOptions({ name: "InputNumberRange" });

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
});

const emits = defineEmits(["change", "blur", "focus"]);
// 当前字段配置
const formItem = computed(() => {
  return props.item;
});

// 字段双向绑定
const modelValue = defineModel({ type: Array, default: [] });
// 开始值
const startValue = computed({
  get() {
    return modelValue.value[0];
  },
  set(value) {
    modelValue.value[0] = value;
  },
});
// 结束值
const endValue = computed({
  get() {
    return modelValue.value[1];
  },
  set(value) {
    modelValue.value[1] = value;
  },
});

// 组件事件
const getEvents = {
  change: (...args) => emits("change", modelValue.value),
  blur: (...args) => emits("blur", ...args),
  focus: (...args) => emits("focus", ...args),
};
</script>

<style scoped lang="scss">
.input-number-range-wrapper {
  display: inline-flex;

  .range-separator {
    padding: 0 var(--sp8);
    color: var(--text-desc-color);
  }
}
</style>
